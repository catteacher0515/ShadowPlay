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

const safeAreaTop = ref(40);
const isPlaying = ref(false);
const currentIndex = ref(0);

// 🎵 Playlist Configuration
const tracks = [
  {
    id: 'monkey',
    name: '掐嗓 · 借扇',
    desc: '孙悟空大战铁扇公主 (武戏)',
    cover: '/static/images/wiki/vocal/char-shadow-monkey.png.png', 
    // 即使链接失效，代码也会忽略错误继续演示动画
    audio: 'https://music.163.com/song/media/outer/url?id=1359436324.mp3' 
  },
  {
    id: 'snake',
    name: '断桥 · 情深',
    desc: '白娘子与许仙 (文戏)',
    cover: '/static/images/wiki/vocal/char-shadow-snake.png.png', 
    audio: 'https://music.163.com/song/media/outer/url?id=5264844.mp3' 
  },
  {
    id: 'zhuge',
    name: '空城 · 抚琴',
    desc: '诸葛亮智退司马懿 (生角)',
    cover: '/static/images/wiki/vocal/char-shadow-zhuge.png.png', 
    audio: 'https://music.163.com/song/media/outer/url?id=1860266596.mp3' 
  }
];

const currentTrack = computed(() => tracks[currentIndex.value]);

let innerAudioContext = null;

// Audio Management
const initAudio = () => {
  if (innerAudioContext) return;
  innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.autoplay = false;
  
  // ✅ 监听播放结束：只有音频真的播完才归位
  innerAudioContext.onEnded(() => {
    console.log('Audio Ended');
    isPlaying.value = false;
  });
  
  // 🛡️ 核心修复：监听错误，但不中断演出 (忽略 500/解码错误)
  innerAudioContext.onError((res) => {
    console.error('⚠️ Audio Error (Ignored for Demo):', res.errMsg);
    // 注意：此处不再重置 isPlaying，保证动画继续运行
  });
};

// Switching Logic
const changeTrack = (newIndex) => {
  // 1. 切歌时，先抬起唱针 (符合物理逻辑)
  isPlaying.value = false;
  if (innerAudioContext) {
    innerAudioContext.stop();
  }
  
  // 2. Update Index
  currentIndex.value = newIndex;
  
  // 3. 等待用户再次点击播放
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
    // 暂停
    innerAudioContext.pause();
    isPlaying.value = false;
  } else {
    // 播放
    // 尝试播放音频，但无论音频是否成功，强制 UI 进入播放状态
    if (currentTrack.value.audio) {
      if (innerAudioContext.src !== currentTrack.value.audio) {
         innerAudioContext.src = currentTrack.value.audio;
      }
      // 延迟播放避免竞争条件
      setTimeout(() => {
        innerAudioContext.play(); 
      }, 50);
    }
    
    // ✅ 强制开启 UI 动画（解决唱针缩回问题）
    isPlaying.value = true;
  }
};

const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  const menuButton = uni.getMenuButtonBoundingClientRect();
  if (menuButton) {
    safeAreaTop.value = menuButton.top;
  }
  initAudio();
});

onUnmounted(() => {
  if (innerAudioContext) {
    innerAudioContext.destroy();
    innerAudioContext = null;
  }
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
  transition: opacity 0.3s ease; /* Fade effect for switching covers */
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
  /* Glassmorphism for buttons */
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