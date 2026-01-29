<template> 
   <view class="craft-container"> 
     
     <swiper 
       class="fullscreen-swiper" 
       vertical 
       circular 
       @change="onSwiperChange" 
     > 
       <swiper-item v-for="(step, index) in steps" :key="step.id"> 
         <view class="slide-item"> 
           <image 
             class="bg-img" 
             :src="step.src" 
             mode="aspectFill" 
           /> 
           
           <view class="overlay-gradient"> 
             <view class="step-info"> 
               <view class="step-header"> 
                 <text class="step-num">0{{ step.id }}</text> 
                 <view class="step-titles"> 
                   <text class="title-cn">{{ step.title }}</text> 
                   <text class="title-en">{{ step.en }}</text> 
                 </view> 
               </view> 
               <text class="step-desc">{{ step.desc }}</text> 
             </view> 
           </view> 
         </view> 
       </swiper-item> 
     </swiper> 
 
     <!-- Fixed UI Elements --> 
     <view class="nav-back" :style="{ top: safeAreaTop + 'px' }" @click="goBack"> 
       <text class="back-icon">←</text> 
     </view> 
 
     <view class="swipe-hint" v-if="currentIndex < 7"> 
       <view class="arrow-up"></view> 
       <text class="hint-text">上滑查看工序</text> 
     </view> 
 
   </view> 
 </template> 
 
 <script setup> 
 import { ref, onMounted } from 'vue'; 
 
 const safeAreaTop = ref(40); 
 const currentIndex = ref(0); 
 
 const steps = [ 
   { 
     id: 1, 
     title: '选皮', 
     en: 'Selecting', 
     desc: '严选关中秦川驴皮，皮质厚实坚韧。背光透视，需如琥珀般通透无瑕，方为上品。', 
     src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/wiki/craft/bg-proc-01.jpg.png' 
   }, 
   { 
     id: 2, 
     title: '制皮', 
     en: 'Preparing', 
     desc: '月牙刀推刮去毛，净除油脂。这是力与柔的博弈，直至皮板薄如蝉翼，润如凝脂。', 
     src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/wiki/craft/bg-proc-02.jpg.png' 
   }, 
   { 
     id: 3, 
     title: '画稿', 
     en: 'Drawing', 
     desc: '墨笔勾勒，落笔生神。通天鼻、凤眼、额头平扁，三笔定乾坤，绘出皮影灵魂。', 
     src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/wiki/craft/bg-proc-03.jpg.png' 
   }, 
   { 
     id: 4, 
     title: '过稿', 
     en: 'Tracing', 
     desc: '钢针代替画笔，在皮面上扎出千万针孔。不留墨迹，只留针痕，为雕刻定下精密坐标。', 
     src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/wiki/craft/bg-proc-04.jpg.png' 
   }, 
   { 
     id: 5, 
     title: '镂刻', 
     en: 'Carving', 
     desc: '推皮走刀，刀停皮转。指尖毫厘之间，刻出万千气象。讲究圆转如意，严丝合缝。', 
     src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/wiki/craft/bg-proc-05.jpg.png' 
   }, 
   { 
     id: 6, 
     title: '敷彩', 
     en: 'Coloring', 
     desc: '双面点染，色透肌理。红绿重彩入皮三分，灯光映照下，如红宝石般熠熠生辉。', 
     src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/wiki/craft/bg-proc-06.jpg.png' 
   }, 
   { 
     id: 7, 
     title: '发汗', 
     en: 'Ironing', 
     desc: '高温熨烫，脱胎换骨。热压瞬间，皮内水分蒸腾，色泽由雾面瞬间转为晶莹剔透。', 
     src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/wiki/craft/bg-proc-07.jpg.png' 
   }, 
   { 
     id: 8, 
     title: '钉缀', 
     en: 'Assembling', 
     desc: '丝线穿结，骨肉相连。颈、肩、肘、腕、膝，巧设关节，赋予皮影灵动的生命。', 
     src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/wiki/craft/bg-proc-08.jpg.png' 
   } 
 ]; 
 
 const onSwiperChange = (e) => { 
   currentIndex.value = e.detail.current; 
 }; 
 
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
 .craft-container { 
   width: 100vw; height: 100vh; background-color: #000; position: relative; 
 } 
 
 .fullscreen-swiper { 
   width: 100%; height: 100%; 
 } 
 
 .slide-item { 
   width: 100%; height: 100%; position: relative; 
 } 
 
 .bg-img { 
   width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 0; 
 } 
 
 /* Gradient Overlay for Text Readability */ 
 .overlay-gradient { 
   position: absolute; bottom: 0; left: 0; width: 100%; height: 50%; 
   background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%); 
   z-index: 1; 
   display: flex; align-items: flex-end; 
 } 
 
 .step-info { 
   padding: 0 30px 60px 30px; 
   color: #fff; 
 } 
 
 .step-header { 
   display: flex; align-items: center; margin-bottom: 16px; 
 } 
 
 .step-num { 
   font-size: 60px; font-weight: bold; color: rgba(255, 215, 0, 0.3); /* Transparent Gold */ 
   margin-right: 15px; font-family: 'Impact', sans-serif; 
   line-height: 1; 
 } 
 
 .step-titles { 
   display: flex; flex-direction: column; 
 } 
 
 .title-cn { 
   font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #FFD700; 
   text-shadow: 0 2px 4px rgba(0,0,0,0.5); 
 } 
 
 .title-en { 
   font-size: 14px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; 
 } 
 
 .step-desc { 
   font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.9); 
   text-align: justify; letter-spacing: 1px; 
 } 
 
 /* Navigation */ 
 .nav-back { 
   position: fixed; left: 20px; z-index: 100; 
   width: 40px; height: 40px; border-radius: 50%; 
   background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); 
   display: flex; justify-content: center; align-items: center; 
 } 
 .back-icon { 
   color: #fff; font-size: 20px; font-weight: bold; 
 } 
 
 /* Swipe Hint */ 
 .swipe-hint { 
   position: fixed; bottom: 20px; left: 0; width: 100%; 
   display: flex; flex-direction: column; align-items: center; 
   z-index: 10; opacity: 0.7; 
   animation: bounce 2s infinite; 
 } 
 
 .arrow-up { 
   width: 12px; height: 12px; 
   border-top: 2px solid #fff; border-left: 2px solid #fff; 
   transform: rotate(45deg); margin-bottom: 5px; 
 } 
 
 .hint-text { 
   font-size: 12px; color: #fff; letter-spacing: 2px; 
 } 
 
 @keyframes bounce { 
   0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 
   40% { transform: translateY(-10px); } 
   60% { transform: translateY(-5px); } 
 } 
 </style>