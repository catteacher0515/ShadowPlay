<template>
  <view class="market-container">
    <view class="bg-dark"></view>

    <view class="custom-navbar" :style="{ paddingTop: safeAreaTop + 'px', height: navHeight + 'px' }">
      <view class="nav-title" :style="{ lineHeight: navHeight + 'px' }">文创集市</view>
    </view>

    <scroll-view scroll-y class="scroll-content">
      
      <view class="hero-banner" :style="{ marginTop: (safeAreaTop + navHeight) + 'px' }">
        <image 
           class="banner-img" 
           src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/market/banner-market-bridge.jpg" 
           mode="widthFix" 
        />
        
        <view class="banner-fade"></view>

        <view class="banner-content">
            <text class="slogan-main">拾影 · 文创</text>
            <text class="slogan-sub">让非遗回归生活</text>
        </view>
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
                src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/market/ui-tab-active.png" 
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
                        src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/market/btn-buy-seal.png" 
                        @click.stop="handleBuy(item)" 
                    />
                </view>
            </view>
        </view>
      </view>

      <view class="footer-spacer"></view>

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
const tabs = ['全部'];

// ✨ 真实商品数据 (文件名精准匹配) ✨
const products = ref([
    { 
        name: '皮影·拼图', 
        price: '29.9', 
        tag: '特惠', 
        // 礼盒暂用 Banner 图
        img: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/market/shadow-puppet-puzzle.png.png' 
    },
    { 
        name: '杨戬·原色帆布袋', 
        price: '19.9', 
        tag: '实用', 
        // 依据截图：哈希文件名，后缀为 .png
        img: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/market/1885aeb164b2741dedb7a7ea0d692578.png' 
    },
        { 
        name: '唐三藏·透光立牌', 
        price: '9.9', 
        tag: '精致', 
        img: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/market/acrylic-stand-tang-sanzang-product.png.png' 
    },
        { 
        name: '猪八戒·透光立牌', 
        price: '9.9', 
        tag: '新品', 
        img: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/market/acrylic-stand-zhu-bajie-product.png.png' 
    },
    { 
        name: '孙悟空·透光立牌', 
        price: '9.9', 
        tag: '热销', 
        // 依据截图：双后缀 .png.png
        img: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/market/acrylic-stand-sun-wukong-product.png.png' 
    },

    { 
        name: '沙悟净·透光立牌', 
        price: '9.9', 
        tag: '收藏', 
        img: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/market/acrylic-stand-sha-wujing-product.png.png' 
    },
]);

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
    background: #1A120B; 
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.nav-title {
    text-align: center; color: #E0D6C3;
    font-weight: 600; font-size: 17px; letter-spacing: 1px;
}

.scroll-content { height: 100vh; }

/* Banner 区域 */
.hero-banner {
    position: relative; 
    width: 100%;
    height: auto; /* 由图片撑开 */
    display: block;
}

.banner-img { 
    width: 100%; 
    height: auto; 
    display: block; 
    opacity: 0.9; 
    /* mode="widthFix" 已在 template 中设置 */
}

/* 渐变层 */
.banner-fade {
    position: absolute; bottom: 0; left: 0; width: 100%; 
    height: 100px; 
    background: linear-gradient(to top, #1A120B 20%, transparent);
    z-index: 1;
}

/* 文字内容 */
.banner-content {
    position: absolute; 
    bottom: 20px; 
    left: 24px;
    z-index: 2;
    display: flex; flex-direction: column;
}

.slogan-main {
    font-size: 28px; 
    color: #FFD700;
    font-weight: bold; letter-spacing: 4px; text-shadow: 0 4px 12px rgba(0,0,0,0.9);
}
.slogan-sub { 
    font-size: 13px; color: rgba(255,255,255,0.9); letter-spacing: 6px; margin-top: 4px; 
    text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}

/* Sticky Tabs */
.sticky-tabs {
    display: flex; gap: 30px; padding: 12px 24px;
    position: sticky; 
    z-index: 90;
    background: #1A120B; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    margin-top: 0; 
    border-radius: 0; 
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
    padding: 20px 20px 100px;
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
.prod-img { width: 85%; height: 85%; opacity: 0.9; }

.card-info { padding: 12px; }
.prod-title { font-size: 14px; color: #E0D6C3; font-weight: 600; margin-bottom: 8px; display: block;}
.prod-tags { display: flex; margin-bottom: 12px; }
.tag {
    font-size: 10px; color: #FFD700; border: 1px solid rgba(255, 215, 0, 0.4);
    padding: 2px 6px; border-radius: 4px; background: rgba(255, 215, 0, 0.05);
}
.prod-footer { display: flex; justify-content: space-between; align-items: center; }
.price { color: #FFD700; font-size: 18px; font-weight: bold; .symbol{ font-size: 12px; margin-right: 1px;} }

.btn-buy { width: 38px; height: 38px; }
.vintage-fusion {
    opacity: 0.9;
    filter: brightness(0.9) contrast(1.1) sepia(0.2);
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.15);
    border-radius: 50%;
    transform: scale(0.92);
}

.footer-spacer { height: 140px; }
</style>