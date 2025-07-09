// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connect } from '@/dbConfig/dbConfig';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { generateAttendeeId, generateBookingReference, validateTicketAvailability } from '@/lib/booking-utils';

export async function POST(request: NextRequest) {
  try {
    await connect();
    
    const { eventId, ticketSelections, attendeeData } = await request.json();
    
    // Validate required fields
    if (!eventId || !ticketSelections || !attendeeData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Fetch event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Validate event status
    if (event.status !== 'approved') {
      return NextResponse.json(
        { error: 'Event is not available for registration' },
        { status: 400 }
      );
    }
    
    // Validate ticket availability
    const validation = validateTicketAvailability(event, ticketSelections);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid ticket selection', details: validation.errors },
        { status: 400 }
      );
    }
    
    // Calculate total amount and check if there are paid items
    let totalAmount = 0;
    let hasPaidItems = false;
    const lineItems = [];
    
    for (const selection of ticketSelections) {
      const ticketType = event.ticketTypes[selection.ticketTypeIndex];
      const itemTotal = ticketType.price * selection.quantity;
      totalAmount += itemTotal;
      
      if (ticketType.price > 0) {
        hasPaidItems = true;
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${event.title} - ${ticketType.name}`,
              description: `Event: ${event.title}`,
              metadata: {
                eventId: eventId,
                ticketTypeIndex: selection.ticketTypeIndex.toString(),
              },
            },
            unit_amount: Math.round(ticketType.price * 100), // Convert to cents
          },
          quantity: selection.quantity,
        });
      }
    }
    
    // Generate IDs
    const attendeeId = generateAttendeeId();
    const bookingReference = generateBookingReference();
    
    // Create booking record
    const booking = new Booking({
      eventId,
      attendeeId,
      attendeeData,
      ticketSelections: ticketSelections.map((selection: any) => ({
        ticketTypeIndex: selection.ticketTypeIndex,
        quantity: selection.quantity,
        priceAtBooking: event.ticketTypes[selection.ticketTypeIndex].price,
      })),
      totalAmount,
      paymentStatus: hasPaidItems ? 'pending' : 'free',
      bookingReference,
    });
    
    // Handle free registration
    if (!hasPaidItems) {
      await booking.save();
      
      // Add attendee to event
      await Event.findByIdAndUpdate(eventId, {
        $push: {
          attendees: {
            attendeeId,
            data: attendeeData,
          },
        },
      });
      
      // Update sold count for each ticket type
      for (const selection of ticketSelections) {
        await Event.findOneAndUpdate(
          { 
            _id: eventId,
            [`ticketTypes.${selection.ticketTypeIndex}`]: { $exists: true }
          },
          {
            $inc: {
              [`ticketTypes.${selection.ticketTypeIndex}.sold`]: selection.quantity
            }
          }
        );
      }
      
      return NextResponse.json({
        success: true,
        type: 'free',
        bookingReference,
        attendeeId,
        message: 'Free registration completed successfully',
      });
    }
    
    // Create Stripe checkout session for paid tickets
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/booking/cancel?booking_ref=${bookingReference}`,
      customer_email: attendeeData.email,
      metadata: {
        eventId,
        bookingId: booking._id.toString(),
        attendeeId,
        bookingReference,
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });
    
    // Update booking with session ID
    booking.stripeSessionId = session.id;
    await booking.save();
    
    return NextResponse.json({
      success: true,
      type: 'paid',
      sessionId: session.id,
      bookingReference,
      attendeeId,
    });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
}