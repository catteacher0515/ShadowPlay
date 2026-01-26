<template> 
   <view class="history-container"> 
     <!-- Header --> 
     <view class="page-header" :style="{ paddingTop: safeAreaTop + 'px' }"> 
       <view class="back-btn" @click="goBack">←</view> 
       <text class="page-title">溯源 · 历史</text> 
     </view> 
  
     <!-- Scroll Content --> 
     <scroll-view scroll-y class="timeline-scroll" :style="{ paddingTop: (safeAreaTop + 60) + 'px' }"> 
       <view class="timeline-content"> 
         <!-- Center Line --> 
         <view class="timeline-axis"></view> 
  
         <!-- Event Cards --> 
         <view 
           class="event-card" 
           v-for="(item, index) in historyEvents" 
           :key="item.id" 
           :class="{ 'special-card': item.isSpecial }" 
         > 
           <!-- Image Section --> 
           <view class="card-media"> 
             <image class="media-img" :src="item.image" mode="aspectFill" /> 
             <view class="media-filter"></view> 
           </view> 
  
           <!-- Text Section --> 
           <view class="card-info"> 
             <text class="info-era">{{ item.era }}</text> 
             <text class="info-title">{{ item.title }}</text> 
             <text class="info-desc">{{ item.desc }}</text> 
           </view> 
  
           <!-- Timeline Dot --> 
           <view class="timeline-dot"></view> 
         </view> 
  
         <!-- Footer Spacer --> 
         <view class="footer-spacer"></view> 
       </view> 
     </scroll-view> 
   </view> 
 </template> 
  
 <script setup> 
 import { ref, onMounted } from 'vue'; 
  
 const safeAreaTop = ref(40); 
  
 const historyEvents = [ 
   { id: 1, era: '汉·武帝', title: '光影初现', desc: '方士少翁以此招魂，武帝隔帐观影。光影迷离间，皮影雏形初具。', image: '/static/images/wiki/history/hist-han.png' }, 
   { id: 2, era: '宋·仁宗', title: '瓦舍勾栏', desc: '绘革社兴，皮影走向市井。汴京繁华处，讲史演义，万人空巷。', image: '/static/images/wiki/history/hist-song.png' }, 
   { id: 3, era: '明·万历', title: '滦州成影', desc: '落第秀才黄素志改良影人，雕镂驴皮，创立“乐亭影”独特唱腔。', image: '/static/images/wiki/history/hist-ming.png' }, 
   { id: 4, era: '清·中晚期', title: '入京夺魁', desc: '冀东影班进京庆寿，王府贵胄争相延请，名动京师，谓之“王府影”。', image: '/static/images/wiki/history/hist-qing.png' }, 
   { id: 5, era: '清末·民初', title: '百团争艳', desc: '影班“开荒”关外，雕刻工艺登峰造极，影人结构精妙，关节多达十余处。', image: '/static/images/wiki/history/hist-republic.png' }, 
   { id: 6, era: '公元 2006', title: '非遗新生', desc: '唐山皮影入选首批国家级非遗名录，古老唱腔响彻世界舞台。', image: '/static/images/wiki/history/hist-modern.png' }, 
   { id: 7, era: '未来 · 你我', title: '薪火相传', desc: '“功成不必在我，功成必定有我。”\n数字光影流转，此刻，你我皆是守艺人。', image: '/static/images/wiki/history/hist-future.png', isSpecial: true } 
 ]; 
  
 const goBack = () => { 
   uni.navigateBack(); 
 }; 
  
 onMounted(() => { 
   const menuButton = uni.getMenuButtonBoundingClientRect(); 
   if (menuButton) { 
     safeAreaTop.value = menuButton.top; 
   } 
 }); 
 </script> 
  
 <style lang="scss" scoped> 
 .history-container { 
   width: 100vw; height: 100vh; background-color: #1a1512; 
   position: relative; overflow: hidden; 
 } 
  
 /* Header */ 
 .page-header { 
   position: fixed; top: 0; left: 0; width: 100%; z-index: 100; 
   display: flex; align-items: center; padding-left: 20px; 
   height: 44px; background: rgba(26, 21, 18, 0.9); 
   backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.05); 
 } 
 .back-btn { 
   color: #fff; font-size: 24px; padding: 10px; margin-right: 10px; 
 } 
 .page-title { 
   color: #E0D6C3; font-size: 18px; font-weight: bold; letter-spacing: 2px; 
 } 
  
 /* Timeline Scroll */ 
 .timeline-scroll { height: 100vh; box-sizing: border-box; } 
 .timeline-content { 
   padding: 20px 20px; position: relative; 
   display: flex; flex-direction: column; align-items: center; 
 } 
  
 /* Center Axis */ 
 .timeline-axis { 
   position: absolute; top: 20px; bottom: 50px; left: 50%; 
   width: 1px; background: rgba(255, 215, 0, 0.2); 
   transform: translateX(-50%); z-index: 0; 
 } 
  
 /* Event Card (Z-Pattern) */ 
 .event-card { 
   width: 100%; display: flex; align-items: center; justify-content: space-between; 
   margin-bottom: 60px; position: relative; z-index: 1; 
 } 
  
 /* Alternating Layout Logic */ 
 .event-card:nth-child(even) { 
   flex-direction: row-reverse; 
 } 
  
 /* Media Section */ 
 .card-media { 
   width: 44%; height: 240rpx; /* Fixed height as requested */ 
   position: relative; border-radius: 8px; overflow: hidden; 
   box-shadow: 0 4px 12px rgba(0,0,0,0.5); 
   border: 1px solid rgba(255,255,255,0.1); 
 } 
 .media-img { width: 100%; height: 100%; } 
 .media-filter { 
   position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
   background-color: rgba(60, 40, 20, 0.2); /* Sepia Filter */ 
   mix-blend-mode: multiply; 
 } 
  
 /* Info Section */ 
 .card-info { 
   width: 48%; display: flex; flex-direction: column; 
   /* Text alignment follows the card direction */ 
 } 
 .event-card:nth-child(odd) .card-info { text-align: left; } 
 .event-card:nth-child(even) .card-info { text-align: right; } 
  
 .info-era { 
   font-size: 12px; color: #FFD700; opacity: 0.8; margin-bottom: 4px; 
   font-family: serif; letter-spacing: 1px; 
 } 
 .info-title { 
   font-size: 18px; color: #E0D6C3; font-weight: bold; margin-bottom: 8px; 
   text-shadow: 0 2px 4px rgba(0,0,0,0.8); 
 } 
 .info-desc { 
   font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6; 
   text-align: justify; 
 } 
  
 /* Timeline Dot */ 
 .timeline-dot { 
   position: absolute; left: 50%; top: 50%; 
   width: 8px; height: 8px; background: #FFD700; 
   border-radius: 50%; transform: translate(-50%, -50%); 
   box-shadow: 0 0 8px rgba(255, 215, 0, 0.6); 
   border: 2px solid #1a1512; /* Gap effect */ 
 } 
  
 /* Special Card (Future) */ 
 .special-card .info-title { color: #fff; text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); } 
 .special-card .timeline-dot { width: 12px; height: 12px; background: #fff; } 
  
 .footer-spacer { height: 100px; } 
 </style>