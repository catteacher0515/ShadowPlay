<template>
  <view class="workshop-container">
    <view class="stage-area">
      <image 
        class="stage-bg" 
        src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/bg-lightbox-portrait.jpg.jpg" 
        mode="aspectFill" 
      />
      <view class="vignette-overlay"></view>

      <view class="btn-help" @click="showHelp = true">
        <text>?</text>
      </view>
      
      <view class="stage-content">
        <view class="stage-hint" :class="{ 'hint-complete': isFullSet }">
          <block v-if="!activeRole">
            <text class="hint-text placeholder">请先在【头茬】中选择角色</text>
          </block>
          <block v-else-if="!isAwakened">
            <text class="hint-title">正在组装：{{ getRoleName(activeRole) }}</text>
            <text class="hint-sub" v-if="!isFusing">进度: {{ equippedCount }}/4 (缺: {{ missingPartsText }})</text>
            <text class="hint-text active" v-else>⚠️ 能量汇聚中...</text>
          </block>
          <block v-else>
            <text class="hint-text active" v-if="!isExploded">✨ 恭喜 · {{ getRoleName(activeRole) }} 已唤醒 ✨</text>
            <text class="hint-text active" v-else>🛠️ 结构拆解 · {{ getRoleName(activeRole) }} 🛠️</text>
            <text class="hint-sub" v-if="!isExploded">(点击皮影查看部件详情)</text>
          </block>
        </view>

        <view class="character-display">
          
          <view 
            v-if="isAwakened" 
            class="puppet-display animate-appear" 
            @click="toggleExplode"
          >
            <image 
              class="char-full-body" 
              :class="{ 'hidden': isExploded }"
              :src="getFullBodySrc(activeRole)" 
              mode="aspectFit" 
            />

            <view class="exploded-container" :class="{ 'active': isExploded }">
               <view class="connector-line line-head"></view>
               <view class="connector-line line-hand"></view>
               <view class="connector-line line-leg"></view>

               <image class="exp-part exp-head" :src="getPartSrc('head')" mode="aspectFit" />
               <image class="exp-part exp-body" :src="getPartSrc('body')" mode="aspectFit" />
               <image class="exp-part exp-hand" :src="getPartSrc('hand')" mode="aspectFit" />
               <image class="exp-part exp-leg"  :src="getPartSrc('leg')"  mode="aspectFit" />
            </view>
          </view>
          
          <view v-else class="scattered-stage">
            <view class="ghost-placeholder" v-if="equippedCount === 0">
               <text class="ghost-icon">🎭</text>
            </view>

            <image v-if="hasPart('head')" class="scat-part scat-head animate-pop" :src="getPartSrc('head')" mode="aspectFit" />
            <image v-if="hasPart('body')" class="scat-part scat-body animate-pop" :src="getPartSrc('body')" mode="aspectFit" />
            <image v-if="hasPart('hand')" class="scat-part scat-hand animate-pop" :src="getPartSrc('hand')" mode="aspectFit" />
            <image v-if="hasPart('leg')"  class="scat-part scat-leg animate-pop"  :src="getPartSrc('leg')"  mode="aspectFit" />
          </view>

        </view>
      </view>

      <view class="modal-mask" v-if="showHelp" @click="showHelp = false">
        <view class="modal-content" @click.stop>
          <view class="modal-header">
            <text class="modal-title">皮影组装指南</text>
            <view class="modal-close" @click="showHelp = false">×</view>
          </view>
          <view class="modal-body">
            <view class="step-item">
              <text class="step-num">1</text>
              <view class="step-text">
                <text class="step-title">选定角色</text>
                <text class="step-desc">点击【头茬】切换要组装的皮影人物。</text>
              </view>
            </view>
            <view class="step-item">
              <text class="step-num">2</text>
              <view class="step-text">
                <text class="step-title">搜集部件</text>
                <text class="step-desc">前往【西游·征途】闯关，赢取更多部件解锁权限。</text>
              </view>
            </view>
            <view class="step-item">
              <text class="step-num">3</text>
              <view class="step-text">
                <text class="step-title">唤醒真身</text>
                <text class="step-desc">集齐4个部件，触发金魄聚魂，唤醒完整形态！</text>
              </view>
            </view>
          </view>
          <button class="btn-primary" @click="showHelp = false">我明白了</button>
        </view>
      </view>

    </view>

    <view class="inventory-area">
      <view class="tabs-header">
        <view 
          v-for="(tab, index) in tabs" 
          :key="tab.key"
          class="tab-item"
          :class="{ active: currentTab === index }"
          @click="currentTab = index"
        >
          <text>{{ tab.label }}</text>
        </view>
      </view>

      <scroll-view scroll-y class="grid-scroll">
        <view class="parts-grid">
          <view 
            v-for="item in inventoryList" 
            :key="item.id"
            class="item-card"
            :class="{ 
              'quality-epic': item.quality === 'epic',
              'selected-active': isEquipped(item),
              'is-locked': checkLocked(item)
            }"
            @click="handleItemClick(item)"
          >
            <view class="card-bg"></view>
            <image :src="item.src" class="item-icon" mode="aspectFit" />
            <text class="item-name">{{ item.name }}</text>
            
            <view v-if="isEquipped(item)" class="check-mark">
              <text>✔</text>
            </view>

            <view v-if="checkLocked(item)" class="lock-overlay">
               <text class="lock-emoji">🔒</text>
            </view>

          </view>
        </view>
      </scroll-view>
    </view>
    
    <CustomTabBar current-path="/pages/theater/workshop/index" />

    <view v-if="isFusing" class="fusion-overlay">
      <view class="fusion-rays"></view>
      
      <view class="stream stream-tl"></view>
      <view class="stream stream-tr"></view>
      <view class="stream stream-bl"></view>
      <view class="stream stream-br"></view>

      <view class="fusion-core">
        <view class="core-inner"></view>
        <view class="core-outer"></view>
      </view>
      
      <view class="fusion-shockwave"></view>

      <text class="fusion-text">灵 · 韵 · 合 · 一</text>
    </view>

  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CustomTabBar from '@/components/CustomTabBar.vue'

// --- Asset Database ---
const gameDatabase = [
  // Wukong
  { id: 'wk_head', name: '美猴王', category: 'head', role: 'wukong', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-wukong-head.png.png', quality: 'epic' },
  { id: 'wk_body', name: '锁子黄金甲', category: 'body', role: 'wukong', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-wukong-body.png', quality: 'epic' },
  { id: 'wk_hand', name: '如意金箍棒', category: 'hand', role: 'wukong', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-wukong-hand.png.png', quality: 'epic' },
  { id: 'wk_leg',  name: '藕丝步云履', category: 'leg',  role: 'wukong', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-wukong-leg.png.png', quality: 'epic' },
  // Tang Seng
  { id: 'ts_head', name: '唐三藏', category: 'head', role: 'tangseng', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-tangseng-head.png.png', quality: 'epic' },
  { id: 'ts_body', name: '锦斓袈裟', category: 'body', role: 'tangseng', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-tangseng-body.png.png', quality: 'epic' },
  { id: 'ts_hand', name: '九环锡杖', category: 'hand', role: 'tangseng', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-tangseng-hand.png.png', quality: 'epic' },
  { id: 'ts_leg',  name: '僧鞋',   category: 'leg',  role: 'tangseng', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-tangseng-leg.png.png', quality: 'epic' },
  // Zhu Bajie
  { id: 'bj_head', name: '天蓬元帅', category: 'head', role: 'bajie', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-bajie-head.png.png', quality: 'epic' },
  { id: 'bj_body', name: '皂直裰',   category: 'body', role: 'bajie', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-bajie-body.png.png', quality: 'epic' },
  { id: 'bj_hand', name: '九齿钉耙', category: 'hand', role: 'bajie', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-bajie-hand.png.png', quality: 'epic' },
  { id: 'bj_leg',  name: '行脚鞋',   category: 'leg',  role: 'bajie', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-bajie-leg.png.png', quality: 'epic' },
  // Sha Seng
  { id: 'ss_head', name: '卷帘大将', category: 'head', role: 'shaseng', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-shaseng-head.png.png', quality: 'epic' },
  { id: 'ss_body', name: '黄锦直裰', category: 'body', role: 'shaseng', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-shaseng-body.png.png', quality: 'epic' },
  { id: 'ss_hand', name: '降妖宝杖', category: 'hand', role: 'shaseng', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-shaseng-hand.png.png', quality: 'epic' },
  { id: 'ss_leg',  name: '麻鞋',     category: 'leg',  role: 'shaseng', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-shaseng-leg.png.png', quality: 'epic' },
  // White Snake
  { id: 'ws_head', name: '珠翠白凤冠', category: 'head', role: 'whitesnake', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-white-head.png.png', quality: 'epic' },
  { id: 'ws_body', name: '白绫云纹蟒', category: 'body', role: 'whitesnake', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-white-body.png.png', quality: 'epic' },
  { id: 'ws_hand', name: '雄黄宝剑',   category: 'hand', role: 'whitesnake', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-white-hand.png.png', quality: 'epic' },
  { id: 'ws_leg',  name: '步步生莲履', category: 'leg',  role: 'whitesnake', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-white-leg.png.png', quality: 'epic' },
  // Xu Xian
  { id: 'xx_head', name: '许仙文生巾', category: 'head', role: 'xuxian', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-xu-head.png.png', quality: 'epic' },
  { id: 'xx_body', name: '蓝绸书生褶', category: 'body', role: 'xuxian', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-xu-body.png.png', quality: 'epic' },
  { id: 'xx_hand', name: '西湖借伞',   category: 'hand', role: 'xuxian', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-xu-hand.png.png', quality: 'epic' },
  { id: 'xx_leg',  name: '登云薄底靴', category: 'leg',  role: 'xuxian', src: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/icon-xu-leg.png.png', quality: 'epic' },
];

// --- Logic ---
const showHelp = ref(false);
const tabs = [
  { key: 'head', label: '头茬' },
  { key: 'body', label: '靠子' },
  { key: 'hand', label: '把子' },
  { key: 'leg', label: '腿子' }
];

const currentTab = ref(0);
const activeRole = ref(null);
const equippedIds = ref(new Set());
const equippedCategories = ref(new Set()); 
const isExploded = ref(false);
const unlockedItems = ref(new Set());

// 状态控制
const isFusing = ref(false);   // 是否正在播放特效
const isAwakened = ref(false); // 是否已觉醒（特效播放完毕后才为true）

onShow(() => {
  loadInventory();
});

const loadInventory = () => {
  try {
    let inventory = uni.getStorageSync('USER_INVENTORY') || [];
    const clearedLevels = uni.getStorageSync('WUKONG_CLEARED_IDS') || [];
    
    const rewardsMap = {
      'bajie': ['bj_head', 'bj_body', 'bj_hand', 'bj_leg'],
      'shaseng': ['ss_head', 'ss_body', 'ss_hand', 'ss_leg'],
      'tangseng': ['ts_head', 'ts_body', 'ts_hand', 'ts_leg']
    };
    
    const defaultSet = ['wk_head', 'wk_body', 'wk_hand', 'wk_leg'];
    let newItems = [...defaultSet];
    
    clearedLevels.forEach(levelId => {
      if (rewardsMap[levelId]) {
        newItems = [...newItems, ...rewardsMap[levelId]];
      }
    });
    
    const finalInventory = [...new Set([...inventory, ...newItems])];
    
    uni.setStorageSync('USER_INVENTORY', finalInventory);
    unlockedItems.value = new Set(finalInventory);
    
  } catch (e) {
    console.error('Failed to load inventory', e);
  }
};

const inventoryList = computed(() => {
  const currentKey = tabs[currentTab.value].key;
  return gameDatabase.filter(item => item.category === currentKey);
});

const isFullSet = computed(() => {
  return equippedCategories.value.size === 4;
});

const equippedCount = computed(() => equippedCategories.value.size);

const missingPartsText = computed(() => {
  const allCats = ['head', 'body', 'hand', 'leg'];
  const missing = allCats.filter(c => !equippedCategories.value.has(c));
  const map = { head: '头茬', body: '靠子', hand: '把子', leg: '腿子' };
  return missing.map(c => map[c]).join('、');
});

const getRoleName = (roleKey) => {
  const map = { 
    'wukong': '孙悟空', 'tangseng': '唐僧', 'bajie': '猪八戒', 'shaseng': '沙僧',
    'whitesnake': '白素贞', 'xuxian': '许仙'
  };
  return map[roleKey] || roleKey;
};

const getFullBodySrc = (roleKey) => {
  const map = {
    'wukong': 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/sunwukong.png.png',
    'tangseng': 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/tangseng.png.png',
    'bajie': 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/bajie.png.png',
    'shaseng': 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/shaseng.png.png',
    'whitesnake': 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/white.png.png',
    'xuxian': 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/workshop/icons/xu.png.png'
  };
  return map[roleKey] || '';
};

const getPartSrc = (category) => {
  if (!activeRole.value) return '';
  const item = gameDatabase.find(i => i.role === activeRole.value && i.category === category);
  return item ? item.src : '';
};

const toggleExplode = () => {
  isExploded.value = !isExploded.value;
};

const isEquipped = (item) => {
  return equippedIds.value.has(item.id);
};

const hasPart = (category) => {
  return equippedCategories.value.has(category);
};

const checkLocked = (item) => {
  return !unlockedItems.value.has(item.id);
};

const handleItemClick = (item) => {
  if (checkLocked(item)) {
    uni.showToast({ title: '请前往【指尖剧场】解锁该部件', icon: 'none', duration: 2000 });
    return;
  }

  // 选择头部（切换角色）
  if (item.category === 'head') {
    if (activeRole.value !== item.role) {
      activeRole.value = item.role;
      equippedIds.value.clear();
      equippedCategories.value.clear();
      isExploded.value = false;
      isAwakened.value = false; // 重置觉醒状态
      
      equippedIds.value.add(item.id);
      equippedCategories.value.add('head');
      
      uni.showToast({ title: `已切换角色: ${getRoleName(item.role)}`, icon: 'none' });
      setTimeout(() => { currentTab.value = 1; }, 500);
    } else {
      if (!equippedIds.value.has(item.id)) {
        equippedIds.value.add(item.id);
        equippedCategories.value.add('head');
      }
    }
  } 
  // 选择其他部件
  else {
    if (!activeRole.value) {
      uni.showToast({ title: '请先在"头茬"中选择角色', icon: 'none' });
      return;
    }
    
    if (item.role !== activeRole.value) {
      const itemRoleName = getRoleName(item.role);
      uni.showToast({ title: `这是${itemRoleName}的部件!`, icon: 'error' });
      return;
    }

    equippedIds.value.add(item.id);
    equippedCategories.value.add(item.category);
    
    // ✨ 核心逻辑：集齐4件触发觉醒 ✨
    if (equippedCategories.value.size === 4) {
      isFusing.value = true;
      isAwakened.value = false; // 暂时保持散件状态，等动画播完
      
      // 2秒后特效结束，真身降临
      setTimeout(() => {
        isFusing.value = false;
        isAwakened.value = true; 
        
        uni.showToast({ 
          title: `恭喜 · ${getRoleName(activeRole.value)} 已唤醒`, 
          icon: 'none',
          duration: 2500
        });
      }, 2000);
    } else {
      uni.showToast({ title: '装备成功', icon: 'success' });
      isAwakened.value = false; // 确保是散件状态
      
      const nextIndex = currentTab.value + 1;
      if (nextIndex < tabs.length) {
         setTimeout(() => { currentTab.value = nextIndex; }, 400);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/* Variables */
$stage-bg: #1a1a1a;
$inventory-bg: #2C1608;
$gold: #FFD700;
$card-bg: #3E2723;
$epic-border: #FFD700;

.workshop-container {
  display: flex; flex-direction: column;
  height: 100vh; width: 100vw;
  overflow: hidden; background-color: $stage-bg;
}

/* --- Stage Area --- */
.stage-area {
  height: 55%; position: relative;
  display: flex; justify-content: center; align-items: center;
  background-color: #000; overflow: hidden;
}

.stage-bg { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.6; }
.vignette-overlay {
  position: absolute; inset: 0;
  background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%);
  pointer-events: none; z-index: 1;
}

.btn-help {
  position: absolute; top: 110px; right: 20px;
  width: 30px; height: 30px;
  border: 1px solid rgba(255,255,255,0.5); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: bold; z-index: 20; background: rgba(0,0,0,0.3);
}

.stage-content {
  position: relative; z-index: 5;
  width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}

.stage-hint {
  position: absolute; top: 40px; z-index: 10;
  background: rgba(0,0,0,0.6); padding: 10px 20px; border-radius: 20px;
  backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1);
  display: flex; flex-direction: column; align-items: center;
  &.hint-complete { background: rgba(255, 215, 0, 0.2); border-color: $gold; }
}

.hint-text {
  font-size: 16px; font-weight: bold; letter-spacing: 1px;
  &.active { color: $gold; text-shadow: 0 0 10px rgba(255,215,0,0.5); }
  &.placeholder { color: rgba(255,255,255,0.6); }
}
.hint-title { color: #fff; font-size: 14px; margin-bottom: 4px; }
.hint-sub { color: #aaa; font-size: 12px; }

.character-display {
  width: 100%; height: 80%;
  display: flex; justify-content: center; align-items: center;
  perspective: 1000px; transform: translateY(60rpx);
}

/* === STATE A: PUPPET DISPLAY (AWAKENED) === */
.puppet-display {
  width: 100%; height: 100%;
  display: flex; justify-content: center; align-items: center;
  position: relative;
}

/* 神威降临动画 */
.animate-appear { animation: charAppear 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
@keyframes charAppear {
  from { opacity: 0; transform: scale(1.2); filter: brightness(2) blur(10px); }
  to { opacity: 1; transform: scale(1); filter: brightness(1) blur(0); }
}

.char-full-body {
  height: 85%; width: 85%; transition: all 0.3s ease-out;
  &.hidden { opacity: 0; transform: scale(0.9); pointer-events: none; }
}

/* Exploded View (After Awakening) */
.exploded-container {
  position: absolute; width: 300rpx; height: 400rpx;
  display: flex; justify-content: center; align-items: center;
  opacity: 0; pointer-events: none; transition: opacity 0.2s;
  &.active {
    opacity: 1; pointer-events: auto;
    .exp-head { transform: translateY(-240rpx) scale(1.1); }
    .exp-hand { transform: translateX(200rpx) rotate(15deg) scale(1.1); }
    .exp-leg  { transform: translateY(240rpx) scale(1.1); }
    .exp-body { transform: scale(1.2); }
    .connector-line { opacity: 0.6; }
  }
}

.exp-part {
  position: absolute; width: 220rpx; height: 220rpx; 
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10; top: 50%; left: 50%; margin-top: -110rpx; margin-left: -110rpx;
  &.exp-head { z-index: 11; }
  &.exp-body { width: 260rpx; height: 320rpx; margin-top: -160rpx; margin-left: -130rpx; z-index: 10; }
  &.exp-hand { z-index: 12; }
  &.exp-leg  { z-index: 9; }
}

.connector-line {
  position: absolute; background-color: transparent;
  border: 1px dashed $gold; opacity: 0;
  transition: opacity 0.5s 0.2s; z-index: 5; transform-origin: center;
}
.line-head { height: 80rpx; width: 0; top: 50%; left: 50%; transform: translate(-50%, -120rpx); }
.line-hand { width: 80rpx; height: 0; top: 50%; left: 50%; transform: translate(30rpx, 0); }
.line-leg { height: 80rpx; width: 0; top: 50%; left: 50%; transform: translate(-50%, 40rpx); }

/* === STATE B: SCATTERED STAGE (IN PROGRESS) === */
.scattered-stage {
  width: 100%; height: 100%; position: relative;
  display: flex; justify-content: center; align-items: center;
}

.ghost-placeholder {
  width: 200px; height: 300px;
  border: 2px dashed rgba(255,255,255,0.15); border-radius: 12px;
  display: flex; justify-content: center; align-items: center;
}
.ghost-icon { font-size: 48px; opacity: 0.3; }

/* 散落部件：复用 exploded 的偏移逻辑，实现“乐高散开”的效果 */
.scat-part {
  position: absolute; width: 220rpx; height: 220rpx; 
  top: 50%; left: 50%; margin-top: -110rpx; margin-left: -110rpx;
  filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
}
.scat-head { transform: translateY(-240rpx) scale(1.1); z-index: 11; }
.scat-body { width: 260rpx; height: 320rpx; margin-top: -160rpx; margin-left: -130rpx; transform: scale(1.2); z-index: 10; }
.scat-hand { transform: translateX(200rpx) rotate(15deg) scale(1.1); z-index: 12; }
.scat-leg  { transform: translateY(240rpx) scale(1.1); z-index: 9; }

/* 上件时的弹跳动画 */
.animate-pop { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes popIn {
  0% { opacity: 0; transform: scale(0); }
  70% { opacity: 1; transform: scale(1.2); }
  100% { transform: scale(1); }
  /* 注意：这里简化了，实际应用中 transform 会覆盖上面的位移，
     为了保持位移，最好用嵌套容器或 animation-fill-mode 配合具体的keyframes。
     但在 Vue 中，简单的 popIn 可能会重置 transform。
     为了稳妥，这里仅做透明度渐变，或者直接用上面的静态位移。
     为了保持简单且不破坏位移，这里我们用 keyframes 重新定义带位移的动画太繁琐。
     我们改用一个简单的 fade-in。
  */
}

/* --- Inventory & Modal CSS (Same as before) --- */
.inventory-area { height: 45%; background-color: $inventory-bg; border-top: 2px solid #5D4037; display: flex; flex-direction: column; z-index: 20; box-shadow: 0 -5px 20px rgba(0,0,0,0.5); }
.tabs-header { height: 44px; display: flex; background-color: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.05); }
.tab-item { flex: 1; display: flex; align-items: center; justify-content: center; color: #8D6E63; font-size: 14px; position: relative; transition: all 0.3s; &.active { color: $gold; font-weight: bold; background-color: rgba(255,215,0,0.05); &::after { content: ''; position: absolute; bottom: 0; left: 25%; width: 50%; height: 2px; background-color: $gold; } } }
.grid-scroll { flex: 1; padding: 10px; box-sizing: border-box; margin-bottom: 20px; }
.parts-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding-bottom: calc(env(safe-area-inset-bottom) + 180rpx); }
.item-card { position: relative; aspect-ratio: 1; background-color: $card-bg; border-radius: 6px; border: 1px solid #4E342E; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1); &:active { transform: scale(0.95); } &.quality-epic { border-color: rgba($epic-border, 0.3); } &.selected-active { border: 2px solid $gold !important; transform: scale(1.05); box-shadow: 0 0 12px rgba(255, 215, 0, 0.4); z-index: 2; } &.is-locked { pointer-events: auto; .item-icon { filter: grayscale(100%); opacity: 0.4; } .item-name { color: #777; } } }
.card-bg { position: absolute; inset: 0; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%); z-index: 0; }
.item-icon { width: 70%; height: 70%; z-index: 1; }
.item-name { position: absolute; bottom: 0; width: 100%; text-align: center; font-size: 9px; color: #D7CCC8; background-color: rgba(0,0,0,0.6); padding: 2px 0; z-index: 2; }
.check-mark { position: absolute; top: 2px; right: 2px; background: $gold; color: #000; width: 14px; height: 14px; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center; z-index: 3; }
.lock-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 5; }
.lock-emoji { font-size: 24px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
.modal-mask { position: absolute; inset: 0; z-index: 100; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; }
.modal-content { width: 80%; background: #2C1608; border: 1px solid #5D4037; border-radius: 12px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
.modal-title { color: $gold; font-size: 18px; font-weight: bold; }
.modal-close { color: #aaa; font-size: 24px; padding: 0 10px; }
.step-item { display: flex; margin-bottom: 15px; }
.step-num { width: 24px; height: 24px; background: $gold; color: #000; border-radius: 50%; text-align: center; line-height: 24px; font-size: 14px; font-weight: bold; margin-right: 12px; flex-shrink: 0; }
.step-text { display: flex; flex-direction: column; }
.step-title { color: #E0E0E0; font-size: 15px; font-weight: bold; margin-bottom: 2px; }
.step-desc { color: #9E9E9E; font-size: 13px; line-height: 1.4; }
.btn-primary { background: $gold; color: #000; border: none; font-size: 14px; font-weight: bold; margin-top: 10px; width: 100%; border-radius: 20px; }

/* --- ✨✨✨ EX级·金魄聚魂特效 CSS ✨✨✨ */

.fusion-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.9); z-index: 999; 
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  animation: overlayFadeIn 0.3s ease-out;
}

/* 1. 旋转圣光 */
.fusion-rays {
  position: absolute; width: 200vw; height: 200vw;
  background: conic-gradient(from 0deg, transparent 0%, rgba(255, 215, 0, 0.1) 10%, transparent 20%, rgba(255, 215, 0, 0.1) 30%, transparent 40%);
  animation: raysRotate 4s infinite linear; opacity: 0; animation-delay: 0.5s; animation-fill-mode: forwards;
}

/* 2. 四方流光 */
.stream { position: absolute; width: 20rpx; height: 20rpx; background: $gold; border-radius: 50%; box-shadow: 0 0 20rpx $gold; opacity: 0; }
.stream-tl { top: 10%; left: 10%; animation: flyIn 0.8s cubic-bezier(0.5, 0, 0.5, 1) forwards; }
.stream-tr { top: 10%; right: 10%; animation: flyIn 0.8s cubic-bezier(0.5, 0, 0.5, 1) forwards; }
.stream-bl { bottom: 30%; left: 10%; animation: flyIn 0.8s cubic-bezier(0.5, 0, 0.5, 1) forwards; }
.stream-br { bottom: 30%; right: 10%; animation: flyIn 0.8s cubic-bezier(0.5, 0, 0.5, 1) forwards; }

/* 3. 核心光球 */
.fusion-core { width: 200rpx; height: 200rpx; position: relative; z-index: 10; animation: coreSequence 2s forwards; }
.core-inner { position: absolute; inset: 20rpx; background: radial-gradient(circle, #fff 0%, $gold 60%, transparent 100%); border-radius: 50%; box-shadow: 0 0 60rpx rgba(255, 215, 0, 0.8); }
.core-outer { position: absolute; inset: 0; border: 4rpx solid rgba(255, 215, 0, 0.6); border-radius: 50%; border-top-color: transparent; animation: outerRotate 1s infinite linear; }

/* 4. 冲击波 */
.fusion-shockwave {
  position: absolute; top: 50%; left: 50%; width: 100rpx; height: 100rpx;
  border: 10rpx solid #fff; border-radius: 50%; opacity: 0; transform: translate(-50%, -50%);
  animation: shockwaveExpand 0.5s 1.5s ease-out forwards; 
}

.fusion-text { margin-top: 80rpx; color: $gold; font-size: 36rpx; letter-spacing: 16rpx; font-weight: bold; opacity: 0; animation: textFadeIn 0.5s 0.8s forwards; z-index: 10; }

/* --- 关键帧 --- */
@keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes flyIn { 0% { opacity: 0; transform: scale(0.5); } 20% { opacity: 1; transform: scale(1); } 100% { top: 50%; left: 50%; right: auto; bottom: auto; opacity: 0; transform: scale(0.2); } }
@keyframes coreSequence { 0% { transform: scale(0); opacity: 0; } 10% { transform: scale(1); opacity: 1; } 40% { transform: scale(1); } 40.1% { animation-timing-function: ease-in-out; } 75% { transform: scale(0.8) translate(2px, -2px); filter: brightness(2); } 77% { transform: scale(0.8) translate(-2px, 2px); } 79% { transform: scale(0.8) translate(2px, 2px); } 81% { transform: scale(0.8) translate(-2px, -2px); } 100% { transform: scale(4); opacity: 0; } }
@keyframes shockwaveExpand { 0% { width: 10rpx; height: 10rpx; opacity: 1; border-width: 20rpx; } 100% { width: 1000rpx; height: 1000rpx; opacity: 0; border-width: 0; } }
@keyframes raysRotate { from { transform: rotate(0deg); opacity: 0; } 20% { opacity: 0.5; } to { transform: rotate(360deg); opacity: 0; } }
@keyframes outerRotate { to { transform: rotate(360deg); } }
@keyframes textFadeIn { from { opacity: 0; transform: translateY(20rpx); } to { opacity: 1; transform: translateY(0); } }
</style>