import { proxy } from 'valtio';
import { Track, TRACKS } from './tracks';

type State = {
  clicked: number | null;
  tracks: Track[];
};

export const state = proxy<State>({
  clicked: null,
  tracks: TRACKS,
});
