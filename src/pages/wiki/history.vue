<template>
  <view class="history-container">
    <!-- Custom Back Button -->
    <view class="back-btn" :style="{ top: safeAreaTop + 'px' }" @click="goBack">
      <text class="back-icon">←</text>
    </view>
    
    <!-- Background -->
    <view class="bg-layer"></view>
    
    <!-- Header -->
    <view class="header" :style="{ paddingTop: safeAreaTop + 'px' }">
      <text class="page-title">溯源 · 历史</text>
    </view>

    <!-- Timeline Swiper -->
    <view class="timeline-section">
      <swiper 
        class="history-swiper" 
        previous-margin="40px" 
        next-margin="40px"
        :current="activeIndex"
        @change="onSwiperChange"
      >
        <swiper-item v-for="(event, index) in historyEvents" :key="event.id">
          <view 
            class="history-card" 
            :class="{ active: activeIndex === index, special: event.isSpecial }"
          >
            <!-- Card Image -->
            <view class="card-image-wrapper">
              <view class="card-image-placeholder" :style="{ backgroundColor: getPlaceholderColor(index) }"></view>
              <view class="era-tag">{{ event.era }}</view>
            </view>
            
            <!-- Card Content -->
            <view class="card-content">
              <text class="card-title">{{ event.title }}</text>
              <text class="card-desc">{{ event.desc }}</text>
            </view>
            
            <!-- Timeline Node Connection (Visual) -->
            <view class="timeline-node">
              <view class="dot"></view>
              <view class="line"></view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    
    <!-- Bottom Timeline Indicator -->
    <view class="timeline-axis">
      <view class="axis-line"></view>
      <view 
        v-for="(event, index) in historyEvents" 
        :key="index"
        class="axis-dot"
        :class="{ active: activeIndex === index }"
      ></view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const safeAreaTop = uni.getSystemInfoSync().statusBarHeight || 20;
const activeIndex = ref(0);

const historyEvents = [
  { 
    id: 1, 
    era: '汉·武帝', 
    title: '光影初现', 
    desc: '方士少翁以此招魂，武帝隔帐观影。光影迷离间，皮影雏形初具。', 
    image: '/static/images/wiki/history/img-hist-han.jpg' 
  }, 
  { 
    id: 2, 
    era: '宋·仁宗', 
    title: '瓦舍勾栏', 
    desc: '绘革社兴，皮影走向市井。汴京繁华处，讲史演义，万人空巷。', 
    image: '/static/images/wiki/history/img-hist-song.jpg' 
  }, 
  { 
    id: 3, 
    era: '明·万历', 
    title: '滦州成影', 
    desc: '落第秀才黄素志改良影人，雕镂驴皮，创立“乐亭影”独特唱腔。', 
    image: '/static/images/wiki/history/img-hist-ming.jpg' 
  }, 
  { 
    id: 4, 
    era: '清·中晚期', 
    title: '入京夺魁', 
    desc: '滦冀东影班进京庆寿，王府贵胄争相延请，名动京师，谓之“王府影。', 
    image: '/static/images/wiki/history/img-hist-qing.jpg' 
  }, 
  { 
    id: 5, 
    era: '清末·民初', 
    title: '百团争艳', 
    desc: '冀东影班“开荒”关外，雕刻工艺登峰造极，影人关节多达十余处。', 
    image: '/static/images/wiki/history/img-hist-republic.jpg' 
  }, 
  { 
    id: 6, 
    era: '公元 2006', 
    title: '非遗新生', 
    desc: '唐山皮影入选首批国家级非遗名录，古老唱腔响彻世界舞台。', 
    image: '/static/images/wiki/history/img-hist-modern.jpg' 
  }, 
  { 
    id: 7, 
    era: '未来 · 你我', 
    title: '薪火相传', 
    desc: '“功成不必在我，功成必定有我。”\n数字光影流转，此刻，你我皆是守艺人。', 
    image: '/static/images/wiki/history/img-hist-future.jpg', 
    isSpecial: true 
  } 
];

const onSwiperChange = (e) => {
  activeIndex.value = e.detail.current;
};

const goBack = () => {
  uni.navigateBack();
};

const getPlaceholderColor = (index) => {
  const colors = ['#5D4037', '#795548', '#8D6E63', '#A1887F', '#BCAAA4', '#D7CCC8', '#3E2723'];
  return colors[index % colors.length];
};
</script>

<style lang="scss" scoped>
.history-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-color: #3E2723;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.bg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #5D4037 0%, #2C1608 100%);
  opacity: 0.8;
  z-index: 1;
}

.back-btn {
  position: absolute;
  left: 20px;
  z-index: 100;
  width: 40px;
  height: 40px;
  background-color: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  color: #D7CCC8;
  font-size: 20px;
  font-weight: bold;
}

.header {
  position: relative;
  z-index: 10;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  color: #D7CCC8;
  font-size: 20px;
  letter-spacing: 4px;
  font-family: serif;
}

.timeline-section {
  flex: 1;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
}

.history-swiper {
  width: 100%;
  height: 500px;
}

.history-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.5s;
  transform: scale(0.9);
  opacity: 0.6;
  
  &.active {
    transform: scale(1);
    opacity: 1;
  }
}

.card-image-wrapper {
  width: 260px;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 20px rgba(0,0,0,0.5);
  margin-bottom: 30px;
  border: 4px solid #8D6E63;
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
}

.era-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0,0,0,0.7);
  color: #FFD700;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}

.card-content {
  width: 260px;
  background-color: #F7F5F0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  position: relative;
  
  /* Paper texture effect */
  background-image: radial-gradient(#d0d0d0 1px, transparent 1px);
  background-size: 10px 10px;
}

.card-title {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 10px;
  font-family: serif;
}

.card-desc {
  font-size: 14px;
  color: #5D4037;
  line-height: 1.6;
  text-align: justify;
}

.special .card-content {
  background-color: #3E2723;
  border: 1px solid #FFD700;
}

.special .card-title {
  color: #FFD700;
}

.special .card-desc {
  color: #D7CCC8;
}

/* Timeline Axis Visuals */
.timeline-axis {
  position: relative;
  z-index: 10;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
}

.axis-line {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 2px;
  background-color: rgba(255,255,255,0.2);
  z-index: 0;
}

.axis-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.3);
  z-index: 1;
  transition: all 0.3s;
  
  &.active {
    background-color: #FFD700;
    transform: scale(1.5);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
}
</style>