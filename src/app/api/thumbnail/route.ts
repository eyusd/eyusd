import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    // YouTube thumbnail URLs - using maxresdefault for highest quality
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    // Fetch the thumbnail
    let response = await fetch(thumbnailUrl);
    
    if (!response.ok) {
      // Fallback to high quality thumbnail if maxres doesn't exist
      const fallbackUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      response = await fetch(fallbackUrl);
      
      if (!response.ok) {
        return NextResponse.json({ error: 'Thumbnail not found' }, { status: 404 });
      }
    }

    const buffer = await response.arrayBuffer();
    
    // Process the image with Sharp to make it square
    const imageBuffer = Buffer.from(buffer);
    const processedImage = await sharp(imageBuffer)
      .resize(400, 400, {
        fit: 'cover', // This will crop to fill the square while maintaining aspect ratio
        position: 'center'
      })
      .jpeg({ quality: 90 })
      .toBuffer();
    
    return new NextResponse(new Uint8Array(processedImage), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });

  } catch (error) {
    console.error('Thumbnail API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
