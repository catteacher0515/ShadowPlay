<template>
  <view class="loading-container">
    <!-- Layer 1: Background -->
    <view class="layer-bg"></view>

    <!-- Layer 2: Light Source (Halo) -->
    <view 
      class="layer-light" 
      :style="{ 
        opacity: progress / 100, 
        transform: `scale(${0.5 + (progress / 200)}) translate(-50%, -50%)` 
      }"
    ></view>

    <!-- Layer 3: Props -->
    <view class="layer-props">
      <view class="lamp-container">
        <view class="lamp-body"></view>
        <view class="lamp-flame"></view>
      </view>
      <text class="character-label">孙悟空 (扇风中)</text>
    </view>

    <!-- Layer 4: HUD -->
    <view class="layer-hud">
      <text class="loading-text">{{ loadingText }}</text>
      <view class="progress-bar-container">
        <view 
          class="progress-bar-fill" 
          :style="{ width: progress + '%' }"
        ></view>
      </view>
    </view>

    <!-- Layer 5: Flash -->
    <view 
      class="layer-flash" 
      :class="{ 'active': isFlashing }"
    ></view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// State
const progress = ref(0)
const isFlashing = ref(false)

// Computed Text based on progress
const loadingText = computed(() => {
  if (progress.value < 30) return "正在剔皮点睛..."
  if (progress.value < 70) return "后台备马净场..."
  return "好戏即刻开箱..."
})

// Logic
onMounted(() => {
  const duration = 1800 // Total duration in ms (1.8s)
  const intervalTime = 20 // Update every 20ms
  const steps = duration / intervalTime
  const increment = 100 / steps

  const timer = setInterval(() => {
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(timer)
      completeLoading()
    } else {
      progress.value = Math.min(progress.value + increment, 100)
    }
  }, intervalTime)
})

const completeLoading = () => {
  // Trigger Flash
  isFlashing.value = true
  // console.log("加载完成！本来该跳转了，但我先暂停在这里给你看 UI。")
  
  // Wait for flash animation and navigate
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/index/index'
    })
  }, 500)
}
</script>

<style lang="scss" scoped>
/* Variables mapped from global (just in case, though global vars work in uni-app) */
$bg-color: #2C1608;
$gold-color: #FFD700;
$text-color: #F7F5F0;

.loading-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: $bg-color;
}

/* Layer 1: Background */
.layer-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, $bg-color 70%);
  z-index: 1;
}

/* Layer 2: Light Source */
.layer-light {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  transform-origin: center center;
  z-index: 2;
  pointer-events: none;
}

/* Layer 3: Props */
.layer-props {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lamp-container {
  position: relative;
  width: 40px;
  height: 60px;
  margin-bottom: 20px;
}

.lamp-body {
  width: 100%;
  height: 40px;
  background-color: #4A3B32;
  position: absolute;
  bottom: 0;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.lamp-flame {
  width: 12px;
  height: 20px;
  background: linear-gradient(to top, #FF4500, #FFD700);
  border-radius: 50% 50% 20% 20%;
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  animation: flicker 0.2s infinite alternate;
  box-shadow: 0 0 15px #FFD700;
}

.character-label {
  font-size: 14px;
  color: rgba($text-color, 0.8);
  margin-top: 10px;
  font-weight: bold;
}

/* Layer 4: HUD */
.layer-hud {
  position: absolute;
  bottom: 15%;
  left: 0;
  width: 100%;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 40px;
  box-sizing: border-box;
}

.loading-text {
  font-size: 16px;
  color: $gold-color;
  margin-bottom: 15px;
  letter-spacing: 2px;
  min-height: 24px; /* Prevent jitter */
}

.progress-bar-container {
  width: 100%;
  height: 6px;
  border: 1px solid rgba($gold-color, 0.5);
  border-radius: 4px;
  overflow: hidden;
  padding: 1px;
}

.progress-bar-fill {
  height: 100%;
  background-color: $gold-color;
  width: 0%;
  border-radius: 2px;
  transition: width 0.1s linear;
  box-shadow: 0 0 5px $gold-color;
}

/* Layer 5: Flash */
.layer-flash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  opacity: 0;
  z-index: 5;
  pointer-events: none;
  transition: opacity 0.2s ease-in;
}

.layer-flash.active {
  opacity: 1;
}

/* Animations */
@keyframes flicker {
  0% {
    transform: translateX(-50%) scale(1);
    opacity: 0.9;
  }
  100% {
    transform: translateX(-50%) scale(1.1);
    opacity: 1;
  }
}
</style>