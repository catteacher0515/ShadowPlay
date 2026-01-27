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
       <view class="nav-left" :style="{ height: navHeight + 'px', width: navHeight + 'px' }" @click="goToProfile">
          <view class="avatar-box">
             <image class="avatar-frame" src="/static/images/index/avatar-frame-cloud.png" />
             <view class="avatar-placeholder" v-if="!userInfo.avatarUrl"></view>
             <image class="user-avatar" :src="userInfo.avatarUrl" v-else />
          </view>
       </view>
       <view class="nav-center" :style="{ lineHeight: navHeight + 'px' }">
         <text class="app-name">云上·皮影</text>
       </view>
    </view>

    <MusicControl 
      src="/static/audio/bgm-hall-intro.mp3" 
      :top="navTop + navHeight + 20" 
      :left="20"
    />

    <CustomTabBar current-path="/pages/index/index" />

  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CustomTabBar from '@/components/CustomTabBar.vue';
import MusicControl from '@/components/MusicControl.vue';

const navTop = ref(0);
const navHeight = ref(32); 
const userInfo = ref({ avatarUrl: '' });

onMounted(() => {
  const menuButton = uni.getMenuButtonBoundingClientRect();
  if (menuButton) {
    navTop.value = menuButton.top;
    navHeight.value = menuButton.height;
  } else {
    navTop.value = (uni.getSystemInfoSync().statusBarHeight || 20) + 4;
  }
});

const goToProfile = () => { uni.navigateTo({ url: '/pages/profile/index' }); };
const goToDaily = () => { uni.navigateTo({ url: '/pages/daily/index' }); };
</script>

<style lang="scss" scoped>
.main-hall-container {
  width: 100vw; height: 100vh; position: relative; overflow: hidden;
  background-color: #2C1608;
}

/* 1. 静态背景 (Z-Index: 0) */
.bg-stage { 
  position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; 
}

/* ✨ 2. 动态背景层 (核心修改) ✨ */
.stage-background-layer {
  position: absolute;
  inset: 0; /* 撑满上下左右 */
  width: 100%; 
  height: 100%;
  z-index: 1; /* 比静态背景高，比幕布低 */
  pointer-events: none; /* 防止遮挡交互 */
}

.full-screen-gif {
  width: 100%; 
  height: 100%;
  /* 稍微降低一点透明度，让它更有“皮影幕布”的投影感，不至于太刺眼 */
  opacity: 0.8; 
  
  /* 如果你的 GIF 自带白色/浅色背景，开启正片叠底可以去白底 */
  /* mix-blend-mode: multiply; */
}

/* 3. 前景幕布 (Z-Index: 2) */
.fg-curtain { 
  position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; 
  pointer-events: none; mix-blend-mode: multiply; 
}

/* 按钮、导航栏等样式保持不变 */
.btn-daily-entry {
  position: absolute; top: 65%; left: 24%; width: 400rpx; height: 200rpx;
  z-index: 50; animation: float-btn 3s ease-in-out infinite;
}
@keyframes float-btn {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
}

.custom-navbar { position: absolute; left: 0; width: 100%; z-index: 10; display: flex; justify-content: center; pointer-events: none; }
.nav-left { position: absolute; left: 15px; top: 0; display: flex; align-items: center; justify-content: center; pointer-events: auto; }
.avatar-box { width: 100%; height: 100%; position: relative; transform: scale(0.9); }
.avatar-frame { width: 100%; height: 100%; position: absolute; z-index: 2; }
.avatar-placeholder { width: 76%; height: 76%; background: rgba(0,0,0,0.3); border-radius: 50%; position: absolute; top: 12%; left: 12%; }
.user-avatar { width: 76%; height: 76%; border-radius: 50%; position: absolute; top: 12%; left: 12%; z-index: 1; }
.nav-center { height: 100%; display: flex; align-items: center; }
.app-name { font-size: 17px; font-weight: 600; color: #FFFFFF; letter-spacing: 1px; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
</style>