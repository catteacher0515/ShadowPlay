<template>
  <view class="container">
    <!-- Layer 1: Background & Curtains -->
    <view class="layer-bg">
      <view class="curtain left"></view>
      <view class="curtain right"></view>
    </view>

    <!-- Layer 2: Stage -->
    <view class="layer-stage">
      <view class="stage-area">
        <view class="character-block breathing">
          <text>孙悟空 (Idle)</text>
        </view>
        <view class="character-block breathing delay">
          <text>白骨精 (Idle)</text>
        </view>
      </view>
    </view>

    <!-- Layer 3: HUD -->
    <view class="layer-hud">
      <view class="header-left">
        <view class="avatar"></view>
        <view class="bgm-toggle" @click="toggleBgm">
          <text>{{ isBgmPlaying ? '🔔' : '🔕' }}</text>
        </view>
      </view>
      <view class="header-center">
        <text class="logo-text">云上·皮影</text>
      </view>
    </view>

    <!-- Layer 4: Foreground Props -->
    <view class="layer-foreground">
      <view class="daily-sign-btn" @click="goToDaily">
        <text>拾影·日签</text>
      </view>
    </view>

    <!-- Layer 5: Custom TabBar -->
    <view class="custom-tabbar">
      <view 
        v-for="(item, index) in tabItems" 
        :key="index"
        class="tab-item"
        :class="{ active: activeTab === item.key }"
        @click="switchTab(item)"
      >
        <view class="tab-icon"></view>
        <text class="tab-text">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// State
const isBgmPlaying = ref(true)
const currentTab = ref(-1) // Set to -1 so no tab is active

const tabItems = [
  { key: 'workshop', label: '工坊', path: '/pages/workshop/index' },
  { key: 'theater', label: '剧场', path: '/pages/index/index' }, // Assuming Index IS Theater based on context
  { key: 'wiki', label: '影卷', path: '/pages/wiki/menu' },
  { key: 'market', label: '集市', path: '/pages/market/index' }
]

// Lifecycle
onMounted(() => {
  // Hide native TabBar to show our custom one
  uni.hideTabBar()
})

// Methods
const toggleBgm = () => {
  isBgmPlaying.value = !isBgmPlaying.value
  console.log('BGM Toggled:', isBgmPlaying.value)
}

const goToDaily = () => {
  console.log('Navigate to /pages/wiki/daily')
  // uni.navigateTo({ url: '/pages/wiki/daily' })
}

const switchTab = (item) => {
  if (activeTab.value === item.key) return
  
  console.log(`Switch Tab to: ${item.label} (${item.path})`)
  
  if (item.key === 'theater') {
    // We are already here, or if this was a real app, we might just stay
    activeTab.value = item.key
  } else {
    // In a real app with custom tabbar, we might use uni.switchTab or uni.redirectTo
    // Since we are simulating the layout:
    // uni.switchTab({ url: item.path })
  }
}
</script>

<style lang="scss" scoped>
/* Variables */
$gold-color: #FFD700;
$bg-dark: #2C1608;
$text-light: #F7F5F0;

.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: $bg-dark;
}

/* Layer 1: Background & Curtains */
.layer-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba($gold-color, 0.3) 0%, $bg-dark 80%);
  z-index: 1;
}

.curtain {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 15%;
  background: linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4));
  z-index: 1;
  
  &.left {
    left: 0;
    border-right: 1px solid rgba($gold-color, 0.1);
  }
  
  &.right {
    right: 0;
    background: linear-gradient(to left, rgba(0,0,0,0.8), rgba(0,0,0,0.4));
    border-left: 1px solid rgba($gold-color, 0.1);
  }
}

/* Layer 2: Stage */
.layer-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  padding-bottom: 100px; /* Make space for foreground/tabbar */
}

.stage-area {
  display: flex;
  gap: 40px;
}

.character-block {
  width: 100px;
  height: 150px;
  border: 2px dashed rgba($gold-color, 0.5);
  background-color: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-light;
  font-size: 14px;
  text-align: center;
  
  &.breathing {
    animation: breathe 3s infinite ease-in-out;
  }
  
  &.delay {
    animation-delay: 1.5s;
  }
}

/* Layer 3: HUD */
.layer-hud {
  position: absolute;
  top: var(--status-bar-height);
  left: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  z-index: 3;
  display: flex;
  justify-content: space-between;
}

.header-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid $gold-color;
  background-color: #555;
}

.bgm-toggle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba($gold-color, 0.5);
}

.header-center {
  position: absolute;
  left: 50%;
  top: 40px;
  transform: translateX(-50%);
}

.logo-text {
  writing-mode: vertical-rl;
  font-size: 24px;
  color: $gold-color;
  font-weight: bold;
  letter-spacing: 5px;
  text-shadow: 0 0 10px rgba($gold-color, 0.5);
}

/* Layer 4: Foreground Props */
.layer-foreground {
  position: absolute;
  bottom: 120px; /* Above TabBar */
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
}

.daily-sign-btn {
  background-color: #A52A2A;
  color: $text-light;
  padding: 10px 20px;
  border-radius: 4px;
  border: 1px solid $gold-color;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  font-size: 16px;
  font-weight: bold;
}

/* Layer 5: Custom TabBar */
.custom-tabbar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
  background: linear-gradient(to top, #000000 0%, rgba(0,0,0,0.8) 100%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 5;
  border-top: 1px solid rgba($gold-color, 0.2);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.6;
  transition: all 0.3s;
  
  &.active {
    opacity: 1;
    transform: scale(1.1);
    
    .tab-text {
      color: $gold-color;
    }
    
    .tab-icon {
      border-color: $gold-color;
      background-color: rgba($gold-color, 0.2);
    }
  }
}

.tab-icon {
  width: 24px;
  height: 24px;
  border: 1px solid #999;
  margin-bottom: 4px;
  border-radius: 4px;
}

.tab-text {
  font-size: 12px;
  color: #999;
}

/* Animations */
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}
</style>