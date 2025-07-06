import { proxy } from 'valtio';
import type { Song } from '@/lib/types';

export type MusicBoxState = {
  selectedTrack: string | null;
  tracks: Song[];
  loading: boolean;
  transitioning: boolean; // Add transitioning state
  referenceHistory: Song[]; // Stack of reference songs
  pendingTracks: Song[] | null; // Staging area for new tracks during transitions
  cameraTransitioning: boolean; // Separate state for camera movement
};

export const musicBoxState = proxy<MusicBoxState>({
  selectedTrack: null,
  tracks: [],
  loading: true,
  transitioning: false,
  referenceHistory: [],
  pendingTracks: null,
  cameraTransitioning: false,
});

// Function to set a new reference song and fetch similar songs
export async function setAsReference(songId: string) {
  musicBoxState.transitioning = true;
  musicBoxState.cameraTransitioning = true;
  musicBoxState.selectedTrack = null; // Deselect current track
  
  // Start fetching new tracks while camera transitions
  musicBoxState.loading = true;
  
  try {
    const res = await fetch(`/api/songs?id=${songId}`);
    const data = await res.json();
    
    // Add current reference to history if it exists
    if (musicBoxState.tracks.length > 0) {
      const currentReference = musicBoxState.tracks[0];
      musicBoxState.referenceHistory.push(currentReference);
    }
    
    // Store new tracks in pending area (don't apply yet)
    const newTracks = [data.current, ...(data.similar || [])];
    musicBoxState.pendingTracks = newTracks;
    musicBoxState.loading = false;
    
    // Wait longer for camera transition to complete
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Now apply the new tracks (this will trigger image loading)
    musicBoxState.tracks = musicBoxState.pendingTracks || [];
    musicBoxState.pendingTracks = null;
    musicBoxState.cameraTransitioning = false;
    
    // Wait a bit more for images to start loading before removing transition state
    await new Promise(resolve => setTimeout(resolve, 300));
    musicBoxState.transitioning = false;
    
  } catch (e) {
    console.error('Failed to fetch similar songs:', e);
    musicBoxState.tracks = [];
    musicBoxState.pendingTracks = null;
    musicBoxState.loading = false;
    musicBoxState.cameraTransitioning = false;
    musicBoxState.transitioning = false;
  }
}

// Function to go back to the previous reference song
export async function goBackToPreviousReference() {
  if (musicBoxState.referenceHistory.length === 0) {
    return; // No history to go back to
  }
  
  musicBoxState.transitioning = true;
  musicBoxState.cameraTransitioning = true;
  musicBoxState.selectedTrack = null; // Deselect current track
  
  // Start fetching new tracks while camera transitions
  musicBoxState.loading = true;
  
  try {
    // Get the previous reference from history
    const previousReference = musicBoxState.referenceHistory.pop()!;
    
    // Fetch similar songs for the previous reference
    const res = await fetch(`/api/songs?id=${previousReference.id}`);
    const data = await res.json();
    
    // Store new tracks in pending area (don't apply yet)
    const newTracks = [data.current, ...(data.similar || [])];
    musicBoxState.pendingTracks = newTracks;
    musicBoxState.loading = false;
    
    // Wait longer for camera transition to complete
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Now apply the new tracks (this will trigger image loading)
    musicBoxState.tracks = musicBoxState.pendingTracks || [];
    musicBoxState.pendingTracks = null;
    musicBoxState.cameraTransitioning = false;
    
    // Wait a bit more for images to start loading before removing transition state
    await new Promise(resolve => setTimeout(resolve, 300));
    musicBoxState.transitioning = false;
    
  } catch (e) {
    console.error('Failed to fetch previous reference songs:', e);
    musicBoxState.tracks = [];
    musicBoxState.pendingTracks = null;
    musicBoxState.loading = false;
    musicBoxState.cameraTransitioning = false;
    musicBoxState.transitioning = false;
  }
}

// Function to check if there's history to go back to
export function hasReferenceHistory(): boolean {
  return musicBoxState.referenceHistory.length > 0;
}
