// src/app/api/webhooks/user-events/route.ts
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Missing Svix headers', { status: 400 });
    }

    const payload = await request.text();
    const body = JSON.parse(payload);

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SIGNING_SECRET to your environment variables');
    }

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error verifying webhook', { status: 400 });
    }

    const eventType = evt.type;
    const user = evt.data;

    await connect();

    // Handle user.created
    if (eventType === 'user.created' && 'email_addresses' in user) {
      await User.create({
        clerkId: user.id,
        email: user.email_addresses?.[0]?.email_address || '',
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        role: user.unsafe_metadata?.role || 'attendee',
        profileImage: user.image_url || '',
      });

      return new Response(JSON.stringify({ message: 'User created' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Handle user.deleted
    if (eventType === 'user.deleted') {
      await User.findOneAndDelete({ clerkId: user.id });

      return new Response(JSON.stringify({ message: 'User deleted' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ignore other events
    return new Response('Event ignored', { status: 200 });
  } catch (e) {
    console.error('❌ Webhook error:', e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET() {
  return new Response('Webhook endpoint for user.created and user.deleted', {
    status: 200,
  });
}
