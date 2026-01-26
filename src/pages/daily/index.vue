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
           <image class="main-art" src="/static/images/daily/sample-shadow-hunting.jpg.jpg" mode="aspectFill" /> 
           
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
   z-index: 0; opacity: 0.6; 
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
   padding-bottom: 60px; 
 } 
 
 /* THE UNIFIED PAPER CARD */ 
 .paper-card { 
   width: 650rpx; 
   height: 1000rpx; 
   /* 米黄色宣纸底色 */
   background-color: #F5EAD4; 
   background-image: linear-gradient(to bottom, #F5EAD4, #EBE0C5); 
   border-radius: 12rpx; 
   box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
   overflow: hidden; 
   display: flex; flex-direction: column; 
   position: relative; 
 } 
 
 /* Top Visual Area (60% Height) */ 
 .visual-box { 
   flex: 6; /* 占比调大一点，让图大一点 */
   position: relative; 
   width: 100%; 
   overflow: hidden; 
 } 
 .main-art { 
   width: 100%; height: 100%; 
   /* ⚠️ 关键修正：用 aspectFill 撑满，不留黑边 */
   /* 混合模式保留，如果是白底图会变透明 */
   mix-blend-mode: multiply; 
   opacity: 0.95; 
 } 
 
 /* Date Overlay */ 
 .date-overlay { 
   position: absolute; top: 60rpx; left: 0; width: 100%; 
   display: flex; flex-direction: column; align-items: center; 
   z-index: 20; 
   /* 给文字加个阴影，防止背景太花看不清 */
   text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);
 } 
 .lunar-text { 
   writing-mode: vertical-rl; 
   font-family: 'Songti SC', serif; 
   font-size: 34rpx; color: #2C1608; 
   margin-bottom: 12rpx; letter-spacing: 6rpx; 
   font-weight: bold; 
 } 
 .solar-text { 
   font-family: 'Courier New', serif; 
   font-size: 22rpx; color: #555; 
   margin-top: 12rpx; 
   font-weight: 600;
 } 
 .divider-line { 
   height: 40rpx; opacity: 0.8; 
 } 
 
 /* Bottom Text Area (40% Height) */ 
 .text-box { 
   flex: 4; 
   position: relative; 
   width: 100%; 
   display: flex; align-items: center; justify-content: center; 
   background: transparent; /* 透出底下的纸纹 */
 } 
 .content-layer { 
   width: 100%; padding: 0 40rpx; 
   display: flex; flex-direction: column; align-items: center; 
 } 
 .poem { 
   font-family: 'Songti SC', serif; 
   font-size: 38rpx; color: #2C1608; 
   margin-bottom: 40rpx; letter-spacing: 2rpx; 
   text-align: center; 
   font-weight: bold;
 } 
 .daily-advice { 
   display: flex; align-items: center; 
   font-size: 26rpx; color: #8A6D3B; 
   margin-bottom: 50rpx; 
   border-top: 1px solid rgba(138, 109, 59, 0.3);
   border-bottom: 1px solid rgba(138, 109, 59, 0.3);
   padding: 10rpx 20rpx;
 } 
 
 /* ⚠️ 关键修正：这里原来的类名是 .stamp，必须改成 .brand-stamp */
 .brand-stamp { 
   height: 80rpx; /* 锁死高度 */
   width: 200rpx; /* 锁死宽度，防止被原图撑爆 */
   opacity: 0.7; 
   mix-blend-mode: multiply; 
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