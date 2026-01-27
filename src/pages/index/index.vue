<template>
  <view class="main-hall-container">
    
    <image class="bg-stage" src="/static/images/index/bg-stage-screen.jpg" mode="aspectFill" />
    
    <view class="stage-background-layer">
       <image 
         class="full-screen-gif" 
         src="/static/images/index/char-wukong-vs-baigujing.gif" 
         mode="aspectFill" 
       />
    </view>
    
    <image class="fg-curtain" src="/static/images/index/curtain-frame.jpg.jpg" mode="aspectFill" />

    <image 
      class="btn-daily-entry" 
      src="/static/images/daily/btn-play-call.png.png" 
      mode="widthFix" 
      @click="goToDaily" 
    />

    <view class="custom-navbar" :style="{ top: navTop + 'px', height: navHeight + 'px' }">
       <view class="nav-center" :style="{ lineHeight: navHeight + 'px' }">
         <text class="app-name">云上·皮影</text>
       </view>
    </view>

    <MusicControl 
      src="/static/audio/bgm-hall-intro.mp3" 
      :top="sidebarStartTop" 
      :left="20"
    />

    <CustomTabBar current-path="/pages/index/index" />

  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import CustomTabBar from '@/components/CustomTabBar.vue';
import MusicControl from '@/components/MusicControl.vue';

const navTop = ref(0);
const navHeight = ref(32); 

// 计算左侧功能区的起始高度：导航栏底部 + 30px
const sidebarStartTop = computed(() => {
  return navTop.value + navHeight.value + 30;
});

onMounted(() => {
  const menuButton = uni.getMenuButtonBoundingClientRect();
  if (menuButton) {
    navTop.value = menuButton.top;
    navHeight.value = menuButton.height;
  } else {
    navTop.value = (uni.getSystemInfoSync().statusBarHeight || 20) + 4;
  }
});

const goToDaily = () => { uni.navigateTo({ url: '/pages/daily/index' }); };
</script>

<style lang="scss" scoped>
.main-hall-container {
  width: 100vw; height: 100vh; position: relative; overflow: hidden;
  background-color: #2C1608;
}

/* 背景层 */
.bg-stage { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.stage-background-layer {
  position: absolute; inset: 0; width: 100%; height: 100%;
  z-index: 1; pointer-events: none;
}
.full-screen-gif { 
  width: 100%; height: 100%; 
  opacity: 0.8; 
  /* mix-blend-mode: multiply; */ 
}
.fg-curtain { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; mix-blend-mode: multiply; }

/* 每日一签按钮 */
.btn-daily-entry {
  position: absolute; top: 65%; left: 24%; width: 400rpx; height: 200rpx;
  z-index: 50; animation: float-btn 3s ease-in-out infinite;
}
@keyframes float-btn {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
}

/* 导航栏 (标题) */
.custom-navbar {
  position: absolute; left: 0; width: 100%; z-index: 10;
  display: flex; justify-content: center; pointer-events: none;
}
.nav-center { height: 100%; display: flex; align-items: center; }
.app-name { font-size: 17px; font-weight: 600; color: #FFFFFF; letter-spacing: 1px; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
</style>