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
      </view>

      <view 
        class="stage-node stage-1" 
        :class="{ locked: levels[0].isLocked, cleared: levels[0].isCleared }"
        @click="enterLevel(0)"
      >
        <image class="node-icon" src="/static/images/theater/journey/wukong/node-gaolao.png.png" mode="aspectFit" />
        <view class="node-label">高老庄</view>
        <view v-if="levels[0].isLocked" class="lock-overlay">🔒</view>
        
        <view v-if="!levels[0].isCleared" class="player-marker">🐵</view>
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
      if (index + 1 < levels.value.length) {
        levels.value[index + 1].isLocked = false;
      }
    }
  });
});

const goBack = () => uni.navigateBack();

const enterLevel = (index) => {
  const level = levels.value[index];
  if (level.isLocked) {
    uni.showToast({ title: '请先通关前序关卡', icon: 'none' });
    return;
  }
  // 这里可以根据 index 跳转到不同的游戏页面
  // uni.navigateTo(...)
  uni.showToast({ title: `前往：${level.name}`, icon: 'none' });
};
</script>

<style lang="scss" scoped>
.journey-map-container {
  width: 100vw; height: 100vh;
  position: relative; background-color: #000; /* 纯黑底色 */
  overflow: hidden;
}

/* 全屏背景图 */
.bg-fullscreen {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
  opacity: 0.4; /* ✨ 降低透明度，解决看不清图标的问题 */
}

/* 额外的暗色遮罩，增加层次感 */
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

/* --- 路径连线 (CSS 模拟) --- */
/* 调整说明：
   为了适配你新的节点位置，我重新计算了线条的旋转和位置。
   使用了 dotted 虚线作为默认状态（未通关），solid 实线作为通关状态。
*/
.path-line {
  position: absolute; z-index: 5;
  border-top: 3px dotted rgba(255, 255, 255, 0.2); /* 默认：暗淡的白虚线 */
  transform-origin: left center;
  transition: all 0.5s;
  width: 0; /* 默认隐藏，下面单独设置宽度 */
  
  &.active {
    border-top-style: solid;
    border-color: #FFD700; /* 激活：亮金色实线 */
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  }
}

/* 连接 1 -> 2 (从左下 到 右中) */
/* 你的坐标：1(Bottom 15%, Left 10%) -> 2(Top 65%, Right 10%) */
/* Top 65% 大约是 Bottom 35%。垂直差距 20%，水平跨度很大。 */
.path-1-2 {
  bottom: 18%; left: 20%; /* 起点 */
  width: 75%; /* 长度 */
  transform: rotate(-39deg); /* 角度微微向上 */
  /* 如果没连上，这里的 rotate 和 width 需要微调，因为 CSS 画斜线很难精准 */
}

/* 连接 2 -> 3 (从右中 到 左上) */
/* 你的坐标：2(Top 65%, Right 10%) -> 3(Top 25%, Left 15%) */
.path-2-3 {
  top: 60%; right: 20%; /* 起点设在右边 */
  width: 70%;
  transform-origin: right center; /* 以右侧为旋转轴 */
  transform: rotate(48deg); /* 向上翘起指向左上 */
}


/* --- 关卡节点 --- */
.stage-node {
  position: absolute; z-index: 20;
  display: flex; flex-direction: column; align-items: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:active { transform: scale(0.95); }
  
  /* 锁定状态：变灰、半透明 */
  &.locked { 
    filter: grayscale(100%); 
    opacity: 0.6;
    .node-label { background: rgba(0,0,0,0.8); color: #999; border-color: #555; }
  }
  
  /* 通关状态：高亮 */
  &.cleared {
    .node-icon { 
      filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)); /* 强烈发光 */
    }
    .node-label {
      background: rgba(255, 215, 0, 0.2); 
      border-color: #FFD700;
      color: #FFD700;
    }
  }
}

/* 节点图标 */
.node-icon {
  width: 120px; height: 120px; /* 稍微调大一点，更好看 */
  filter: drop-shadow(0 5px 10px rgba(0,0,0,0.8)); /* 基础阴影 */
  transition: all 0.3s;
}

/* 节点文字标签 */
.node-label {
  margin-top: -10px; /* 稍微往上提一点，紧凑些 */
  padding: 4px 16px; border-radius: 20px;
  background: rgba(0,0,0,0.6); 
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff; font-size: 14px; font-weight: bold;
  text-shadow: 0 2px 4px #000;
  z-index: 2;
}

/* 锁图标 */
.lock-overlay {
  position: absolute; top: 0; right: 0;
  font-size: 28px; text-shadow: 0 2px 4px #000;
  background: rgba(0,0,0,0.5); border-radius: 50%;
  width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
}

/* 玩家位置标记 */
.player-marker {
  position: absolute; top: -40px;
  font-size: 40px; z-index: 30;
  animation: bounce 1s infinite alternate;
  filter: drop-shadow(0 5px 5px rgba(0,0,0,0.5));
}
@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }

/* ✨✨✨ 你的自定义坐标 (保留不动) ✨✨✨ */
/* 1. 高老庄：左下 */
.stage-1 { bottom: 15%; left: 10%; }
/* 2. 流沙河：中间偏右 */
.stage-2 { top: 60%; right: 10%; transform: translateY(-50%); }
/* 3. 女儿国：中上偏左 */
.stage-3 { top: 25%; left: 15%; }
</style>