<template>
  <view class="market-container">
    <!-- Custom Navbar -->
    <view class="custom-navbar" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="nav-content">
        <text class="page-title">文创集市</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content" :style="{ paddingTop: (safeAreaTop + 44) + 'px' }">
      <!-- Hero Banner -->
      <view class="hero-banner">
        <view class="banner-placeholder">
          <text class="banner-text">拾影 · 文创</text>
        </view>
      </view>

      <!-- Sticky Tabs -->
      <view class="sticky-tabs" :style="{ top: (safeAreaTop + 44) + 'px' }">
        <view 
          v-for="(cat, index) in categories" 
          :key="index"
          class="tab-item"
          :class="{ active: currentCatIndex === index }"
          @click="switchCat(index)"
        >
          <text>{{ cat }}</text>
        </view>
      </view>

      <!-- Product Grid -->
      <view class="product-grid">
        <view 
          v-for="item in displayProducts" 
          :key="item.id"
          class="product-card"
          @click="buyItem(item)"
        >
          <view class="card-image" :style="{ backgroundColor: item.color }"></view>
          <view class="card-info">
            <text class="card-title">{{ item.title }}</text>
            <view class="card-tags">
              <text v-for="(tag, i) in item.tags" :key="i" class="tag">{{ tag }}</text>
            </view>
            <view class="card-footer">
              <text class="price">¥{{ item.price }}</text>
              <view class="btn-buy">兑</view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- Bottom Padding for TabBar -->
      <view style="height: 100px;"></view>
    </scroll-view>

    <!-- Custom TabBar -->
    <CustomTabBar current-path="/pages/market/index" />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import CustomTabBar from '@/components/CustomTabBar.vue';

const safeAreaTop = uni.getSystemInfoSync().statusBarHeight || 20;

// 1. Categories
const categories = ['全部', '案头趣玩', '随身好物'];
const currentCatIndex = ref(0);

// 2. The 5 Boutique SKUs (Based on User Design)
const allProducts = [
  { id: 1, title: '透光·亚克力立牌', price: '19.9', tags: ['热销', '可定制'], category: '案头趣玩', color: '#E3F2FD' },
  { id: 2, title: '皮影·原色帆布袋', price: '29.9', tags: ['实用'], category: '随身好物', color: '#F3E5F5' },
  { id: 3, title: '掐丝·金属胸针', price: '15.0', tags: [], category: '随身好物', color: '#FFF3E0' },
  { id: 4, title: '千片·光影拼图', price: '49.0', tags: ['礼盒'], category: '案头趣玩', color: '#E8F5E9' },
  { id: 5, title: '皮影·磁吸冰箱贴', price: '12.0', tags: [], category: '案头趣玩', color: '#FFEBEE' }
];

// 3. Filter Logic
const displayProducts = computed(() => {
  if (currentCatIndex.value === 0) return allProducts;
  const targetCat = categories[currentCatIndex.value];
  return allProducts.filter(p => p.category === targetCat);
});

const switchCat = (index) => {
  currentCatIndex.value = index;
};

const buyItem = (item) => {
  uni.showToast({ title: `已兑换: ${item.title}`, icon: 'success' });
};
</script>

<style lang="scss" scoped>
.market-container {
  height: 100vh;
  background-color: #F7F5F0;
  display: flex;
  flex-direction: column;
}

/* Navbar */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background-color: rgba(247, 245, 240, 0.95);
  backdrop-filter: blur(10px);
  
  .nav-content {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .page-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
}

.scroll-content {
  flex: 1;
}

/* Hero Banner */
.hero-banner {
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ddd, #eee);
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-text {
  font-size: 24px;
  font-weight: bold;
  color: #999;
  letter-spacing: 4px;
}

/* Sticky Tabs */
.sticky-tabs {
  position: sticky;
  z-index: 90;
  display: flex;
  justify-content: space-around;
  background-color: #F7F5F0;
  padding: 15px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.tab-item {
  font-size: 16px;
  color: #666;
  padding-bottom: 5px;
  position: relative;
  
  &.active {
    color: #333;
    font-weight: bold;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      background-color: #D32F2F;
      border-radius: 2px;
    }
  }
}

/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 15px;
}

.product-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.card-image {
  width: 100%;
  aspect-ratio: 1;
  background-color: #f5f5f5;
}

.card-info {
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
  
  .tag {
    font-size: 10px;
    color: #D32F2F;
    border: 1px solid #D32F2F;
    padding: 1px 4px;
    border-radius: 4px;
  }
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #D32F2F;
}

.btn-buy {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #FFD700;
  color: #333;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(255, 215, 0, 0.4);
}
</style>