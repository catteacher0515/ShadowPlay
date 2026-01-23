<template>
  <view class="workshop-container">
    <!-- Top Area: Stage (65%) -->
    <view class="stage-area">
      <!-- Vignette Overlay -->
      <view class="vignette-overlay"></view>
      
      <!-- Status Sidebar -->
      <view class="status-sidebar">
        <view 
          class="status-item" 
          :class="{ active: equipped.head }"
        >
          <text class="status-icon">头</text>
        </view>
        <view 
          class="status-item" 
          :class="{ active: equipped.body }"
        >
          <text class="status-icon">靠</text>
        </view>
        <view 
          class="status-item" 
          :class="{ active: equipped.hand }"
        >
          <text class="status-icon">把</text>
        </view>
        <view 
          class="status-item" 
          :class="{ active: equipped.leg }"
        >
          <text class="status-icon">腿</text>
        </view>
      </view>

      <!-- Ghost / Assembly Area -->
      <view class="ghost-container" :class="{ complete: isComplete }">
        <view class="ghost-outline" v-if="!isComplete"></view>
        
        <!-- Equipped Parts -->
        <view class="equipped-layer">
          <view v-if="equipped.head" class="part head" :style="{ backgroundColor: equipped.head.color }"></view>
          <view v-if="equipped.body" class="part body" :style="{ backgroundColor: equipped.body.color }"></view>
          <view v-if="equipped.hand" class="part hand left" :style="{ backgroundColor: equipped.hand.color }"></view>
          <view v-if="equipped.hand" class="part hand right" :style="{ backgroundColor: equipped.hand.color }"></view>
          <view v-if="equipped.leg" class="part leg left" :style="{ backgroundColor: equipped.leg.color }"></view>
          <view v-if="equipped.leg" class="part leg right" :style="{ backgroundColor: equipped.leg.color }"></view>
        </view>
      </view>

      <!-- Controls -->
      <view class="stage-controls">
        <view class="btn-light" @click="toggleLight">
          <text>💡</text>
        </view>
      </view>
      
      <view class="test-play-container" v-if="isComplete">
        <button class="btn-test-play" @click="startTestPlay">
          <text>▶ 试戏</text>
        </button>
      </view>
    </view>

    <!-- Bottom Area: Inventory (35%) -->
    <view class="inventory-area">
      <!-- Tabs -->
      <scroll-view scroll-x class="tabs-scroll">
        <view class="tabs-container">
          <view 
            v-for="tab in tabs" 
            :key="tab.key"
            class="tab-item"
            :class="{ active: currentTab === tab.key }"
            @click="selectTab(tab.key)"
          >
            <text>{{ tab.label }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- Grid Content -->
      <scroll-view scroll-y class="grid-scroll">
        <view class="parts-grid">
          <view 
            v-for="part in currentParts" 
            :key="part.id"
            class="part-item"
            @click="equipPart(part)"
          >
            <view class="part-preview" :style="{ backgroundColor: part.color }"></view>
            <text class="part-name">{{ part.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// --- State ---
const currentTab = ref('head') // head, body, hand, leg
const equipped = reactive({
  head: null,
  body: null,
  hand: null,
  leg: null
})

// --- Data ---
const tabs = [
  { key: 'head', label: '头茬' },
  { key: 'body', label: '靠子' },
  { key: 'hand', label: '把子' },
  { key: 'leg', label: '腿子' }
]

const mockParts = {
  head: [
    { id: 'h1', name: '美猴王', color: '#FFD700' },
    { id: 'h2', name: '白骨精', color: '#C0C0C0' },
    { id: 'h3', name: '唐僧', color: '#FFC0CB' },
    { id: 'h4', name: '猪八戒', color: '#FFB6C1' },
  ],
  body: [
    { id: 'b1', name: '锁子甲', color: '#DAA520' },
    { id: 'b2', name: '素白袍', color: '#F0F8FF' },
    { id: 'b3', name: '锦斓袈裟', color: '#FF4500' },
    { id: 'b4', name: '黑风甲', color: '#2F4F4F' },
  ],
  hand: [
    { id: 'ha1', name: '金箍棒', color: '#FFD700' },
    { id: 'ha2', name: '双剑', color: '#C0C0C0' },
    { id: 'ha3', name: '九齿钉耙', color: '#A9A9A9' },
    { id: 'ha4', name: '降妖杖', color: '#8B4513' },
  ],
  leg: [
    { id: 'l1', name: '登云靴', color: '#000000' },
    { id: 'l2', name: '绣花鞋', color: '#DC143C' },
    { id: 'l3', name: '僧鞋', color: '#8B4513' },
    { id: 'l4', name: '战靴', color: '#556B2F' },
  ]
}

// --- Computed ---
const currentParts = computed(() => {
  return mockParts[currentTab.value] || []
})

const isComplete = computed(() => {
  return equipped.head && equipped.body && equipped.hand && equipped.leg
})

// --- Actions ---
const selectTab = (key) => {
  currentTab.value = key
}

const equipPart = (part) => {
  // 1. Equip the part
  equipped[currentTab.value] = part
  
  // 2. Auto-advance logic
  const order = ['head', 'body', 'hand', 'leg']
  const currentIndex = order.indexOf(currentTab.value)
  
  if (currentIndex < order.length - 1) {
    // Move to next tab if not last
    const nextTab = order[currentIndex + 1]
    // Optional: only auto-advance if next slot is empty? 
    // User requested: "Auto switch to next tab"
    setTimeout(() => {
      currentTab.value = nextTab
    }, 300)
  }
}

const toggleLight = () => {
  console.log('Toggle Light Check')
  uni.showToast({ title: '透光检查开启', icon: 'none' })
}

const startTestPlay = () => {
  console.log('Start Test Play')
  uni.showToast({ title: '开始试戏', icon: 'success' })
}
</script>

<style lang="scss" scoped>
/* Variables */
$stage-bg: #F7F5F0;
$inventory-bg: #3E2723;
$gold: #FFD700;
$active-border: #FFD700;

.workshop-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* --- Top Stage Area (65%) --- */
.stage-area {
  height: 65%;
  background-color: $stage-bg;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vignette-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 50%, rgba(0,0,0,0.3) 100%);
  pointer-events: none;
  z-index: 1;
}

/* Status Sidebar */
.status-sidebar {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 2;
}

.status-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255,255,255,0.5);
  transition: all 0.3s;
  
  &.active {
    border: 2px solid $gold;
    background-color: $gold;
    color: #3E2723;
    font-weight: bold;
    box-shadow: 0 0 10px rgba($gold, 0.5);
  }
}

.status-icon {
  font-size: 14px;
}

/* Ghost / Assembly Area */
.ghost-container {
  position: relative;
  width: 200px;
  height: 300px;
  z-index: 2;
  transition: all 0.5s;
  
  &.complete {
    transform: scale(1.05);
  }
}

.ghost-outline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px dashed $gold;
  border-radius: 10px;
  animation: breathing-glow 2s infinite alternate;
  background-color: rgba($gold, 0.05);
}

.equipped-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.part {
  position: absolute;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  
  &.head {
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    z-index: 10;
  }
  
  &.body {
    top: 75px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 100px;
    border-radius: 10px;
    z-index: 5;
  }
  
  &.hand {
    top: 80px;
    width: 30px;
    height: 80px;
    border-radius: 5px;
    z-index: 4;
    
    &.left { left: 30px; transform: rotate(15deg); }
    &.right { right: 30px; transform: rotate(-15deg); }
  }
  
  &.leg {
    bottom: 20px;
    width: 35px;
    height: 90px;
    border-radius: 5px;
    z-index: 3;
    
    &.left { left: 50px; }
    &.right { right: 50px; }
  }
}

/* Controls */
.stage-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

.btn-light {
  width: 44px;
  height: 44px;
  background-color: rgba(0,0,0,0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fff;
  font-size: 20px;
}

.test-play-container {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.btn-test-play {
  background-color: $gold;
  color: #3E2723;
  font-weight: bold;
  border-radius: 50px;
  padding: 0 30px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.6);
  border: none;
  animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* --- Bottom Inventory Area (35%) --- */
.inventory-area {
  height: 35%;
  background-color: $inventory-bg;
  border-top: 4px solid #5D4037;
  display: flex;
  flex-direction: column;
  z-index: 10;
  box-shadow: 0 -5px 20px rgba(0,0,0,0.5);
}

.tabs-scroll {
  height: 50px;
  background-color: rgba(0,0,0,0.2);
}

.tabs-container {
  display: flex;
  height: 100%;
  padding: 0 10px;
}

.tab-item {
  flex: 0 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
  position: relative;
  
  &.active {
    color: $gold;
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.05);
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: $gold;
    }
  }
}

.grid-scroll {
  flex: 1;
  padding: 15px;
  box-sizing: border-box;
}

.parts-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding-bottom: 20px;
}

.part-item {
  aspect-ratio: 1;
  background-color: rgba(255,255,255,0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid transparent;
  
  &:active {
    background-color: rgba(255,255,255,0.2);
  }
}

.part-preview {
  width: 30px;
  height: 30px;
  border-radius: 4px;
}

.part-name {
  font-size: 10px;
  color: #ccc;
  text-align: center;
}

/* Animations */
@keyframes breathing-glow {
  0% { box-shadow: 0 0 10px rgba($gold, 0.2); border-color: rgba($gold, 0.6); }
  100% { box-shadow: 0 0 25px rgba($gold, 0.6); border-color: $gold; }
}

@keyframes pop-in {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>