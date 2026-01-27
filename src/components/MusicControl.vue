<template>
  <view 
    class="music-control" 
    :class="{ 'playing': isPlaying }"
    @click="toggleMusic"
    :style="{ 
      top: top + 'px', 
      left: left ? left + 'px' : 'auto', 
      right: left ? 'auto' : right + 'px' 
    }"
  >
    <view class="glass-bg"></view>
    
    <image 
      class="music-icon" 
      src="/static/icons/icon-music-on.png" 
      mode="aspectFit"
    />

    <view v-if="!isPlaying" class="music-slash"></view>

  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 如果你还没有创建 bgm.js，这里先用简易版逻辑，保证不报错
// 如果你已经有了 bgm.js，请替换为 import { bgmManager, bgmState } from '@/utils/bgm';
const props = defineProps({
  src: { type: String, default: '/static/audio/bgm-hall-intro.mp3' },
  top: { type: [Number, String], default: 100 },
  right: { type: [Number, String], default: 20 },
  left: { type: [Number, String], default: null }
});

const isPlaying = ref(false);
let innerAudioContext = null;

onMounted(() => {
  innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.src = props.src;
  innerAudioContext.autoplay = true;
  innerAudioContext.loop = true;

  innerAudioContext.onPlay(() => { isPlaying.value = true; });
  innerAudioContext.onPause(() => { isPlaying.value = false; });
  innerAudioContext.onError((e) => { console.error('BGM Error', e); isPlaying.value = false; });
  
  // 尝试播放
  innerAudioContext.play();
});

onUnmounted(() => {
  if (innerAudioContext) innerAudioContext.destroy();
});

const toggleMusic = () => {
  if (isPlaying.value) innerAudioContext.pause();
  else innerAudioContext.play();
};
</script>

<style lang="scss" scoped>
.music-control {
  position: fixed;
  z-index: 999;
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:active { transform: scale(0.9); }
}

.glass-bg {
  position: absolute; inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.music-icon {
  width: 100%; /* 图标调大一点，更大气 */
  height: 100%;
  z-index: 2;
  opacity: 0.9;
}

/* --- 核心魔法：纯 CSS 画的斜杠 --- */
.music-slash {
  position: absolute;
  z-index: 10;
  width: 4rpx;        /* 线条粗细 */
  height: 70%;        /* 线条长度 */
  background-color: #ffffff; /* 纯白线条 */
  border-radius: 4rpx; /* 圆角 */
  transform: rotate(45deg); /* 旋转45度 */
  box-shadow: 0 0 4px rgba(0,0,0,0.5); /* 加一点阴影，防止背景太白看不清 */
  pointer-events: none; /* 让点击穿透它 */
}

/* 播放时的呼吸动画 */
.playing .music-icon {
  animation: breathe 3s infinite ease-in-out;
}

@keyframes breathe {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}
</style>