import { reactive } from 'vue';

// Use a singleton InnerAudioContext
const bgm = uni.createInnerAudioContext();
bgm.src = '/static/audio/bgm-hall-intro.mp3';
bgm.loop = true;
bgm.autoplay = false; // Control manually via manager

export const bgmState = reactive({
  playing: false
});

// Event Listeners to sync state
bgm.onPlay(() => {
  console.log('Global BGM Started');
  bgmState.playing = true;
});

bgm.onPause(() => {
  console.log('Global BGM Paused');
  bgmState.playing = false;
});

bgm.onStop(() => {
  bgmState.playing = false;
});

bgm.onError((e) => {
  console.error('Global BGM Error', e);
  bgmState.playing = false;
});

// Helper to ensure context exists (sometimes context can be destroyed by system)
// For simple usage, we assume the singleton persists.

export const bgmManager = {
  /**
   * Start playing the BGM
   */
  play: () => {
    if (!bgmState.playing) {
      bgm.play();
    }
  },

  /**
   * Pause the BGM
   */
  pause: () => {
    if (bgmState.playing) {
      bgm.pause();
    }
  },

  /**
   * Toggle play/pause state
   */
  toggle: () => {
    if (bgmState.playing) {
      bgm.pause();
    } else {
      bgm.play();
    }
  },
  
  /**
   * Check current status
   */
  isPlaying: () => bgmState.playing
};
