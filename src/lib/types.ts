// Describes a single item in our static data array
export interface PexelImage {
  position: [number, number, number];
  rotation: [number, number, number];
  url: string;
  title?: string;
  type?: 'image' | 'video';
  videoId?: string; // YouTube video ID
}

// Describes a song item for the music box and API usage
export interface Song {
  id: string;
  title: string;
  artist: string;
  image?: string; // URL to image (YouTube thumbnail or cover) - optional
  videoId?: string; // YouTube video ID if available
  vector?: readonly number[]; // Optional vector for embedding (readonly from API)
  // Add other fields as needed (e.g., links, etc.)
}
