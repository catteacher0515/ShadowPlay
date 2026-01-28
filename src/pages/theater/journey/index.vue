<template>
  <view class="journey-map-container">
    <image 
      class="bg-fullscreen" 
      src="/static/images/theater/journey/wukong/bg-journey-wukong-full.jpg.png" 
      mode="aspectFill" 
    />
    
    <view class="bg-mask"></view>
    
    <view class="nav-header" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="back-btn" @click="goBack">
        <text class="arrow">←</text> <text>返回剧场</text>
      </view>
      <text class="page-title">西游 · 征途</text>
    </view>

    <view class="map-content">
      
      <view class="path-line path-1-2" :class="{ active: levels[0].isCleared }"></view>
      <view class="path-line path-2-3" :class="{ active: levels[1].isCleared }"></view>

      <view 
        class="stage-node stage-3" 
        :class="{ locked: levels[2].isLocked, cleared: levels[2].isCleared }" 
        @click="enterLevel(2)"
      >
        <image class="node-icon" src="/static/images/theater/journey/wukong/node-kingdom.png.png" mode="aspectFit" />
        <view class="node-label">女儿国</view>
        <view v-if="levels[2].isLocked" class="lock-overlay">🔒</view>
      </view>

      <view 
        class="stage-node stage-2" 
        :class="{ locked: levels[1].isLocked, cleared: levels[1].isCleared }"
        @click="enterLevel(1)"
      >
        <image class="node-icon" src="/static/images/theater/journey/wukong/node-liusha.png.png" mode="aspectFit" />
        <view class="node-label">流沙河</view>
        <view v-if="levels[1].isLocked" class="lock-overlay">🔒</view>
        
        <view v-if="!levels[1].isLocked && !levels[1].isCleared" class="player-marker">
          <view class="arrow-down-gold"></view>
        </view>
      </view>

      <view 
        class="stage-node stage-1" 
        :class="{ locked: levels[0].isLocked, cleared: levels[0].isCleared }"
        @click="enterLevel(0)"
      >
        <image class="node-icon" src="/static/images/theater/journey/wukong/node-gaolao.png.png" mode="aspectFit" />
        <view class="node-label">高老庄</view>
        <view v-if="levels[0].isLocked" class="lock-overlay">🔒</view>
        
        <view v-if="!levels[0].isCleared" class="player-marker">
          <view class="arrow-down-gold"></view>
        </view>
      </view>
      
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';

const safeAreaTop = uni.getSystemInfoSync().statusBarHeight || 20;

const levels = ref([
  { id: 'bajie', name: '高老庄', isLocked: false, isCleared: false },
  { id: 'shaseng', name: '流沙河', isLocked: true, isCleared: false },
  { id: 'tangseng', name: '女儿国', isLocked: true, isCleared: false },
]);

onShow(() => {
  const clearedIds = uni.getStorageSync('WUKONG_CLEARED_IDS') || [];
  levels.value.forEach((level, index) => {
    if (clearedIds.includes(level.id)) {
      level.isCleared = true;
      level.isLocked = false;
      // 解锁下一关
      if (index + 1 < levels.value.length) {
        levels.value[index + 1].isLocked = false;
      }
    }
  });
});

const goBack = () => uni.navigateBack();

const enterLevel = (index) => {
  const level = levels.value[index];
  
  // 1. 拦截锁定关卡
  if (level.isLocked) {
    uni.showToast({ title: '请先通关前序关卡', icon: 'none' });
    return;
  }
  
  // 2. 显示加载提示
  uni.showToast({ title: `前往：${level.name}`, icon: 'loading', duration: 500 });
  
  // 3. 延迟后执行跳转
  setTimeout(() => {
    if (index === 0) {
      // 第一关：高老庄
      uni.navigateTo({
        url: '/pages/theater/journey/wukong/level1',
        fail: (err) => console.error('跳转Level 1失败:', err)
      });
    } 
    else if (index === 1) {
      // 第二关：流沙河
      uni.navigateTo({
        url: '/pages/theater/journey/wukong/level2',
        fail: (err) => {
          console.error('跳转Level 2失败:', err);
          uni.showToast({ title: '页面未找到', icon: 'none' });
        }
      });
    }
    else if (index === 2) {
      // ✨✨✨ 第三关：女儿国 (已打通) ✨✨✨
      uni.navigateTo({
        url: '/pages/theater/journey/wukong/level3',
        fail: (err) => {
          console.error('跳转Level 3失败:', err);
          uni.showToast({ title: '页面未找到', icon: 'none' });
        }
      });
    }
  }, 500); 
};
</script>

<style lang="scss" scoped>
.journey-map-container {
  width: 100vw; height: 100vh;
  position: relative; background-color: #000;
  overflow: hidden;
}

/* 全屏背景图 */
.bg-fullscreen {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
  opacity: 0.4;
}

/* 遮罩 */
.bg-mask {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1;
  background: radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
  pointer-events: none;
}

/* 导航栏 */
.nav-header {
  position: relative; z-index: 100;
  display: flex; align-items: center; justify-content: center;
  height: 44px; color: #FFD700;
}
.back-btn { position: absolute; left: 20px; display: flex; align-items: center; font-size: 14px; opacity: 0.9; }
.arrow { font-size: 20px; margin-right: 4px; }
.page-title { font-size: 18px; font-weight: bold; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }

/* 地图内容层 */
.map-content {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 10;
  box-sizing: border-box;
}

/* --- 路径连线 (保持你的数值) --- */
.path-line {
  position: absolute; z-index: 5;
  border-top: 3px dotted rgba(255, 255, 255, 0.2);
  transform-origin: left center;
  transition: all 0.5s;
  width: 0;
  
  &.active {
    border-top-style: solid;
    border-color: #FFD700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  }
}

.path-1-2 {
  bottom: 18%; left: 20%;
  width: 75%;
  transform: rotate(-39deg);
}

.path-2-3 {
  top: 60%; right: 20%;
  width: 70%;
  transform-origin: right center;
  transform: rotate(48deg);
}

/* --- 关卡节点 --- */
.stage-node {
  position: absolute; z-index: 20;
  display: flex; flex-direction: column; align-items: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:active { transform: scale(0.95); }
  
  &.locked { 
    filter: grayscale(100%); 
    opacity: 0.6;
    .node-label { background: rgba(0,0,0,0.8); color: #999; border-color: #555; }
  }
  
  &.cleared {
    .node-icon { 
      filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
    }
    .node-label {
      background: rgba(255, 215, 0, 0.2); 
      border-color: #FFD700;
      color: #FFD700;
    }
  }
}

.node-icon {
  width: 120px; height: 120px;
  filter: drop-shadow(0 5px 10px rgba(0,0,0,0.8));
  transition: all 0.3s;
}

.node-label {
  margin-top: -10px;
  padding: 4px 16px; border-radius: 20px;
  background: rgba(0,0,0,0.6); 
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff; font-size: 14px; font-weight: bold;
  text-shadow: 0 2px 4px #000;
  z-index: 2;
}

.lock-overlay {
  position: absolute; top: 0; right: 0;
  font-size: 28px; text-shadow: 0 2px 4px #000;
  background: rgba(0,0,0,0.5); border-radius: 50%;
  width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
}

/* ✨✨✨ 新版：金色下箭头 (Pure CSS) ✨✨✨ */
.player-marker {
  position: absolute; 
  top: -60px; /* 悬浮在图标上方，留出距离 */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%);
  z-index: 30;
  animation: bounce 1.2s infinite ease-in-out alternate;
}

.arrow-down-gold {
  width: 0; 
  height: 0; 
  /* 使用 Border 绘制倒三角形 */
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 25px solid #FFD700; /* 亮金色 */
  
  /* 添加发光滤镜 */
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
}

@keyframes bounce { 
  from { transform: translate(-50%, 0); } 
  to { transform: translate(-50%, -15px); } 
}

/* --- 你的自定义坐标 (保留不动) --- */
.stage-1 { bottom: 15%; left: 10%; }
.stage-2 { top: 60%; right: 10%; transform: translateY(-50%); }
.stage-3 { top: 25%; left: 15%; }
</style>