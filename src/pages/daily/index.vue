<template> 
   <view class="daily-page"> 
     <image class="bg-layer" src="/static/images/daily/bg-detail-paper-texture.jpg.jpg" mode="aspectFill" /> 
 
     <view class="nav-bar" :style="{ paddingTop: safeAreaTop + 'px' }"> 
       <view class="back-btn" @click="goBack"> 
         <image src="/static/images/daily/icon-nav-back-white.png.png" mode="aspectFit" /> 
       </view> 
       <text class="page-title">拾影·日签</text> 
     </view> 
 
     <view class="card-container"> 
       <view class="paper-card"> 
         
         <view class="visual-box"> 
           <image class="main-art" src="/static/images/daily/sample-shadow-hunting.jpg.jpg" mode="aspectFit" /> 
           
           <view class="date-overlay"> 
             <text class="lunar-text">乙巳年 正月廿三</text> 
             <image class="divider-line" src="/static/images/daily/deco-date-divider.png.png" mode="heightFix" /> 
             <text class="solar-text">2026.02.20</text> 
           </view> 
         </view> 
 
         <view class="text-box"> 
           <view class="content-layer"> 
             <text class="poem">鹿鸣悠悠，马鸣萧萧。</text> 
             <view class="daily-advice"> 
               <text class="label">今日，</text> 
               <text class="value">宜一团和气。</text> 
             </view> 
             <image class="brand-stamp" src="/static/images/daily/stamp-watermark-brand.png.png" mode="heightFix" /> 
           </view> 
         </view> 
 
       </view> 
     </view> 
 
     <view class="footer-area"> 
       <view class="save-btn" @click="onSave" hover-class="btn-hover"> 
         <image class="icon" src="/static/images/daily/icon-btn-download-gold.png.png" /> 
         <text>收入金库</text> 
       </view> 
     </view> 
 
   </view> 
 </template> 
 
 <script setup> 
 import { ref, onMounted } from 'vue'; 
 
 const safeAreaTop = ref(44); 
 
 const goBack = () => uni.navigateBack(); 
 
 const onSave = () => { 
   uni.showToast({ title: '已收入金库', icon: 'success' }); 
 }; 
 
 onMounted(() => { 
   const sys = uni.getSystemInfoSync(); 
   if (sys.safeAreaInsets?.top) { 
     safeAreaTop.value = sys.safeAreaInsets.top; 
   } 
 }); 
 </script> 
 
 <style lang="scss" scoped> 
 /* Page Layout */ 
 .daily-page { 
   width: 100vw; height: 100vh; 
   position: relative; overflow: hidden; 
   background-color: #1a1a1a; 
 } 
 .bg-layer { 
   position: absolute; inset: 0; width: 100%; height: 100%; 
   z-index: 0; opacity: 0.6; /* Dim the background texture slightly */ 
 } 
 
 /* Navbar */ 
 .nav-bar { 
   position: absolute; top: 0; left: 0; width: 100%; 
   z-index: 100; display: flex; align-items: center; height: 44px; 
 } 
 .back-btn { 
   width: 40px; height: 40px; margin-left: 10px; 
   display: flex; align-items: center; justify-content: center; 
   image { width: 24px; height: 24px; } 
 } 
 .page-title { 
   position: absolute; left: 50%; transform: translateX(-50%); 
   color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 500; 
   letter-spacing: 1px; 
 } 
 
 /* CARD CONTAINER */ 
 .card-container { 
   position: relative; z-index: 10; 
   width: 100%; height: 100%; 
   display: flex; justify-content: center; align-items: center; 
   padding-bottom: 60px; /* Space for footer button */ 
 } 
 
 /* THE UNIFIED PAPER CARD */ 
 .paper-card { 
   width: 650rpx; 
   /* Fixed Aspect Ratio for a long card */ 
   height: 1000rpx; 
   background-color: #F5EAD4; /* VINTAGE PAPER COLOR */ 
   background-image: linear-gradient(to bottom, #F5EAD4, #EBE0C5); /* Subtle gradient */ 
   border-radius: 12rpx; 
   box-shadow: 0 10px 30px rgba(0,0,0,0.5); /* Deep shadow for 3D effect */ 
   overflow: hidden; 
   display: flex; flex-direction: column; 
   position: relative; 
   
   /* Add a subtle noise texture using a pseudo-element if possible, 
      or just stick to the color for now to fix the "Black Void" issue. */ 
 } 
 
 /* Top Visual Area */ 
 .visual-box { 
   flex: 5; /* Takes up 50-60% of the card */ 
   position: relative; 
   width: 100%; 
   overflow: hidden; 
   /* Make sure the image blends nicely */ 
 } 
 .main-art { 
   width: 100%; height: 100%; 
   /* Assuming the image might have a white/black bg, multiply helps blend it into the paper */ 
   mix-blend-mode: multiply; 
   opacity: 0.9; 
 } 
 
 /* Date Overlay */ 
 .date-overlay { 
   position: absolute; top: 40rpx; left: 0; width: 100%; 
   display: flex; flex-direction: column; align-items: center; 
   z-index: 20; 
 } 
 .lunar-text { 
   writing-mode: vertical-rl; /* Vertical Text */ 
   font-family: 'Songti SC', serif; 
   font-size: 32rpx; color: #333; /* Dark text on paper */ 
   margin-bottom: 10rpx; letter-spacing: 4rpx; 
   font-weight: bold; 
 } 
 .solar-text { 
   font-family: 'Courier New', serif; 
   font-size: 20rpx; color: #666; 
   margin-top: 10rpx; 
 } 
 .divider-line { 
   height: 40rpx; opacity: 0.6; 
 } 
 
 /* Bottom Text Area */ 
 .text-box { 
   flex: 3; /* Takes up the rest */ 
   position: relative; 
   width: 100%; 
   display: flex; align-items: center; justify-content: center; 
   /* No separate background image needed, it inherits the card's paper color */ 
 } 
 .content-layer { 
   width: 100%; padding: 0 40rpx; 
   display: flex; flex-direction: column; align-items: center; 
 } 
 .poem { 
   font-family: 'Songti SC', serif; 
   font-size: 36rpx; color: #2C1608; 
   margin-bottom: 40rpx; letter-spacing: 2rpx; 
   text-align: center; 
 } 
 .daily-advice { 
   display: flex; align-items: center; 
   font-size: 24rpx; color: #8A6D3B; 
   margin-bottom: 40rpx; 
 } 
 .stamp { 
   height: 60rpx; opacity: 0.8; mix-blend-mode: multiply; 
 } 
 
 /* Footer Action */ 
 .footer-area { 
   position: absolute; bottom: 50rpx; width: 100%; 
   display: flex; justify-content: center; z-index: 20; 
 } 
 .save-btn { 
   display: flex; flex-direction: column; align-items: center; 
   .icon { width: 100rpx; height: 100rpx; margin-bottom: 10rpx; } 
   text { font-size: 24rpx; color: #E0D6C3; letter-spacing: 1px; } 
 } 
 </style>