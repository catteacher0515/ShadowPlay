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
// ✨ 核心修改：引入全局管理器
import { bgmManager } from '@/utils/bgm.js';

const props = defineProps({
  src: { type: String, default: '/static/audio/bgm-hall-intro.mp3' },
  top: { type: [Number, String], default: 100 },
  right: { type: [Number, String], default: 20 },
  left: { type: [Number, String], default: null }
});

const isPlaying = ref(false);

onMounted(() => {
  // 1. 初始化时，先尝试播放（如果还没有播放）
  // 这里的 play 内部有检查，如果已经在播就不会重头开始
  bgmManager.play(props.src);

  // 2. 同步状态：组件挂载时，看看现在是不是正在播
  isPlaying.value = bgmManager.isMusicOn;
});

// 注意：这里删除了 onUnmounted 的 destroy 逻辑。
// 因为音乐是全局的，离开页面（组件销毁）时，音乐不应该停！

const toggleMusic = () => {
  // 调用全局管理器的切换静音功能
  // 它会返回最新的状态（true=开，false=关）
  isPlaying.value = bgmManager.toggleMute();
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
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 0.9;
}

/* 纯 CSS 斜杠 */
.music-slash {
  position: absolute;
  z-index: 10;
  width: 4rpx;
  height: 70%;
  background-color: #ffffff;
  border-radius: 4rpx;
  transform: rotate(45deg);
  box-shadow: 0 0 4px rgba(0,0,0,0.5);
  pointer-events: none;
}

/* 呼吸动画 */
.playing .music-icon {
  animation: breathe 3s infinite ease-in-out;
}

@keyframes breathe {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}
</style>