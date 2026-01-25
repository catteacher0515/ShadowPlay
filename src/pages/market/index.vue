<template>
  <view class="market-container">
    
    <view class="bg-dark"></view>

    <view class="custom-navbar" :style="{ paddingTop: safeAreaTop + 'px', height: navHeight + 'px' }">
      <view class="nav-title" :style="{ lineHeight: navHeight + 'px' }">文创集市</view>
    </view>

    <scroll-view scroll-y class="scroll-content" :style="{ paddingTop: (safeAreaTop + navHeight) + 'px' }">
      
      <view class="hero-banner">
        <image class="banner-img" src="/static/images/market/banner-market-bridge.jpg" mode="aspectFill" />
        <view class="banner-text">
            <text class="slogan-main">拾影 · 文创</text>
            <text class="slogan-sub">让非遗回归生活</text>
        </view>
        <view class="banner-fade"></view>
      </view>

      <view 
        class="sticky-tabs" 
        :style="{ top: (safeAreaTop + navHeight) + 'px' }"
      >
        <view 
            class="tab-item" 
            v-for="(tab, index) in tabs" 
            :key="index"
            :class="{ active: currentTab === index }"
            @click="currentTab = index"
        >
            <text class="tab-text">{{ tab }}</text>
            <image 
                v-if="currentTab === index" 
                class="tab-brush" 
                src="/static/images/market/ui-tab-active.png" 
                mode="aspectFit" 
            />
        </view>
      </view>

      <view class="product-grid">
        <view class="product-card" v-for="(item, index) in products" :key="index">
            <view class="card-img-box">
                <image class="prod-img" :src="item.img" mode="aspectFit" />
            </view>
            <view class="card-info">
                <text class="prod-title">{{ item.name }}</text>
                <view class="prod-tags">
                    <text class="tag">{{ item.tag }}</text>
                </view>
                <view class="prod-footer">
                    <text class="price"><text class="symbol">¥</text>{{ item.price }}</text>
                    
                    <image 
                        class="btn-buy vintage-filter" 
                        src="/static/images/market/btn-buy-seal.png" 
                        @click.stop="handleBuy(item)"
                    />
                </view>
            </view>
        </view>
      </view>

      <view class="footer-spacer">
          <view class="footer-fade"></view>
      </view>

    </scroll-view>

    <CustomTabBar current-path="/pages/market/index" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CustomTabBar from '@/components/CustomTabBar.vue';

const safeAreaTop = ref(20);
const navHeight = ref(32);
const currentTab = ref(0);
const tabs = ['全部', '案头趣玩', '随身好物'];

const products = ref([
    { name: '透光·亚克力立牌', price: '19.9', tag: '热销', img: '/static/images/market/sku-placeholder.png' },
    { name: '皮影·原色帆布袋', price: '29.9', tag: '实用', img: '/static/images/market/sku-placeholder.png' },
    { name: '掐丝·金属胸针', price: '15.0', tag: '精致', img: '/static/images/market/sku-placeholder.png' },
    { name: '千片·光影拼图', price: '49.0', tag: '礼盒', img: '/static/images/market/sku-placeholder.png' },
    { name: '皮影·磁吸冰箱贴', price: '12.0', tag: '有趣', img: '/static/images/market/sku-placeholder.png' },
    { name: '大闹天宫·主题T恤', price: '59.0', tag: '上新', img: '/static/images/market/sku-placeholder.png' },
]);

// --- FIX: Fake Buy Interaction ---
const handleBuy = (item) => {
    uni.showModal({
        title: '感谢雅赏',
        content: `感谢您对非遗文创的喜爱！\n此为【挑战杯】参赛演示项目，暂未接入银号（支付系统）。\n\n您的每一次点击，都是对皮影艺术最大的支持！`,
        showCancel: false,
        confirmText: '心意收下',
        confirmColor: '#B22222'
    });
};

onMounted(() => {
    const menuButton = uni.getMenuButtonBoundingClientRect();
    if (menuButton) {
        safeAreaTop.value = menuButton.top;
        navHeight.value = menuButton.height;
    }
});
</script>

<style lang="scss" scoped>
/* 1. Global Dark Theme */
.market-container {
    width: 100vw; height: 100vh; position: relative; 
    background-color: #1A120B; 
}
.bg-dark {
    position: absolute; width: 100%; height: 100%; z-index: 0;
    background-color: #1A120B; 
}

/* Navbar */
.custom-navbar {
    position: fixed; top: 0; left: 0; width: 100%; z-index: 100;
    background: rgba(26, 18, 11, 0.85); /* Slightly more opaque for readability */
    backdrop-filter: blur(10px);
}
.nav-title {
    text-align: center; color: #E0D6C3; 
    font-weight: 600; font-size: 17px; letter-spacing: 1px;
}

.scroll-content { height: 100vh; }

/* Banner */
.hero-banner { 
    position: relative; width: 100%; 
    height: 320px; /* Increased height slightly */
    margin-top: -80px; 
}
.banner-img { width: 100%; height: 100%; opacity: 0.8; }
.banner-text {
    position: absolute; bottom: 60px; left: 24px; display: flex; flex-direction: column; z-index: 2;
}
.slogan-main { 
    font-size: 28px; color: #FFD700; 
    font-weight: bold; letter-spacing: 4px; text-shadow: 0 2px 10px rgba(0,0,0,0.8);
}
.slogan-sub { font-size: 14px; color: rgba(255,255,255,0.8); letter-spacing: 2px; margin-top: 8px; }

.banner-fade {
    position: absolute; bottom: 0; left: 0; width: 100%; height: 120px;
    /* Improved gradient: Ends in solid dark to cover bottom of image */
    background: linear-gradient(to top, #1A120B 20%, transparent);
    z-index: 1;
}

/* FIX: Sticky Tabs */
.sticky-tabs {
    display: flex; gap: 30px; padding: 10px 24px;
    
    /* Critical Fix for Sticky */
    position: sticky; 
    /* 'top' is set dynamically in template */
    z-index: 90;
    
    background: #1A120B; /* Solid background to hide content scrolling behind */
    box-shadow: 0 4px 10px rgba(0,0,0,0.2); /* Shadow for separation */
    
    /* FIX: Negative margin to pull it UP into the banner area */
    margin-top: -20px; 
    border-radius: 20px 20px 0 0; /* Rounded top corners like a sheet */
}

.tab-item {
    position: relative; padding: 6px 4px; display: flex; align-items: center; justify-content: center;
}
.tab-text {
    font-size: 15px; color: #888; z-index: 2; transition: all 0.3s;
}
.tab-item.active .tab-text {
    color: #E0D6C3; font-weight: bold; font-size: 17px; 
}
.tab-brush {
    position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 60px; height: 20px; z-index: 1; opacity: 0.8;
}

/* Grid */
.product-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 20px 20px;
    background: #1A120B; /* Ensure solid background */
}
.product-card {
    background: #2C241E; 
    border: 1px solid rgba(255, 255, 255, 0.05); 
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.card-img-box { 
    width: 100%; height: 170px; display: flex; align-items: center; justify-content: center; 
    background: #231B16; 
}
.prod-img { width: 60%; height: 60%; opacity: 0.8; }

.card-info { padding: 12px; }
.prod-title { font-size: 14px; color: #E0D6C3; font-weight: 600; margin-bottom: 6px; display: block;}
.prod-tags { display: flex; margin-bottom: 10px; }
.tag { 
    font-size: 10px; color: #FFD700; border: 1px solid rgba(255, 215, 0, 0.3); 
    padding: 2px 6px; border-radius: 4px; 
}
.prod-footer { display: flex; justify-content: space-between; align-items: center; }
.price { color: #FFD700; font-size: 18px; font-weight: bold; .symbol{ font-size: 12px; margin-right: 1px;} }

/* FIX: Vintage Filter for Button */
.btn-buy { 
    width: 36px; height: 36px; 
}
.vintage-filter {
    opacity: 0.85; /* Reduce brightness */
    filter: sepia(0.3) contrast(0.9); /* Add brownish tone */
    transform: scale(0.9); /* Slightly smaller */
}

/* Footer Spacer */
.footer-spacer {
    height: 140px; position: relative;
}
.footer-fade {
    position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to bottom, transparent 0%, #1A120B 100%);
}
</style>