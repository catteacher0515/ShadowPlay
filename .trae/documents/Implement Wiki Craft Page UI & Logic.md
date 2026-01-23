# Implement Wiki Craft Page (src/pages/wiki/craft.vue)

## 1. Page Registration
*   **File**: `pages.json`
*   **Action**: Ensure `pages/wiki/craft` is registered (already exists from previous `cat` output), but check if `"navigationStyle": "custom"` is needed for full-screen immersive design. The user requested "全屏沉浸式页面", so I should set `navigationStyle: custom`.

## 2. Page Implementation (`src/pages/wiki/craft.vue`)
*   **UI Structure**:
    *   **Container**: Full screen, black background.
    *   **Swiper**:
        *   `vertical`, `circular`.
        *   Height: 100vh.
    *   **Slide Item**:
        *   **Background**: Placeholder color block.
        *   **Overlay**: Gradient from bottom.
        *   **Content**: Step index ("第 N 道工序"), Name (Calligraphy font), Desc.
    *   **Audio Trigger**:
        *   Conditional render (`v-if="step.hasAudio"`).
        *   Centered button with pulse animation.
    *   **Sidebar Indicator**:
        *   Right-aligned vertical dots/lines.
        *   Active state highlight.
    *   **Back Button**: Custom absolute positioned back button since we use custom nav style.
*   **Logic**:
    *   **Data**: `steps` array (8 items).
    *   **State**: `currentStep`.
    *   **Audio**: `uni.createInnerAudioContext`.
    *   **Methods**:
        *   `onChange`: Update index, stop audio if leaving step 3.
        *   `playAudio`: Play sound, show toast.
        *   `goBack`: Navigate back.

