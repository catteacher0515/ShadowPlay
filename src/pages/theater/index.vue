<template>
  <view class="theater-container">
    <!-- Background Layer -->
    <view class="bg-gradient"></view>
    <view class="cloud-decoration cloud-1"></view>
    <view class="cloud-decoration cloud-2"></view>

    <!-- Header -->
    <view class="header" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="header-title">
        <text>云上书院</text>
      </view>
      <view class="header-resource">
        <text>🎟️ x 5</text>
      </view>
    </view>

    <!-- Script Swiper (Cover Flow) -->
    <view class="swiper-container">
      <swiper 
        class="script-swiper" 
        previous-margin="60px" 
        next-margin="60px"
        :current="currentIndex"
        @change="onSwiperChange"
      >
        <swiper-item v-for="(script, index) in scripts" :key="script.id">
          <view 
            class="script-card" 
            :class="{ active: currentIndex === index, locked: script.locked }"
            @click="enterScript(script)"
          >
            <!-- Card Visual -->
            <view class="card-visual" :style="{ backgroundColor: script.color }">
              <view class="visual-content">
                <text v-if="!script.locked" class="visual-text">{{ script.title }}</text>
                <text v-else class="lock-icon">🔒</text>
              </view>
              <view class="card-overlay"></view>
            </view>
            
            <!-- Card Info -->
            <view class="card-info">
              <text class="script-title">{{ script.title }}</text>
              <text class="script-status">{{ script.status }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    
    <CustomTabBar current-path="/pages/theater/index" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import CustomTabBar from '@/components/CustomTabBar.vue';

const safeAreaTop = uni.getSystemInfoSync().statusBarHeight || 20;

const scripts = [
  { id: 1, title: '西游记', status: '进行中 3/6', locked: false, color: '#FFD700' },
  { id: 2, title: '三国演义', status: '需 500 匠心', locked: true, color: '#CD7F32' },
  { id: 3, title: '水浒传', status: '敬请期待', locked: true, color: '#4682B4' },
];

const currentIndex = ref(0);

const onSwiperChange = (e) => {
  currentIndex.value = e.detail.current;
};

const enterScript = (script) => {
  if (script.locked) {
    uni.showToast({ title: '剧本尚未解锁', icon: 'none' });
    return;
  }
  console.log('Entering script:', script.title);
  // Future: Navigate to Level Map
  uni.showToast({ title: `进入《${script.title}》世界`, icon: 'success' });
};
</script>

<style lang="scss" scoped>
.theater-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Background */
.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #1a2a6c, #b21f1f, #fdbb2d);
  z-index: 1;
}

.cloud-decoration {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  filter: blur(20px);
  z-index: 2;
  
  &.cloud-1 {
    top: 10%;
    left: -10%;
    width: 200px;
    height: 100px;
  }
  
  &.cloud-2 {
    bottom: 20%;
    right: -5%;
    width: 250px;
    height: 120px;
    opacity: 0.2;
  }
}

/* Header */
.header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  height: 60px;
  box-sizing: content-box; /* To handle padding-top correctly */
}

.header-title {
  writing-mode: vertical-rl;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 4px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.header-resource {
  background: rgba(0, 0, 0, 0.3);
  padding: 5px 12px;
  border-radius: 20px;
  color: #FFD700;
  font-size: 14px;
  font-weight: bold;
  height: fit-content;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

/* Swiper */
.swiper-container {
  flex: 1;
  display: flex;
  align-items: center;
  z-index: 10;
  margin-bottom: 50px; /* Offset for visual balance */
}

.script-swiper {
  width: 100%;
  height: 450px;
}

.script-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: scale(0.9);
  opacity: 0.7;
  transition: all 0.3s ease;
  
  &.active {
    transform: scale(1);
    opacity: 1;
  }
}

.card-visual {
  width: 240px; /* 3:4 aspect ratio approx base width */
  height: 320px;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255,255,255,0.2);
}

.visual-content {
  z-index: 2;
  text-align: center;
}

.visual-text {
  font-size: 32px;
  font-weight: bold;
  color: rgba(255,255,255,0.9);
  writing-mode: vertical-rl;
  letter-spacing: 8px;
}

.lock-icon {
  font-size: 48px;
  color: rgba(0,0,0,0.4);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(0,0,0,0.4));
  z-index: 1;
}

.card-info {
  margin-top: 20px;
  text-align: center;
  color: #fff;
}

.script-title {
  display: block;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.script-status {
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  background: rgba(0,0,0,0.2);
  padding: 4px 10px;
  border-radius: 10px;
}
</style>