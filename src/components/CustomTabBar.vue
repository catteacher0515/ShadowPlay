<template>
  <view class="tabbar-container">
    <view class="tabbar-bg"></view>
    <view 
      class="tab-item" 
      v-for="(item, index) in tabList" 
      :key="index" 
      @click="switchTab(item.path)" 
    >
      <text class="tab-text" :class="{ active: currentPath === item.path }">
        {{ item.name }}
      </text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPath: { type: String, default: '' }
});

const tabList = [
  { name: '大厅', path: '/pages/index/index' },
  { name: '工坊', path: '/pages/workshop/index' },
  { name: '剧场', path: '/pages/theater/index' },
  { name: '影卷', path: '/pages/wiki/menu' },
  { name: '集市', path: '/pages/market/index' }
];

const switchTab = (path) => {
  // Use switchTab for TabBar pages as configured in pages.json
  // Although the user prompt suggested reLaunch, for actual TabBar pages switchTab is usually correct/required.
  // However, the user prompt explicitly requested: "Use reLaunch to clear stack and ensure clean navigation"
  // I will follow the user's specific instruction to use reLaunch, assuming they might want to override standard behavior or are using this component in a specific way.
  // Wait, if pages are defined in tabBar in pages.json, reLaunch might fail or behave oddly? 
  // Actually, reLaunch works for any page including tabs. It fully reloads the app.
  // Given the explicit instruction "Use reLaunch", I will use it.
  uni.reLaunch({ url: path });
};
</script>

<style lang="scss" scoped>
.tabbar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px; /* Safe area included */
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 999;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.tab-text {
  color: #999;
  font-size: 14px;
  &.active { color: #FFD700; font-weight: bold; }
}
</style>