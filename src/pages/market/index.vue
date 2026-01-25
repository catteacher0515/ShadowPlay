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
                        class="btn-buy vintage-fusion" 
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

// 修复点 3：优化弹窗响应与文案换行
const handleBuy = (item) => { 
    uni.showModal({ 
        title: '感谢雅赏', 
        content: '感谢您对非遗文创的喜爱！\r\n此为【挑战杯】参赛演示项目，暂未接入支付系统。\r\n\r\n您的每一次点击，都是对皮影艺术最大的支持！', 
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
    background: rgba(26, 18, 11, 0.95); 
    backdrop-filter: blur(10px); 
} 
.nav-title { 
    text-align: center; color: #E0D6C3; 
    font-weight: 600; font-size: 17px; letter-spacing: 1px; 
} 

.scroll-content { height: 100vh; } 

/* 修复点 1：Banner 布局优化 */ 
.hero-banner { 
    position: relative; width: 100%; 
    height: 340px; /* 增加高度展示运营图 */ 
    margin-top: -40px; 
} 
.banner-img { width: 100%; height: 100%; opacity: 0.9; } 
.banner-text { 
    position: absolute; 
    bottom: 100px; /* 向上提，留出衔接空间 */ 
    left: 24px; 
    display: flex; flex-direction: column; z-index: 2; 
} 
.slogan-main { 
    font-size: 30px; color: #FFD700; 
    font-weight: bold; letter-spacing: 4px; text-shadow: 0 2px 12px rgba(0,0,0,0.9); 
} 
.slogan-sub { font-size: 14px; color: rgba(255,255,255,0.85); letter-spacing: 2px; margin-top: 10px; } 

.banner-fade { 
    position: absolute; bottom: 0; left: 0; width: 100%; height: 140px; 
    background: linear-gradient(to top, #1A120B 30%, transparent); 
    z-index: 1; 
} 

/* 修复点 4：Sticky Tabs 体验增强 */ 
.sticky-tabs { 
    display: flex; gap: 30px; padding: 12px 24px; 
    position: sticky; 
    z-index: 90; 
    background: #1A120B; /* 必须有实色背景遮挡下方滚动内容 */ 
    box-shadow: 0 4px 12px rgba(0,0,0,0.4); 
    
    /* 核心：负边距上移，盖在 Banner 底部 */
    margin-top: -30px; 
    border-radius: 24px 24px 0 0; 
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
    display: grid; grid-template-columns: 1fr 1fr; gap: 15px; 
    padding: 20px 20px 100px; /* 增加底部 padding 防止被 TabBar 遮挡 */
    background: #1A120B; 
} 
.product-card { 
    background: #2C241E; 
    border: 1px solid rgba(255, 255, 255, 0.08); 
    border-radius: 12px; overflow: hidden; 
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4); 
} 
.card-img-box { 
    width: 100%; height: 170px; display: flex; align-items: center; justify-content: center; 
    background: #231B16; 
} 
.prod-img { width: 65%; height: 65%; opacity: 0.9; } 

.card-info { padding: 12px; } 
.prod-title { font-size: 14px; color: #E0D6C3; font-weight: 600; margin-bottom: 8px; display: block;} 
.prod-tags { display: flex; margin-bottom: 12px; } 
.tag { 
    font-size: 10px; color: #FFD700; border: 1px solid rgba(255, 215, 0, 0.4); 
    padding: 2px 6px; border-radius: 4px; background: rgba(255, 215, 0, 0.05);
} 
.prod-footer { display: flex; justify-content: space-between; align-items: center; } 
.price { color: #FFD700; font-size: 18px; font-weight: bold; .symbol{ font-size: 12px; margin-right: 1px;} } 

/* 修复点 2：印章视觉融合增强 */ 
.btn-buy { 
    width: 38px; height: 38px; 
} 
.vintage-fusion { 
    opacity: 0.9; 
    filter: brightness(0.9) contrast(1.1) sepia(0.2); 
    /* 增加金边质感，使其更像工艺品 */
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.15);
    border-radius: 50%;
    transform: scale(0.92); 
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