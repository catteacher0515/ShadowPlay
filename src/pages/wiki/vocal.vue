<template>
  <view class="vocal-container">
    <image class="bg-img" src="/static/images/wiki/vocal/bg-vocal-stage.jpg.jpg" mode="aspectFill" />

    <view class="player-wrapper">
      
      <view class="turntable" :class="{ 'is-spinning': isPlaying }">
        <image class="disc-base" src="/static/images/wiki/vocal/ui-disc-skin.png.png" mode="aspectFit" />
        <image :key="currentTrack.id" class="disc-cover" :src="currentTrack.cover" mode="aspectFit" />
      </view>

      <view class="control-stick-wrapper" :class="{ 'stick-active': isPlaying }">
          <image class="stick-img" src="/static/images/wiki/vocal/ui-control-stick.png.png" mode="heightFix" />
      </view>

    </view>

    <view class="control-panel">
      
      <view class="track-switcher">
        <view class="switch-btn" @click="prevTrack">
          <text class="arrow-icon">❮</text>
        </view>

        <view class="track-info">
          <text class="track-name">{{ currentTrack.name }}</text>
          <text class="track-desc">{{ currentTrack.desc }}</text>
          <text class="track-idx">{{ currentIndex + 1 }} / {{ tracks.length }}</text>
        </view>

        <view class="switch-btn" @click="nextTrack">
          <text class="arrow-icon">❯</text>
        </view>
      </view>
      
      <view class="play-btn-box" @click="togglePlay">
        <image class="btn-img" src="/static/images/wiki/vocal/btn-play-call.png.png" mode="aspectFit" />
        <view class="btn-shadow" v-if="isPlaying"></view>
      </view>
    </view>

    <view class="back-btn" :style="{ top: safeAreaTop + 'px' }" @click="goBack">
      <text class="back-icon">←</text>
    </view>

  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
// ✨✨✨ 引入全局 BGM 管理器 ✨✨✨
import { bgmManager } from '@/utils/bgm.js';

const safeAreaTop = ref(40);
const isPlaying = ref(false);
const currentIndex = ref(0);

// 🎵 播放列表配置
const tracks = [
  {
    id: 'monkey',
    name: '掐嗓 · 借扇',
    desc: '孙悟空大战铁扇公主 (武戏)',
    cover: '/static/images/wiki/vocal/char-shadow-monkey.png.png', 
    audio: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/audio/vocal-monkey.mp3' 
  },
  {
    id: 'snake',
    name: '断桥 · 情深',
    desc: '白娘子与许仙 (文戏)',
    cover: '/static/images/wiki/vocal/char-shadow-snake.png.png', 
    audio: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/audio/vocal-snake.mp3' 
  },
  {
    id: 'zhuge',
    name: '空城 · 抚琴',
    desc: '诸葛亮智退司马懿 (生角)',
    cover: '/static/images/wiki/vocal/char-shadow-zhuge.png.png', 
    audio: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/audio/vocal-zhuge.mp3' 
  }
];

const currentTrack = computed(() => tracks[currentIndex.value]);

// 唱腔页面的专属音频实例
let innerAudioContext = null;

// Audio Management
const initAudio = () => {
  if (innerAudioContext) return;
  innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.autoplay = false;
  
  innerAudioContext.onEnded(() => {
    console.log('Audio Ended');
    isPlaying.value = false;
  });
  
  innerAudioContext.onError((res) => {
    console.error('⚠️ Audio Error:', res.errMsg);
    uni.showToast({ title: '音频加载失败', icon: 'none' });
    isPlaying.value = false; 
  });
};

// Switching Logic
const changeTrack = (newIndex) => {
  isPlaying.value = false;
  if (innerAudioContext) {
    innerAudioContext.stop();
  }
  currentIndex.value = newIndex;
};

const nextTrack = () => {
  let next = currentIndex.value + 1;
  if (next >= tracks.length) next = 0;
  changeTrack(next);
};

const prevTrack = () => {
  let prev = currentIndex.value - 1;
  if (prev < 0) prev = tracks.length - 1;
  changeTrack(prev);
};

const togglePlay = () => {
  if (!innerAudioContext) initAudio();

  if (isPlaying.value) {
    // 暂停唱腔
    innerAudioContext.pause();
    isPlaying.value = false;
  } else {
    // 播放唱腔
    if (currentTrack.value.audio) {
      if (innerAudioContext.src !== currentTrack.value.audio) {
         innerAudioContext.src = currentTrack.value.audio;
      }
      setTimeout(() => {
        innerAudioContext.play(); 
      }, 50);
      isPlaying.value = true;
    } else {
      uni.showToast({ title: '暂无音频源', icon: 'none' });
    }
  }
};

const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  // 1. 适配刘海屏
  const menuButton = uni.getMenuButtonBoundingClientRect();
  if (menuButton) {
    safeAreaTop.value = menuButton.top;
  }
  
  // 2. 初始化当前页面的音频播放器
  initAudio();

  // ✨✨✨ 3. 关键：进入唱腔页面时，暂停全局 BGM ✨✨✨
  console.log('Vocal Page Mounted: Pausing Global BGM');
  bgmManager.pause();
});

onUnmounted(() => {
  // 1. 销毁当前页面的音频实例
  if (innerAudioContext) {
    innerAudioContext.destroy();
    innerAudioContext = null;
  }

  // ✨✨✨ 2. 关键：离开唱腔页面时，恢复全局 BGM ✨✨✨
  // bgmManager.play() 会自动检查 isMusicOn 状态，如果用户没关静音，就会恢复播放
  console.log('Vocal Page Unmounted: Resuming Global BGM');
  bgmManager.play();
});
</script>

<style lang="scss" scoped>
.vocal-container {
  width: 100vw; height: 100vh; position: relative;
  background: #1a1a1a; overflow: hidden;
}
.bg-img {
  width: 100%; height: 100%; position: absolute; z-index: 0; opacity: 0.6;
}

/* Player Mechanism */
.player-wrapper {
  position: relative; width: 100%; height: 55vh;
  margin-top: 15vh;
  display: flex; justify-content: center; align-items: center;
}

/* Turntable */
.turntable {
  width: 320px; height: 320px;
  position: relative;
  display: flex; justify-content: center; align-items: center;
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.is-spinning {
  animation: spin 10s linear infinite;
}

.disc-base {
  width: 100%; height: 100%; position: absolute;
}
.disc-cover {
  width: 80%; height: 80%; position: absolute;
  mix-blend-mode: multiply; 
  opacity: 0.95;
  transition: opacity 0.3s ease; 
}

/* Control Stick */
.control-stick-wrapper {
  position: absolute; 
  top: -60px; right: 10px; 
  width: 120px; height: 320px;
  transform-origin: 60% 30px; 
  transform: rotate(-35deg); 
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 20;
  pointer-events: none;
}
.stick-active {
  transform: rotate(0deg); 
}
.stick-img {
  width: 100%; height: 100%;
}

/* Controls Layer */
.control-panel {
  position: absolute; bottom: 80px; width: 100%;
  display: flex; flex-direction: column; align-items: center;
  z-index: 20;
}

/* Track Switcher */
.track-switcher {
  display: flex; align-items: center; justify-content: center;
  width: 100%; margin-bottom: 30px;
}
.switch-btn {
  width: 50px; height: 50px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.05); border-radius: 50%;
  backdrop-filter: blur(4px);
  margin: 0 15px;
}
.switch-btn:active { background: rgba(255,255,255,0.15); transform: scale(0.95); }
.arrow-icon { color: #E0D6C3; font-size: 18px; opacity: 0.8; }

.track-info {
  text-align: center; width: 200px;
  display: flex; flex-direction: column; align-items: center;
}
.track-name {
  font-size: 22px; color: #E0D6C3; font-weight: bold; margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5); white-space: nowrap;
}
.track-desc {
  font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 6px;
}
.track-idx {
  font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 2px;
}

/* Play Button (Stamp) */
.play-btn-box {
  width: 200px; height: 100px; /* 2:1 Aspect Ratio */
  position: relative;
  transition: transform 0.1s;
}
.play-btn-box:active { transform: scale(0.95); }
.btn-img { width: 100%; height: 100%; }
.btn-shadow {
  position: absolute; top: 8%; left: 8%; width: 84%; height: 84%;
  background: rgba(0,0,0,0.3); border-radius: 12px; filter: blur(4px);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.back-btn {
  position: fixed; left: 20px; z-index: 100;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.1); backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255,255,255,0.2); color: #fff;
}
</style>