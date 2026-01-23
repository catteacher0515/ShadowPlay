<template>
  <view class="wiki-menu-container">
    <!-- Bamboo Shadow FX -->
    <view class="bamboo-layer">
      <view class="bamboo-shadow b1"></view>
      <view class="bamboo-shadow b2"></view>
    </view>

    <!-- Header -->
    <view class="header" :style="{ paddingTop: safeAreaTop + 'px' }">
      <text class="page-title">影卷</text>
    </view>

    <!-- Menu List -->
    <view class="menu-list">
      <view 
        v-for="item in navItems" 
        :key="item.id"
        class="menu-card"
        :class="['align-' + item.align]"
        :style="{ backgroundColor: item.bg }"
        @click="navigateTo(item.path)"
      >
        <view class="card-content">
          <text class="card-title">{{ item.title }}</text>
          <text class="card-desc">{{ item.desc }}</text>
        </view>
        <view class="card-visual"></view>
      </view>
    </view>

    <!-- Custom TabBar -->
    <CustomTabBar current-path="/pages/wiki/menu" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import CustomTabBar from '@/components/CustomTabBar.vue';

const safeAreaTop = uni.getSystemInfoSync().statusBarHeight || 20;

const navItems = [
  { id: 'history', title: '溯源·历史', desc: '千年光影，一脉相承', path: '/pages/wiki/history', align: 'left', bg: '#3E2723' },
  { id: 'craft', title: '匠心·工艺', desc: '刀锋游走，皮上乾坤', path: '/pages/wiki/craft', align: 'right', bg: '#263238' },
  { id: 'music', title: '唱腔·特色', desc: '掐嗓一吼，满堂喝彩', path: '/pages/wiki/music', align: 'left', bg: '#1A237E' }
];

const navigateTo = (path) => {
  uni.navigateTo({
    url: path,
    fail: (err) => {
      console.error('Nav failed:', err);
      uni.showToast({ title: '内容编写中...', icon: 'none' });
    }
  });
};
</script>

<style lang="scss" scoped>
.wiki-menu-container {
  min-height: 100vh;
  background-color: #F7F5F0;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px; /* Space for TabBar */
}

/* Bamboo Shadow FX */
.bamboo-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.1;
}

.bamboo-shadow {
  position: absolute;
  background-color: #000;
  border-radius: 50% 0 50% 0;
  animation: sway 5s infinite alternate ease-in-out;
  
  &.b1 {
    top: -10%;
    left: 80%;
    width: 200px;
    height: 600px;
    transform: rotate(15deg);
    transform-origin: top center;
  }
  
  &.b2 {
    top: 20%;
    left: -10%;
    width: 150px;
    height: 500px;
    transform: rotate(-10deg);
    transform-origin: top center;
    animation-delay: 1s;
  }
}

@keyframes sway {
  0% { transform: rotate(10deg); }
  100% { transform: rotate(15deg); }
}

/* Header */
.header {
  position: relative;
  z-index: 10;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #3E2723;
  font-family: serif; /* Fallback for calligraphy */
  letter-spacing: 5px;
}

/* Menu List */
.menu-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  z-index: 10;
}

.menu-card {
  width: 100%;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  display: flex;
  transition: transform 0.3s;
  
  &:active {
    transform: scale(0.98);
  }
  
  &.align-left {
    flex-direction: row;
  }
  
  &.align-right {
    flex-direction: row-reverse;
  }
}

.card-content {
  flex: 1;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255,255,255,0.9);
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  writing-mode: vertical-rl;
  letter-spacing: 4px;
  height: 100%;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.card-desc {
  font-size: 14px;
  opacity: 0.8;
  writing-mode: vertical-rl;
  letter-spacing: 2px;
  border-left: 1px solid rgba(255,255,255,0.3);
  padding-left: 10px;
  height: 80%;
}

.card-visual {
  width: 40%;
  background: linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.5));
  /* In real app, this would be an image */
}
</style>