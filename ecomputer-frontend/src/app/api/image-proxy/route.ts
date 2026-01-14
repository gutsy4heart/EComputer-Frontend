import { NextRequest, NextResponse } from 'next/server';

/**
 * API route handler for proxying images from external sources
 * This helps avoid CORS issues when displaying images from external domains
 * 
 * @param request The incoming request with the image URL as a query parameter
 * @returns The image data with appropriate headers
 */
export const dynamic = 'force-dynamic'; // Ensure this route is not statically optimized

export async function GET(request: NextRequest) {
  try {
    // Get the URL from the query parameters
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      console.error('Image proxy error: No URL provided');
      return NextResponse.json(
        { error: 'No URL provided' },
        { status: 400 }
      );
    }
    
    // Validate the URL
    try {
      new URL(url);
    } catch (error) {
      console.error(`Image proxy error: Invalid URL - ${url}`);
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }
    
    console.log(`Image proxy: Fetching image from ${url}`);
    
    // Fetch the image with no-cache to ensure fresh content
    const response = await fetch(url, {
      headers: {
        // Set a user agent to avoid being blocked by some servers
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`Image proxy error: Failed to fetch image - ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Get the image data
    const imageData = await response.arrayBuffer();
    
    // Get the content type from the response headers
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    console.log(`Image proxy: Successfully fetched image (${contentType}, ${imageData.byteLength} bytes)`);
    
    // Create a new response with the image data and appropriate headers
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error in image-proxy API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
