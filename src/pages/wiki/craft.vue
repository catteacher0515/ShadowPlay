<template>
  <view class="craft-container">
    <!-- Custom Back Button -->
    <view class="back-btn" :style="{ top: safeAreaTop + 'px' }" @click="goBack">
      <text class="back-icon">←</text>
    </view>

    <swiper 
      class="craft-swiper" 
      vertical 
      circular
      :current="currentStep"
      @change="onChange"
    >
      <swiper-item v-for="(step, index) in steps" :key="index">
        <view class="slide-item" :style="{ backgroundColor: step.color }">
          <!-- Gradient Overlay -->
          <view class="slide-overlay"></view>
          
          <!-- Content Info -->
          <view class="info-section">
            <text class="step-index">第 {{ toChineseNum(index + 1) }} 道工序</text>
            <text class="step-name">{{ step.name }}</text>
            <text class="step-desc">{{ step.desc }}</text>
          </view>
          
          <!-- Audio Trigger -->
          <view v-if="step.hasAudio" class="audio-trigger" @click="playAudio">
            <view class="pulse-ring"></view>
            <text class="audio-icon">🔊</text>
            <text class="audio-text">听·刀锋入皮</text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- Side Indicator -->
    <view class="side-indicator">
      <view 
        v-for="(step, index) in steps" 
        :key="index"
        class="indicator-dot"
        :class="{ active: currentStep === index }"
      ></view>
    </view>
  </view>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

const safeAreaTop = (uni.getSystemInfoSync().statusBarHeight || 20) + 10;
const currentStep = ref(0);
const audioContext = uni.createInnerAudioContext();
// Mock audio src (using a short sound effect URL or placeholder)
audioContext.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; 

const steps = [
  { name: '选皮', desc: '取驴皮之韧，去毛刮脂', color: '#D7CCC8' }, // 模拟腊感
  { name: '制皮', desc: '浸泡推刮，薄如蝉翼', color: '#BCAAA4' },
  { name: '描样', desc: '钢针游走，入木三分', color: '#A1887F' },
  { name: '雕刻', desc: '推皮走刀，千刻不乱', color: '#8D6E63', hasAudio: true },
  { name: '敷彩', desc: '红绿点染，通透如玉', color: '#EF5350' }, // 模拟红宝石色
  { name: '熨烫', desc: '高温定型，平整如镜', color: '#795548' },
  { name: '罩漆', desc: '清漆封固，历久弥新', color: '#5D4037' },
  { name: '缀结', desc: '丝弦连结，灵活自如', color: '#4E342E' }
];

const onChange = (e) => {
  currentStep.value = e.detail.current;
  // Stop audio if user swipes away from engraving step (index 3)
  if (currentStep.value !== 3) {
    audioContext.stop();
  }
};

const playAudio = () => {
  audioContext.play();
  uni.showToast({ title: '刀声响起...', icon: 'none' });
};

const goBack = () => {
  uni.navigateBack();
};

const toChineseNum = (num) => {
  const cnNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  return cnNums[num] || num;
};

// Cleanup
onUnmounted(() => {
  audioContext.destroy();
});
</script>

<style lang="scss" scoped>
.craft-container {
  width: 100vw;
  height: 100vh;
  background-color: black;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 20px;
  z-index: 100;
  width: 40px;
  height: 40px;
  background-color: rgba(0,0,0,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.back-icon {
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.craft-swiper {
  width: 100%;
  height: 100%;
}

.slide-item {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, transparent 100%);
  pointer-events: none;
}

.info-section {
  position: relative;
  z-index: 10;
  padding: 0 40px 100px 40px;
  color: white;
}

.step-index {
  display: block;
  font-size: 14px;
  color: #FFD700;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.step-name {
  display: block;
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 15px;
  font-family: serif;
  letter-spacing: 5px;
}

.step-desc {
  font-size: 16px;
  opacity: 0.8;
  font-family: serif;
  letter-spacing: 1px;
  line-height: 1.6;
}

/* Audio Trigger */
.audio-trigger {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.audio-icon {
  font-size: 40px;
  background-color: rgba(255,255,255,0.2);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.4);
  animation: pulse 2s infinite;
}

.audio-text {
  color: rgba(255,255,255,0.8);
  font-size: 12px;
  letter-spacing: 2px;
}

@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(255, 255, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

/* Side Indicator */
.side-indicator {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 20;
}

.indicator-dot {
  width: 2px;
  height: 15px;
  background-color: rgba(255,255,255,0.3);
  transition: all 0.3s;
  
  &.active {
    height: 30px;
    background-color: #FFD700;
    width: 3px;
  }
}
</style>