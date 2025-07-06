import { NextRequest, NextResponse } from 'next/server';
import { qdrantClient, QDRANT_COLLECTION_NAME } from '@/lib/qdrant';
import { Song } from '@/lib/types';

// Disable NextJS caching for this route
export const dynamic = 'force-dynamic';

const K_NEAREST_NEIGHBORS = 8;
const FETCH_MULTIPLIER = 4; // Fetch 4x more songs to have variety to choose from
const MAX_SONGS_PER_ARTIST = 2;

// Helper function to extract YouTube video ID from URL
function extractVideoId(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return undefined;
}

// Seeded random number generator for deterministic randomness
function seededRandom(seed: string): () => number {
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash as seed for a simple LCG (Linear Congruential Generator)
  let state = Math.abs(hash);
  
  return function() {
    state = (state * 1664525 + 1013904223) % Math.pow(2, 32);
    return state / Math.pow(2, 32);
  };
}

// Helper function to diversify song selection
function diversifySongs(songs: Song[], targetCount: number = K_NEAREST_NEIGHBORS, seed?: string, preserveOrder: boolean = false): Song[] {
  const artistCounts = new Map<string, number>();
  const selectedSongs: Song[] = [];
  
  if (preserveOrder) {
    // For similarity-based selection: keep top 5 closest, then diversify the rest
    const TOP_SIMILAR_COUNT = 5;
    
    // First pass: select top similar songs (in order) while respecting artist limits
    for (const song of songs) {
      if (selectedSongs.length >= Math.min(TOP_SIMILAR_COUNT, targetCount)) break;
      
      const primaryArtist = song.artist.split(',')[0].trim().toLowerCase();
      const currentCount = artistCounts.get(primaryArtist) || 0;
      
      if (currentCount < MAX_SONGS_PER_ARTIST) {
        selectedSongs.push(song);
        artistCounts.set(primaryArtist, currentCount + 1);
      }
    }
    
    // Second pass: diversify the remaining slots
    if (selectedSongs.length < targetCount) {
      // Get remaining songs not yet selected
      const remainingSongs = songs.filter(song => 
        !selectedSongs.find(s => s.id === song.id)
      );
      
      // Shuffle remaining songs for diversity
      let shuffledRemaining: Song[];
      if (seed) {
        const random = seededRandom(seed + '_remaining');
        shuffledRemaining = [...remainingSongs].sort(() => random() - 0.5);
      } else {
        shuffledRemaining = [...remainingSongs].sort(() => Math.random() - 0.5);
      }
      
      // Fill remaining slots with diverse selection
      for (const song of shuffledRemaining) {
        if (selectedSongs.length >= targetCount) break;
        
        const primaryArtist = song.artist.split(',')[0].trim().toLowerCase();
        const currentCount = artistCounts.get(primaryArtist) || 0;
        
        if (currentCount < MAX_SONGS_PER_ARTIST) {
          selectedSongs.push(song);
          artistCounts.set(primaryArtist, currentCount + 1);
        }
      }
      
      // Final pass: if still need more, add any remaining songs
      if (selectedSongs.length < targetCount) {
        for (const song of shuffledRemaining) {
          if (selectedSongs.length >= targetCount) break;
          if (!selectedSongs.find(s => s.id === song.id)) {
            selectedSongs.push(song);
          }
        }
      }
    }
  } else {
    // Original behavior for initial load: full shuffling
    let shuffledSongs: Song[];
    if (seed) {
      const random = seededRandom(seed);
      shuffledSongs = [...songs].sort(() => random() - 0.5);
    } else {
      shuffledSongs = [...songs].sort(() => Math.random() - 0.5);
    }
    
    // First pass: pick songs while respecting artist limits
    for (const song of shuffledSongs) {
      if (selectedSongs.length >= targetCount) break;
      
      const primaryArtist = song.artist.split(',')[0].trim().toLowerCase();
      const currentCount = artistCounts.get(primaryArtist) || 0;
      
      if (currentCount < MAX_SONGS_PER_ARTIST) {
        selectedSongs.push(song);
        artistCounts.set(primaryArtist, currentCount + 1);
      }
    }
    
    // Second pass: if we still need more songs, add remaining ones
    if (selectedSongs.length < targetCount) {
      for (const song of shuffledSongs) {
        if (selectedSongs.length >= targetCount) break;
        
        if (!selectedSongs.find(s => s.id === song.id)) {
          selectedSongs.push(song);
        }
      }
    }
  }
  
  return selectedSongs;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const songId = searchParams.get('id');

    let referenceSong: Song | null = null;

    if (songId) {
      // Fetch a specific song by its ID
      const records = await qdrantClient.retrieve(QDRANT_COLLECTION_NAME, {
        ids: [songId],
        with_vector: true,
      });
      if (records.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const record = records[0] as any;
        referenceSong = {
          id: record.id,
          title: record.payload?.title || 'Unknown Title',
          artist: record.payload?.artist || 'Unknown Artist',
          image: record.payload?.youtube_link ? 
            `/api/thumbnail?videoId=${extractVideoId(record.payload.youtube_link)}` : 
            undefined,
          videoId: extractVideoId(record.payload?.youtube_link),
          vector: record.vector
        };
      }
    } else {
      // Fetch a truly random song from the entire database using Qdrant's random sampling
      const randomResult = await qdrantClient.query(QDRANT_COLLECTION_NAME, {
        query: {
          sample: "random"
        },
        limit: 1,
        with_vector: true,
        with_payload: true,
      });
      
      if (randomResult.points.length === 0) {
        return NextResponse.json({ error: 'No songs in collection' }, { status: 404 });
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const record = randomResult.points[0] as any;
      
      referenceSong = {
        id: record.id,
        title: record.payload?.title || 'Unknown Title',
        artist: record.payload?.artist || 'Unknown Artist',
        image: record.payload?.youtube_link ? 
          `/api/thumbnail?videoId=${extractVideoId(record.payload.youtube_link)}` : 
          undefined,
        videoId: extractVideoId(record.payload?.youtube_link),
        vector: record.vector
      };
    }

    if (!referenceSong || !referenceSong.vector) {
      return NextResponse.json({ error: 'Song not found or has no vector' }, { status: 404 });
    }

    // Now, find songs similar to the reference song's vector
    const similarResults = await qdrantClient.search(QDRANT_COLLECTION_NAME, {
      vector: [...(referenceSong.vector || [])], // Convert readonly to mutable array
      limit: K_NEAREST_NEIGHBORS * FETCH_MULTIPLIER, // Fetch more songs for variety
      with_payload: true,
    });

    // Convert similar songs to proper Song format
    const allSimilarSongs: Song[] = similarResults
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((result: any) => ({
        id: result.id,
        title: result.payload?.title || 'Unknown Title',
        artist: result.payload?.artist || 'Unknown Artist',
        image: result.payload?.youtube_link ? 
          `/api/thumbnail?videoId=${extractVideoId(result.payload.youtube_link)}` : 
          undefined,
        videoId: extractVideoId(result.payload?.youtube_link),
      }))
      .filter(song => song.id !== referenceSong.id); // Exclude the reference song itself

    // Apply diversification to get a varied selection
    // Use preserveOrder=true when we have a specific song ID to maintain similarity ranking
    const similarSongs = diversifySongs(allSimilarSongs, K_NEAREST_NEIGHBORS, referenceSong.id, !!songId);

    return NextResponse.json({
      current: referenceSong,
      similar: similarSongs,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Qdrant API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
