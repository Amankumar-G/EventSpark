import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/dbConfig/dbConfig'
import Event from '@/models/Event'
import { auth } from '@clerk/nextjs/server'
import User from '@/models/User'
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connect()
    
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Parse form data using NextRequest's built-in formData method
    const formData = await req.formData()
    
    // Extract form fields
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const location = formData.get('location') as string
    const ticketTypes = formData.get('ticketTypes') as string
    const isPublic = formData.get('isPublic') as string
    const formConfigRaw = formData.get('formConfig') as string;
    const formConfig = formConfigRaw ? JSON.parse(formConfigRaw) : null;
    // Extract files
    const banner = formData.get('banner') as File | null
    const brochure = formData.get('brochure') as File | null
    const speakers = formData.getAll('speakers') as File[]

    const upload = async (file: File, folder: string) => {
      // Convert File to buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: `events/${folder}`,
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result?.secure_url)
          }
        ).end(buffer)
      })
    }

    // Upload files
    const bannerUrl = banner ? await upload(banner, "banners") : null
    const brochureUrl = brochure ? await upload(brochure, "brochures") : null

    let speakerUrls: string[] = []
    if (speakers && speakers.length > 0) {
      for (let speaker of speakers) {
        if (speaker instanceof File) {
          const url = await upload(speaker, "speakers")
          speakerUrls.push(url as string)
        }
      }
    }

    // Find the user in your database
    const user = await User.findOne({ clerkId: userId })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Prepare the final event data
    const eventData = {
      title,
      slug,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location: JSON.parse(location),
      ticketTypes: JSON.parse(ticketTypes),
      isPublic: isPublic === "true",
      formConfig,
      status: "pending",
      bannerUrl,
      brochureUrl,
      speakerImages: speakerUrls,
      organizer: user._id, // Use the MongoDB ObjectId, not Clerk userId
    }
    // Create and save the event
    const event = new Event(eventData)
    const savedEvent = await event.save()

    return NextResponse.json({ success: true, event: savedEvent }, { status: 201 })
  } catch (err) {
    console.error('POST Error:', err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connect()

    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const user = await User.findOne({ clerkId: userId })
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    let events

    if (user.role === 'admin') {
      events = await Event.find().populate('organizer', 'name email').sort({ createdAt: -1 })
    } else if (user.role === 'organizer') {
      events = await Event.find({ organizer: user._id }).populate('organizer', 'name email').sort({ createdAt: -1 })
    } else {
      // For regular users, only show public events
      events = await Event.find({ isPublic: true, status: 'approved' }).populate('organizer', 'name email').sort({ createdAt: -1 })
    }

    return NextResponse.json({ success: true, events }, { status: 200 })
  } catch (error: any) {
    console.error('GET Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}