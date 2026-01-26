<template>
  <view class="workshop-container">
    <!-- Top Area: Stage (65%) -->
    <view class="stage-area">
      <!-- Background -->
      <image 
        class="stage-bg" 
        src="/static/images/workshop/bg-lightbox-portrait.jpg.jpg" 
        mode="aspectFill" 
      />
      
      <view class="vignette-overlay"></view>

      <!-- Help Button -->
      <view class="btn-help" @click="showHelp = true">
        <text>?</text>
      </view>
      
      <!-- Stage Content -->
      <view class="stage-content">
        <!-- 1. Text Hint / Progress -->
        <view class="stage-hint" :class="{ 'hint-complete': isFullSet }">
          <block v-if="!activeRole">
            <text class="hint-text placeholder">请先在【头茬】中选择角色</text>
          </block>
          <block v-else-if="!isFullSet">
            <text class="hint-title">正在组装：{{ getRoleName(activeRole) }}</text>
            <text class="hint-sub">进度: {{ equippedCount }}/4 (缺: {{ missingPartsText }})</text>
          </block>
          <block v-else>
            <text class="hint-text active">✨ 恭喜 · {{ getRoleName(activeRole) }} 已唤醒 ✨</text>
          </block>
        </view>

        <!-- 2. Character / Ghost Display -->
        <view class="character-display">
          <!-- Awakened State: Full Body -->
          <!-- We use a computed src to dynamically load the full body image for the active role -->
          <image 
            v-if="isFullSet" 
            class="char-full-body animate-fade-in" 
            :src="getFullBodySrc(activeRole)" 
            mode="aspectFit" 
          />
          
          <!-- Assembling State: Ghost Guide + Equipped Icons -->
          <view v-else class="ghost-container">
            <!-- Ghost Outline (Fallback Icon since file might be missing) -->
            <view class="ghost-outline">
               <text class="ghost-icon">🎭</text>
            </view>
            
            <!-- Floating Parts (Visual Feedback of what's equipped) -->
            <view class="parts-indicators">
              <view class="indicator" :class="{ active: hasPart('head') }">头</view>
              <view class="indicator" :class="{ active: hasPart('body') }">靠</view>
              <view class="indicator" :class="{ active: hasPart('hand') }">把</view>
              <view class="indicator" :class="{ active: hasPart('leg') }">腿</view>
            </view>
          </view>
        </view>
      </view>

      <!-- Help Modal -->
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
                <text class="step-desc">寻找匹配的【靠子】【把子】【腿子】。</text>
              </view>
            </view>
            <view class="step-item">
              <text class="step-num">3</text>
              <view class="step-text">
                <text class="step-title">唤醒真身</text>
                <text class="step-desc">集齐4个部件，唤醒皮影的完整形态！</text>
              </view>
            </view>
          </view>
          <button class="btn-primary" @click="showHelp = false">我明白了</button>
        </view>
      </view>

    </view>

    <!-- Bottom Area: Inventory (35%) -->
    <view class="inventory-area">
      <!-- Tabs -->
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

      <!-- Grid Content -->
      <scroll-view scroll-y class="grid-scroll">
        <view class="parts-grid">
          <view 
            v-for="item in inventoryList" 
            :key="item.id"
            class="item-card"
            :class="{ 
              'quality-epic': item.quality === 'epic',
              'selected-active': isEquipped(item)
            }"
            @click="handleItemClick(item)"
          >
            <view class="card-bg"></view>
            <image :src="item.src" class="item-icon" mode="aspectFit" />
            <text class="item-name">{{ item.name }}</text>
            
            <!-- Selection Indicator -->
            <view v-if="isEquipped(item)" class="check-mark">
              <text>✔</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <CustomTabBar current-path="/pages/workshop/index" />
  </view>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'

// --- 1. Asset Database (Expanded for Journey to the West) ---
const gameDatabase = [
  // --- 1. Sun Wukong ---
  { id: 'wk_head', name: '美猴王', category: 'head', role: 'wukong', src: '/static/images/workshop/icons/icon-wukong-head.png.png', quality: 'epic' },
  { id: 'wk_body', name: '锁子黄金甲', category: 'body', role: 'wukong', src: '/static/images/workshop/icons/icon-wukong-body.png', quality: 'epic' },
  { id: 'wk_hand', name: '如意金箍棒', category: 'hand', role: 'wukong', src: '/static/images/workshop/icons/icon-wukong-hand.png.png', quality: 'epic' },
  { id: 'wk_leg',  name: '藕丝步云履', category: 'leg',  role: 'wukong', src: '/static/images/workshop/icons/icon-wukong-leg.png.png', quality: 'epic' },
  
  // --- 2. Tang Seng ---
  { id: 'ts_head', name: '唐三藏', category: 'head', role: 'tangseng', src: '/static/images/workshop/icons/icon-tangseng-head.png.png', quality: 'epic' },
  { id: 'ts_body', name: '锦斓袈裟', category: 'body', role: 'tangseng', src: '/static/images/workshop/icons/icon-tangseng-body.png.png', quality: 'epic' },
  { id: 'ts_hand', name: '九环锡杖', category: 'hand', role: 'tangseng', src: '/static/images/workshop/icons/icon-tangseng-hand.png.png', quality: 'epic' },
  { id: 'ts_leg',  name: '僧鞋',   category: 'leg',  role: 'tangseng', src: '/static/images/workshop/icons/icon-tangseng-leg.png.png', quality: 'epic' },

  // --- 3. Zhu Bajie ---
  { id: 'bj_head', name: '天蓬元帅', category: 'head', role: 'bajie', src: '/static/images/workshop/icons/icon-bajie-head.png.png', quality: 'epic' },
  { id: 'bj_body', name: '皂直裰',   category: 'body', role: 'bajie', src: '/static/images/workshop/icons/icon-bajie-body.png.png', quality: 'epic' },
  { id: 'bj_hand', name: '九齿钉耙', category: 'hand', role: 'bajie', src: '/static/images/workshop/icons/icon-bajie-hand.png.png', quality: 'epic' },
  { id: 'bj_leg',  name: '行脚鞋',   category: 'leg',  role: 'bajie', src: '/static/images/workshop/icons/icon-bajie-leg.png.png', quality: 'epic' },

  // --- 4. Sha Seng ---
  { id: 'ss_head', name: '卷帘大将', category: 'head', role: 'shaseng', src: '/static/images/workshop/icons/icon-shaseng-head.png.png', quality: 'epic' },
  { id: 'ss_body', name: '黄锦直裰', category: 'body', role: 'shaseng', src: '/static/images/workshop/icons/icon-shaseng-body.png.png', quality: 'epic' },
  { id: 'ss_hand', name: '降妖宝杖', category: 'hand', role: 'shaseng', src: '/static/images/workshop/icons/icon-shaseng-hand.png.png', quality: 'epic' },
  { id: 'ss_leg',  name: '麻鞋',     category: 'leg',  role: 'shaseng', src: '/static/images/workshop/icons/icon-shaseng-leg.png.png', quality: 'epic' },
];

// --- 2. State & Logic ---
const showHelp = ref(false);
const tabs = [
  { key: 'head', label: '头茬' },
  { key: 'body', label: '靠子' },
  { key: 'hand', label: '把子' },
  { key: 'leg', label: '腿子' }
];

const currentTab = ref(0); // 0=Head, 1=Body, 2=Hand, 3=Leg
const activeRole = ref(null); // 'wukong', 'tangseng', 'bajie', 'shaseng'
const equippedIds = ref(new Set());
const equippedCategories = ref(new Set()); // Tracks which slots are filled

// Show help on first mount
onMounted(() => {
  // showHelp.value = true;
});

// --- Computed ---
const inventoryList = computed(() => {
  const currentKey = tabs[currentTab.value].key;
  // Show ALL items for the selected category (Head/Body/etc)
  // This allows users to see all options and try to match them
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

// --- Actions ---
const getRoleName = (roleKey) => {
  const map = { 
    'wukong': '孙悟空',
    'tangseng': '唐僧',
    'bajie': '猪八戒',
    'shaseng': '沙僧'
  };
  return map[roleKey] || roleKey;
};

const getFullBodySrc = (roleKey) => {
  // Using the parent folder icons for full body as per request
  const map = {
    'wukong': '/static/images/workshop/icons/sunwukong.png.png',
    'tangseng': '/static/images/workshop/icons/tangseng.png.png',
    'bajie': '/static/images/workshop/icons/bajie.png.png',
    'shaseng': '/static/images/workshop/icons/shaseng.png.png'
  };
  return map[roleKey] || '';
};

const isEquipped = (item) => {
  return equippedIds.value.has(item.id);
};

const hasPart = (category) => {
  return equippedCategories.value.has(category);
};

const handleItemClick = (item) => {
  // Logic 1: Head Selection (Sets or Switches Role)
  if (item.category === 'head') {
    // If switching role, reset everything
    if (activeRole.value !== item.role) {
      activeRole.value = item.role;
      equippedIds.value.clear();
      equippedCategories.value.clear();
      
      // Equip the head
      equippedIds.value.add(item.id);
      equippedCategories.value.add('head');
      
      uni.showToast({ title: `已切换角色: ${getRoleName(item.role)}，请重新组装！`, icon: 'none' });
      
      // Auto-switch to next tab
      setTimeout(() => { currentTab.value = 1; }, 500);
    } else {
      // If same head, maybe just ensure it's equipped?
      if (!equippedIds.value.has(item.id)) {
        equippedIds.value.add(item.id);
        equippedCategories.value.add('head');
      }
    }
  } 
  // Logic 2: Body/Hand/Leg Selection (Must match active role)
  else {
    if (!activeRole.value) {
      uni.showToast({ title: '请先在"头茬"中选择角色', icon: 'none' });
      return;
    }
    
    if (item.role !== activeRole.value) {
      const itemRoleName = getRoleName(item.role);
      const currentRoleName = getRoleName(activeRole.value);
      uni.showToast({ title: `这是${itemRoleName}的部件，不是${currentRoleName}的！`, icon: 'error' });
      return;
    }

    // Add item
    equippedIds.value.add(item.id);
    equippedCategories.value.add(item.category);
    
    uni.showToast({ title: '装备成功', icon: 'success' });
    
    // Auto-switch logic (Guide user to next empty slot)
    const nextIndex = currentTab.value + 1;
    if (nextIndex < tabs.length && !isFullSet.value) {
       setTimeout(() => { currentTab.value = nextIndex; }, 400);
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
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: $stage-bg;
}

/* --- Stage Area --- */
.stage-area {
  height: 65%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  overflow: hidden;
}

.stage-bg {
  position: absolute; inset: 0; width: 100%; height: 100%;
  opacity: 0.6;
}

.vignette-overlay {
  position: absolute; inset: 0;
  background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%);
  pointer-events: none; z-index: 1;
}

.btn-help {
  position: absolute; top: 40px; right: 20px;
  width: 30px; height: 30px;
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: bold; z-index: 20;
  background: rgba(0,0,0,0.3);
}

.stage-content {
  position: relative; z-index: 5;
  width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}

.stage-hint {
  position: absolute; top: 40px;
  z-index: 10;
  background: rgba(0,0,0,0.6);
  padding: 10px 20px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex; flex-direction: column; align-items: center;
  
  &.hint-complete {
    background: rgba(255, 215, 0, 0.2);
    border-color: $gold;
  }
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
}

.char-full-body {
  height: 90%; width: 90%;
}

.ghost-container {
  display: flex; flex-direction: column; align-items: center;
}

.ghost-outline {
  width: 200px; height: 300px;
  border: 2px dashed rgba(255,255,255,0.15);
  border-radius: 12px;
  display: flex; justify-content: center; align-items: center;
  margin-bottom: 20px;
}

.ghost-icon { font-size: 48px; opacity: 0.3; }

.parts-indicators {
  display: flex; gap: 10px;
}
.indicator {
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: #666;
  
  &.active {
    background: $gold; color: #000; font-weight: bold;
    box-shadow: 0 0 8px rgba(255,215,0,0.5);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); filter: blur(10px); }
  to { opacity: 1; transform: scale(1); filter: blur(0); }
}

/* --- Modal --- */
.modal-mask {
  position: absolute; inset: 0; z-index: 100;
  background: rgba(0,0,0,0.8);
  display: flex; align-items: center; justify-content: center;
}
.modal-content {
  width: 80%; background: #2C1608;
  border: 1px solid #5D4037;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;
}
.modal-title { color: $gold; font-size: 18px; font-weight: bold; }
.modal-close { color: #aaa; font-size: 24px; padding: 0 10px; }

.step-item { display: flex; margin-bottom: 15px; }
.step-num { 
  width: 24px; height: 24px; background: $gold; color: #000; 
  border-radius: 50%; text-align: center; line-height: 24px; font-size: 14px; font-weight: bold;
  margin-right: 12px; flex-shrink: 0;
}
.step-text { display: flex; flex-direction: column; }
.step-title { color: #E0E0E0; font-size: 15px; font-weight: bold; margin-bottom: 2px; }
.step-desc { color: #9E9E9E; font-size: 13px; line-height: 1.4; }

.btn-primary {
  background: $gold; color: #000; border: none; font-size: 14px; font-weight: bold;
  margin-top: 10px; width: 100%; border-radius: 20px;
}

/* --- Inventory Area --- */
.inventory-area {
  height: 35%;
  background-color: $inventory-bg;
  border-top: 2px solid #5D4037;
  display: flex; flex-direction: column;
  z-index: 20;
  box-shadow: 0 -5px 20px rgba(0,0,0,0.5);
}

/* Tabs */
.tabs-header {
  height: 44px;
  display: flex;
  background-color: rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.tab-item {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  color: #8D6E63; font-size: 14px;
  position: relative;
  transition: all 0.3s;

  &.active {
    color: $gold; font-weight: bold; background-color: rgba(255,215,0,0.05);
    &::after {
      content: ''; position: absolute; bottom: 0; left: 25%; width: 50%; height: 2px; background-color: $gold;
    }
  }
}

/* Grid */
.grid-scroll {
  flex: 1;
  padding: 10px;
  box-sizing: border-box;
}

.parts-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding-bottom: 20px;
}

/* Item Card */
.item-card {
  position: relative;
  aspect-ratio: 1;
  background-color: $card-bg;
  border-radius: 6px;
  border: 1px solid #4E342E;
  overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:active { transform: scale(0.95); }

  /* Default Epic Style */
  &.quality-epic {
    border-color: rgba($epic-border, 0.3);
  }

  /* SELECTED STATE (Gold Border + Scale) */
  &.selected-active {
    border: 2px solid $gold !important;
    transform: scale(1.05);
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.4);
    z-index: 2; /* Pop above others */
  }
}

.card-bg {
  position: absolute; inset: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
  z-index: 0;
}

.item-icon {
  width: 70%; height: 70%; z-index: 1;
}

.item-name {
  position: absolute; bottom: 0; width: 100%;
  text-align: center; font-size: 9px; color: #D7CCC8;
  background-color: rgba(0,0,0,0.6);
  padding: 2px 0;
  z-index: 2;
}

.check-mark {
  position: absolute; top: 2px; right: 2px;
  background: $gold; color: #000;
  width: 14px; height: 14px;
  border-radius: 50%;
  font-size: 10px;
  display: flex; align-items: center; justify-content: center;
  z-index: 3;
}
</style>