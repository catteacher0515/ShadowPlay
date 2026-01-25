<template> 
   <view class="main-hall-container"> 
     
     <image class="bg-stage" src="/static/images/index/bg-stage-screen.jpg" mode="aspectFill" /> 
     <view class="stage-performance"> 
        <image class="actor-wukong animate-breath" src="/static/images/char/char-wukong-pose-idle.png" /> 
        <image class="actor-skeleton animate-breath-delayed" src="/static/images/char/char-skeleton-pose-idle.png" /> 
     </view> 
     <image class="fg-curtain" src="/static/images/index/curtain-frame.jpg.jpg" mode="aspectFill" /> 
 
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
 
     <view class="floating-controls" :style="{ top: (navTop + navHeight + 30) + 'px' }"> 
        <view class="bgm-control" @click="toggleBGM"> 
           <image 
              class="bgm-icon" 
              src="/static/images/index/icon-btn-bgm-gong.png.png" 
              :class="{ 'animate-spin': isBgmOn }" 
           /> 
        </view> 
     </view> 
 
     <CustomTabBar current-path="/pages/index/index" /> 
 
   </view> 
 </template> 
 
 <script setup> 
 import { ref, onMounted } from 'vue'; 
 import CustomTabBar from '@/components/CustomTabBar.vue'; 
 
 // --- Layout Calculation --- 
 const navTop = ref(0); 
 const navHeight = ref(32); // Default fallback 
 
 onMounted(() => { 
   // Get WeChat Capsule Position 
   const menuButton = uni.getMenuButtonBoundingClientRect(); 
   if (menuButton) { 
     navTop.value = menuButton.top; 
     navHeight.value = menuButton.height; 
   } else { 
     // Fallback for H5/Other 
     navTop.value = (uni.getSystemInfoSync().statusBarHeight || 20) + 4; 
   } 
 }); 
 
 // --- Logic --- 
 const isBgmOn = ref(true); 
 const userInfo = ref({ avatarUrl: '' }); // Replace with real store data later 
 
 const toggleBGM = () => { 
   isBgmOn.value = !isBgmOn.value; 
 }; 
 
 const goToProfile = () => { 
   uni.navigateTo({ url: '/pages/profile/index' }); 
 }; 
 </script> 
 
 <style lang="scss" scoped> 
 .main-hall-container { 
   width: 100vw; height: 100vh; position: relative; overflow: hidden; 
   background-color: #2C1608; 
 } 
 
 /* Backgrounds */ 
 .bg-stage { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; } 
 .stage-performance { position: absolute; inset: 0; z-index: 1; display: flex; justify-content: center; align-items: center; } 
 .fg-curtain { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; mix-blend-mode: multiply; } 
 
 /* Custom Navbar (Z-Index 10) */ 
 .custom-navbar { 
   position: absolute; left: 0; width: 100%; z-index: 10; 
   display: flex; justify-content: center; /* Center Title */ 
   pointer-events: none; /* Let touches pass through empty areas */ 
 } 
 
 /* Avatar Box */ 
 .nav-left { 
   position: absolute; left: 15px; top: 0; 
   display: flex; align-items: center; justify-content: center; 
   pointer-events: auto; 
 } 
 .avatar-box { 
   width: 100%; height: 100%; /* Fill the nav height square */ 
   position: relative; 
   transform: scale(0.9); /* Slight shrink to fit nicely */ 
 } 
 .avatar-frame { width: 100%; height: 100%; position: absolute; z-index: 2; } 
 .avatar-placeholder { width: 76%; height: 76%; background: rgba(0,0,0,0.3); border-radius: 50%; position: absolute; top: 12%; left: 12%; } 
 .user-avatar { width: 76%; height: 76%; border-radius: 50%; position: absolute; top: 12%; left: 12%; z-index: 1; } 
 
 /* Title */ 
 .nav-center { 
   height: 100%; 
   display: flex; align-items: center; 
 } 
 .app-name { 
   font-size: 17px; /* Standard WeChat Title Size */ 
   font-weight: 600; 
   color: #FFFFFF; 
   letter-spacing: 1px; 
   text-shadow: 0 1px 2px rgba(0,0,0,0.3); 
 } 
 
 /* Floating Controls (Gong) */ 
 .floating-controls { 
   position: absolute; left: 15px; /* Aligned with avatar left */ 
   z-index: 10; 
   pointer-events: auto; 
 } 
 .bgm-control { 
   /* No more overlap constraints */ 
 } 
 .bgm-icon { width: 40px; height: 40px; opacity: 0.9; } 
 
 @keyframes spin { 100% { transform: rotate(360deg); } } 
 </style>