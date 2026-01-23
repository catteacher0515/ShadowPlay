<template>
  <view class="music-container">
    <!-- Custom Back Button -->
    <view class="back-btn" :style="{ top: safeAreaTop + 'px' }" @click="goBack">
      <text class="back-icon">←</text>
    </view>

    <!-- Floating Notes -->
    <view v-if="isPlaying" class="floating-notes">
      <view class="note n1">♪</view>
      <view class="note n2">♫</view>
      <view class="note n3">♩</view>
      <view class="note n4">♬</view>
    </view>

    <!-- Player Section -->
    <view class="player-wrapper">
      <!-- Control Stick (Tone Arm) -->
      <view class="control-stick-arm" :class="{ active: isPlaying }">
        <view class="stick-head"></view>
        <view class="stick-body"></view>
      </view>

      <!-- Zoetrope Disc -->
      <view class="zoetrope-disc" :class="{ rotating: isPlaying }">
        <view class="disc-surface">
          <view class="disc-grooves"></view>
          <!-- Center Character -->
          <view class="center-character">
            <view class="char-visual" :class="{ playing: isPlaying }"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- Controls -->
    <view class="controls-section">
      <view class="lyrics-box">
        <text class="lyrics-text" v-if="isPlaying">"掐嗓一吼，满堂喝彩..."</text>
        <text class="lyrics-text" v-else>点击播放，聆听皮影唱腔</text>
      </view>

      <view class="play-btn" @click="togglePlay">
        <text class="btn-icon">{{ isPlaying ? '⏸' : '▶' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const safeAreaTop = (uni.getSystemInfoSync().statusBarHeight || 20) + 10;
const isPlaying = ref(false);
const audioContext = uni.createInnerAudioContext();

// Mock Audio
audioContext.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'; 
audioContext.loop = true;

const togglePlay = () => {
  if (isPlaying.value) {
    audioContext.pause();
    isPlaying.value = false;
  } else {
    audioContext.play();
    isPlaying.value = true;
  }
};

const goBack = () => {
  uni.navigateBack();
};

// Cleanup
onUnmounted(() => {
  audioContext.stop();
  audioContext.destroy();
});
</script>

<style lang="scss" scoped>
.music-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #1A237E, #000000);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.back-btn {
  position: absolute;
  left: 20px;
  z-index: 100;
  width: 40px;
  height: 40px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  color: white;
  font-size: 20px;
  font-weight: bold;
}

/* Player Wrapper */
.player-wrapper {
  position: relative;
  width: 340px;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
}

/* Control Stick */
.control-stick-arm {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 120px;
  height: 120px;
  z-index: 20;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: 100px 20px; /* Pivot point */
  transform: rotate(-35deg); /* Idle position */
  pointer-events: none;
  
  &.active {
    transform: rotate(-10deg); /* Playing position */
  }
}

.stick-body {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 80px;
  height: 10px;
  background-color: #A1887F;
  border-radius: 5px;
  transform: rotate(45deg);
  box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
}

.stick-head {
  position: absolute;
  bottom: 30px;
  left: 10px;
  width: 20px;
  height: 30px;
  background-color: #5D4037;
  border-radius: 4px;
  transform: rotate(45deg);
}

/* Zoetrope Disc */
.zoetrope-disc {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: #111;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &.rotating {
    animation: rotate 6s linear infinite;
  }
}

.disc-surface {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, #222 0%, #111 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255,255,255,0.1);
}

.disc-grooves {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: repeating-radial-gradient(
    #222,
    #222 2px,
    #181818 3px,
    #181818 4px
  );
  opacity: 0.6;
}

.center-character {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #F7F5F0; /* Paper texture color */
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  overflow: hidden;
}

.char-visual {
  width: 60px;
  height: 60px;
  background-color: #9E9E9E; /* Idle: Grey */
  transition: all 0.5s;
  
  &.playing {
    background-color: #D32F2F; /* Playing: Red */
    animation: bounce 1s infinite alternate;
  }
}

/* Controls */
.controls-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
}

.lyrics-box {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lyrics-text {
  color: rgba(255,255,255,0.8);
  font-size: 16px;
  font-style: italic;
  letter-spacing: 1px;
}

.play-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #FFD700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.95);
  }
}

.btn-icon {
  font-size: 30px;
  color: #333;
}

/* Animations */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

/* Floating Notes */
.floating-notes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.note {
  position: absolute;
  color: rgba(255, 215, 0, 0.6);
  font-size: 24px;
  animation: floatUp 3s infinite ease-in;
  opacity: 0;
  
  &.n1 { left: 20%; animation-delay: 0s; }
  &.n2 { left: 80%; animation-delay: 1s; font-size: 20px; }
  &.n3 { left: 40%; animation-delay: 2s; font-size: 28px; }
  &.n4 { left: 60%; animation-delay: 1.5s; }
}

@keyframes floatUp {
  0% { bottom: 200px; opacity: 0; transform: translateY(0) rotate(0deg); }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { bottom: 600px; opacity: 0; transform: translateY(-100px) rotate(20deg); }
}
</style>