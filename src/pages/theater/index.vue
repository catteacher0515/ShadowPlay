<template>
  <view class="theater-container">
    <image 
      class="bg-main" 
      src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/bg-theater-main.jpg.png" 
      mode="aspectFill" 
    />
    
    <view class="cloud-decoration cloud-1"></view>
    <view class="cloud-decoration cloud-2"></view>

    <view class="header" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="header-title">
        <text>指尖剧场</text>
      </view>
    </view>

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
            <view class="card-visual">
              <image 
                class="cover-img" 
                :src="script.cover" 
                mode="aspectFill" 
              />
              
              <view v-if="script.locked" class="locked-overlay">
                <text class="lock-icon">🔒</text>
              </view>
            </view>
            
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
import { ref, onMounted, onUnmounted } from 'vue';
import CustomTabBar from '@/components/CustomTabBar.vue';
import { bgmManager } from '@/utils/bgm.js';

const safeAreaTop = uni.getSystemInfoSync().statusBarHeight || 20;

const scripts = [
  { 
    id: 1, 
    title: '西游记', 
    status: '经典重现', 
    locked: false, 
    cover: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/card-cover-journey.jpg.png' 
  },
  { 
    id: 2, 
    title: '白蛇传', 
    status: '进行中', 
    locked: false, 
    cover: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/card-cover-whitesnake.jpg.png' 
  },
  { 
    id: 3, 
    title: '敬请期待', 
    status: '未完待续', 
    locked: true, 
    cover: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/card-cover-locked.jpg.png' 
  },
];

const currentIndex = ref(0);

const onSwiperChange = (e) => {
  currentIndex.value = e.detail.current;
};

const enterScript = (script) => {
  // 1. 如果是锁定的，弹窗提示
  if (script.locked) {
    uni.showToast({ title: '该剧本尚未解锁', icon: 'none' });
    return;
  }

  // 2. 如果是《西游记》(ID=1)，跳转到西游专属关卡页
  if (script.id === 1) {
    uni.navigateTo({
      url: '/pages/theater/journey/index',
      animationType: 'pop-in',
      animationDuration: 300
    });
    return;
  }

  // 3. 其他未开发的剧本 (如白蛇传)
  uni.showToast({ title: `《${script.title}》正在筹备中...`, icon: 'none' });
};

// --- BGM Logic ---
let wasPlayingBefore = false;

onMounted(() => {
  // ✅ 正确写法：直接读取属性 (注意去掉括号)
  if (bgmManager.isMusicOn) { 
    wasPlayingBefore = true;
    bgmManager.pause(); 
    console.log('Theater: Pausing Global BGM');
  }
});

onUnmounted(() => {
  if (wasPlayingBefore) {
    bgmManager.play();
    console.log('Theater: Resuming Global BGM');
  }
});
</script>

<style lang="scss" scoped>
.theater-container {
  width: 100vw; height: 100vh;
  position: relative; overflow: hidden;
  display: flex; flex-direction: column;
}

/* Background */
.bg-main {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;
}

.cloud-decoration {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%; filter: blur(20px); z-index: 1; pointer-events: none;
  
  &.cloud-1 { top: 10%; left: -10%; width: 200px; height: 100px; }
  &.cloud-2 { bottom: 20%; right: -5%; width: 250px; height: 120px; opacity: 0.2; }
}

/* Header */
.header {
  position: relative; z-index: 10;
  display: flex; justify-content: center;
  padding: 10px 20px; height: 60px; box-sizing: content-box; 
}

.header-title {
  color: #E0D6C3; /* 象牙金，复古质感 */
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 6px;
  text-shadow: 0 4px 8px rgba(0,0,0,0.8); /* 加重文字阴影，保证在深色背景下清晰 */
  /* ❌ 移除了 background, border, padding, radius */
}

/* Swiper */
.swiper-container {
  flex: 1; display: flex; align-items: center; z-index: 10;
  margin-bottom: 50px; 
}

.script-swiper { width: 100%; height: 500px; }

.script-card {
  width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  
  /* 默认状态：稍小，稍暗 */
  transform: scale(0.85);
  opacity: 0.6;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &.active {
    /* 选中状态：放大，全亮 */
    transform: scale(1.05); /* ✨ 稍微再放大一点，增加层级感 */
    opacity: 1;
    z-index: 20;
    
    /* ✨ 核心魔法：选中时，封面图发光 */
    .cover-img {
      border: 2px solid rgba(255, 215, 0, 0.9); /* 金色边框 */
      box-shadow: 0 0 25px rgba(255, 215, 0, 0.5); /* 金色呼吸光晕 */
    }
  }
}

.card-visual {
  width: 260px; height: 380px;
  position: relative;
  display: flex; align-items: center; justify-content: center;
}

.cover-img {
  width: 100%; height: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  /* 预设一个透明边框，让过渡更平滑 */
  border: 2px solid transparent; 
  transition: all 0.4s ease;
}

.locked-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.6);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  z-index: 5;
}

.lock-icon { font-size: 48px; opacity: 0.8; }

.card-info {
  margin-top: 25px;
  text-align: center; color: #fff;
  transition: all 0.3s;
  opacity: 0.5; /* 非选中状态文字淡化 */
}
.active .card-info { opacity: 1; transform: translateY(-5px); }

.script-title {
  display: block; font-size: 22px; font-weight: bold; margin-bottom: 8px;
  color: #FFD700; text-shadow: 0 2px 8px rgba(0,0,0,0.8);
}

.script-status {
  font-size: 14px; color: #E0E0E0;
  background: rgba(0,0,0,0.5);
  padding: 4px 12px; border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
}
</style>