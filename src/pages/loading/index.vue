<template>
  <view class="loading-scene">
    
    <image 
      class="bg-dark" 
      src="/static/images/loading/bg-loading-dark-texture.jpg.jpg" 
      mode="aspectFill" 
    />

    <view class="journey-stage">
      <image 
        class="team-gif"
        src="/static/images/loading/char-journey-team-walk.gif" 
        mode="aspectFit"
      />
    </view>

    <view class="ui-bottom">
      <text class="loading-tips">{{ currentTipText }}</text>
      
      <view class="css-progress-box">
        <view class="css-progress-bar" :style="{ width: progress + '%' }"></view>
        <view class="css-progress-head" :style="{ left: progress + '%' }"></view>
      </view>

      <text class="loading-percent">{{ Math.floor(progress) }}%</text>
    </view>

    <view class="flash-overlay" :class="{ 'active': isTransitioning }"></view>

  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const progress = ref(0);
const isTransitioning = ref(false);

const currentTipText = computed(() => {
  if (progress.value < 30) return "整备行囊，即刻出发...";
  if (progress.value < 60) return "路途遥远，且听风吟...";
  if (progress.value < 90) return "前方到站：云上皮影...";
  return "好戏开场，请君入座...";
});

onMounted(() => {
  // GIF 是即时加载的，不需要像视频那样预热，直接开始动画
  setTimeout(() => { startLoadingSequence(); }, 100);
});

const startLoadingSequence = () => {
  const duration = 3000; 
  const intervalTime = 50; 
  const totalSteps = duration / intervalTime;
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    let nextProgress = (currentStep / totalSteps) * 100;
    if (Math.random() > 0.7) nextProgress -= 1; 
    
    if (nextProgress > 100) nextProgress = 100;
    progress.value = nextProgress;

    if (currentStep >= totalSteps) {
      clearInterval(timer);
      finishLoading();
    }
  }, intervalTime);
};

const finishLoading = () => {
  progress.value = 100;
  isTransitioning.value = true;
  setTimeout(() => {
    uni.reLaunch({ url: '/pages/index/index' });
  }, 800);
};
</script>

<style lang="scss" scoped>
.loading-scene {
  width: 100vw; height: 100vh; position: relative; overflow: hidden;
  background-color: #000;
}

.bg-dark {
  position: absolute; width: 105%; height: 105%; 
  left: 50%; top: 50%; transform: translate(-50%, -50%);
  opacity: 0.8; z-index: 0;
}

/* --- 西游行进组：正居中布局 --- */
.journey-stage {
  position: absolute;
  top: 45%; /* 稍微偏上一点，视觉重心更稳 */
  left: 0;
  width: 100vw;
  height: 400rpx;
  transform: translateY(-50%);
  
  display: flex; justify-content: center; align-items: center;
  z-index: 10;
  pointer-events: none;

  /* 上下金线：保留画卷感 */
  border-top: 2rpx solid rgba(255, 215, 0, 0.3);
  border-bottom: 2rpx solid rgba(255, 215, 0, 0.3);
  
  /* 给容器加一个极淡的暖色底，让 GIF 融合得更好 */
  background: rgba(60, 30, 10, 0.3);
}

.team-gif {
  width: 100%; 
  height: 90%;
  opacity: 0.95;
  
  /* ✨ 核心魔法：混合模式 ✨ */
  /* 如果你的 GIF 有黑色背景 -> 使用 screen 或 lighten
     如果你的 GIF 有浅色/黄色背景 -> 使用 multiply (正片叠底) 或 darken
     如果不确定，先删掉这行，看看原图效果，通常 GIF 自带透明通道最好
  */
  /* mix-blend-mode: screen; */ 
}

/* --- 底部 UI --- */
.ui-bottom {
  position: absolute; bottom: 15%; width: 100%;
  display: flex; flex-direction: column; align-items: center;
  z-index: 20;
}

.loading-tips {
  color: #FFD700; font-size: 36rpx; margin-bottom: 30rpx;
  letter-spacing: 6rpx; font-weight: bold;
  text-shadow: 0 2rpx 10rpx rgba(255, 215, 0, 0.5);
}

.loading-percent {
  color: rgba(255,255,255,0.4); font-size: 24rpx; margin-top: 20rpx;
  font-family: monospace;
}

/* 进度条 */
.css-progress-box {
  position: relative;
  width: 70%; 
  height: 16rpx; 
  background: rgba(0, 0, 0, 0.6); 
  border: 2rpx solid #8B5A2B; 
  border-radius: 10rpx; 
  box-shadow: 0 0 10rpx rgba(0,0,0,0.5) inset; 
  overflow: visible; 
}

.css-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #b8860b, #ffd700, #b8860b); 
  border-radius: 8rpx;
  box-shadow: 0 0 10rpx rgba(255, 215, 0, 0.4); 
  transition: width 0.1s linear;
}

.css-progress-head {
  position: absolute; top: 50%; transform: translate(-50%, -50%);
  width: 24rpx; height: 24rpx; background: #FFF; border-radius: 50%;
  box-shadow: 0 0 15rpx #FFD700; opacity: 0.9; pointer-events: none;
}

.flash-overlay {
  position: fixed; inset: 0; background: #FFF;
  opacity: 0; pointer-events: none; transition: opacity 0.8s ease-in;
  z-index: 999;
}
.flash-overlay.active { opacity: 1; }
</style>