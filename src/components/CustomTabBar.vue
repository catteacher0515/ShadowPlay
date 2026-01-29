<template>
  <view class="tabbar-container">
    
    <image 
      class="bg-img" 
      src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/tabbar/bg-tabbar-clouds.png.jpg" 
      mode="scaleToFill" 
    ></image>

    <view class="dark-overlay"></view>

    <view class="tabbar-content">
      <view 
        v-for="(item, index) in tabList" 
        :key="index" 
        class="tab-item"
        @click="switchTab(item.pagePath)"
      >
        <view class="icon-wrapper">
            <image 
                class="tab-icon" 
                :src="currentPath === item.pagePath ? item.iconOn : item.iconOff" 
                mode="aspectFit"
            ></image>
            <view v-if="currentPath === item.pagePath" class="active-glow"></view>
        </view>
        
        <text 
            class="tab-text" 
            :class="{ 'active': currentPath === item.pagePath }"
        >{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  currentPath: { type: String, default: '/pages/index/index' }
});

// 数据配置：严格匹配你的文件名
const tabList = [
  { pagePath: '/pages/index/index', text: '大厅', iconOff: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/tabbar/tab-icon-hall-off.png.png', iconOn: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/tabbar/tab-icon-hall-on.png.png' },
  { pagePath: '/pages/workshop/index', text: '工坊', iconOff: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/tabbar/tab-icon-workshop-off.png.png', iconOn: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/tabbar/tab-icon-workshop-on.png.png' },
  { pagePath: '/pages/theater/index', text: '剧场', iconOff: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/tabbar/tab-icon-theater-off.png.png', iconOn: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/tabbar/tab-icon-theater-on.png.png' },
  { pagePath: '/pages/wiki/menu', text: '影卷', iconOff: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/tabbar/tab-icon-wiki-off.png.png', iconOn: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/tabbar/tab-icon-wiki-on.png.png' },
  { pagePath: '/pages/market/index', text: '集市', iconOff: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/tabbar/tab-icon-market-off.png.png', iconOn: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/tabbar/tab-icon-market-on.png.png' }
];

const switchTab = (path) => {
  uni.reLaunch({ url: path });
};
</script>

<style lang="scss" scoped>
.tabbar-container {
  position: fixed; bottom: 0; left: 0; width: 100%; height: 120px; z-index: 999; pointer-events: none; 
}

/* 背景图片铺满 */
.bg-img {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; z-index: 0;
}

/* 黑色渐变遮罩：解决“白云吃白字”的问题 */
.dark-overlay {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; z-index: 1;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(30,30,30,0.7) 60%, transparent 100%);
}

/* 图标文字内容 */
.tabbar-content {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; 
  z-index: 2; /* 确保内容在最上层 */
  display: flex; justify-content: space-around; align-items: flex-end; 
  /* 核心布局修复：通过 padding-bottom 把图标顶上去，离开底部边缘 */
  padding-bottom: 35px; 
  pointer-events: auto; 
}

.tab-item {
  display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; 
  margin-bottom: 10px; 
}

.icon-wrapper {
  position: relative; width: 32px; height: 32px; margin-bottom: 4px; 
  display: flex; justify-content: center; align-items: center; 
}
.tab-icon { width: 100%; height: 100%; } 

/* 选中态背后的光晕 */
.active-glow { 
  position: absolute; width: 44px; height: 44px; 
  background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%); z-index: -1; 
} 

.tab-text { 
  font-size: 11px; color: rgba(255, 255, 255, 0.8); transition: all 0.3s; letter-spacing: 1px; 
  text-shadow: 0 1px 3px rgba(0,0,0,1); 
  
  &.active { color: #FFD700; font-weight: bold; text-shadow: 0 0 5px rgba(255, 215, 0, 0.6); } 
} 
</style>