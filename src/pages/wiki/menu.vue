<template> 
   <view class="wiki-container"> 
     
     <image class="bg-fixed" src="/static/images/wiki/bg-wiki-dark.jpg.jpg" mode="aspectFill" /> 
 
     <scroll-view scroll-y class="scroll-content" :style="{ paddingTop: (safeAreaTop + 40) + 'px' }"> 
       
       <view class="page-header"> 
         <text class="header-title">影 · 卷</text> 
         <text class="header-subtitle">探寻皮影的前世今生</text> 
       </view> 
 
       <view class="card-list"> 
         <view class="wiki-card" @click="goDetail('history')"> 
             <image class="card-bg" src="/static/images/wiki/card-history.png.png" mode="aspectFill" /> 
             <image class="card-text text-left" src="/static/images/wiki/text-history.png.png" mode="heightFix" /> 
             <view class="card-overlay"></view> 
         </view> 
 
         <view class="wiki-card" @click="goDetail('craft')"> 
             <image class="card-bg" src="/static/images/wiki/card-craft.png.png" mode="aspectFill" /> 
             <image class="card-text text-right" src="/static/images/wiki/text-craft.png.png" mode="heightFix" /> 
             <view class="card-overlay"></view> 
         </view> 
 
         <view class="wiki-card" @click="goDetail('vocal')"> 
             <image class="card-bg" src="/static/images/wiki/card-vocal.png.png" mode="aspectFill" /> 
             <image class="card-text text-left" src="/static/images/wiki/text-vocal.png.png" mode="heightFix" /> 
             <view class="card-overlay"></view> 
         </view> 
       </view> 
 
       <view class="footer-spacer"></view> 
     </scroll-view> 
 
     <image class="vfx-bamboo" src="/static/images/wiki/vfx-bamboo.png.png" mode="aspectFill" /> 
 
     <CustomTabBar current-path="/pages/wiki/menu" /> 
   </view> 
 </template> 
 
 <script setup> 
 import { ref, onMounted } from 'vue'; 
 import CustomTabBar from '@/components/CustomTabBar.vue'; 
 
 const safeAreaTop = ref(40); 
 
 const goDetail = (type) => { 
   console.log('Navigate to:', type); 
   // Map simple keys to actual routes if needed
   const routes = {
     history: '/pages/wiki/history',
     craft: '/pages/wiki/craft',
     vocal: '/pages/wiki/music'
   };
   if (routes[type]) {
       uni.navigateTo({ url: routes[type] });
   }
 }; 
 
 onMounted(() => { 
     const menuButton = uni.getMenuButtonBoundingClientRect(); 
     if (menuButton) { 
         safeAreaTop.value = menuButton.top; 
     } 
 }); 
 </script> 
 
 <style lang="scss" scoped> 
 .wiki-container { 
     width: 100vw; height: 100vh; position: relative; 
     background-color: #1a1a1a; 
 } 
 .bg-fixed { 
     position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; opacity: 0.8; 
 } 
 
 /* Header */ 
 .page-header { 
     text-align: center; margin-bottom: 30px; 
 } 
 .header-title { 
     font-size: 28px; color: #E0D6C3; font-weight: bold; letter-spacing: 8px; display: block; 
     text-shadow: 0 4px 10px rgba(0,0,0,0.8); 
     font-family: serif; 
 } 
 .header-subtitle { 
     font-size: 12px; color: rgba(255,255,255,0.5); letter-spacing: 4px; margin-top: 8px; display: block; 
 } 
 
 /* Card List */ 
 .scroll-content { height: 100vh; box-sizing: border-box; } 
 .card-list { padding: 0 20px; display: flex; flex-direction: column; gap: 25px; } 
 
 .wiki-card { 
     position: relative; width: 100%; height: 180px; 
     border-radius: 12px; overflow: hidden; 
     box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
     border: 1px solid rgba(255,255,255,0.05); 
     transform: translateZ(0); transition: transform 0.3s; 
 } 
 .wiki-card:active { transform: scale(0.98); } 
 
 .card-bg { width: 100%; height: 100%; filter: brightness(0.7); transition: filter 0.3s; } 
 .wiki-card:active .card-bg { filter: brightness(0.9); } 
 
 /* Text Overlays */ 
 .card-text { 
     position: absolute; top: 20px; height: 140px; 
     z-index: 2; 
     filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8)); 
 } 
 .text-left { left: 30px; } 
 .text-right { right: 30px; } 
 
 .card-overlay { 
     position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
     background: linear-gradient(to top, rgba(0,0,0,0.6), transparent); 
     z-index: 1; 
 } 
 
 /* Bamboo VFX */ 
 .vfx-bamboo { 
     position: fixed; top: 0; left: 0; width: 120%; height: 120%; 
     z-index: 10; pointer-events: none; opacity: 0.8; 
     mix-blend-mode: multiply; 
     animation: sway 10s ease-in-out infinite alternate; 
 } 
 
 @keyframes sway { 
     0% { transform: translateX(0) rotate(0deg); } 
     100% { transform: translateX(-20px) rotate(1deg); } 
 } 
 
 .footer-spacer { height: 120px; } 
 </style>