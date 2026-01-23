# Implement Loading Page (src/pages/loading/index.vue)

## 1. UI Structure Implementation
*   **Layer 1 (Background)**: Full-screen container with `#2C1608` background and `#FFD700` radial gradient.
*   **Layer 2 (Light Source)**: `div` with halo effect, binding `scale` and `opacity` to loading progress.
*   **Layer 3 (Props)**:
    *   Oil Lamp: CSS-styled block with `@keyframes` flame animation.
    *   Character Label: "孙悟空 (扇风中)" text positioned near the lamp.
*   **Layer 4 (HUD)**:
    *   Loading Text: Dynamic text binding based on progress stages.
    *   Progress Bar: Retro-styled border container with dynamic width filling.
*   **Layer 5 (Flash)**: White overlay div for the transition effect.

## 2. Logic Implementation (`<script setup>`)
*   **State Management**: `progress` (0-100), `isFlashing` (boolean).
*   **Computed Properties**: `loadingText` logic (0-30%, 30-70%, 70-100% messages).
*   **Lifecycle**: `onLoad` / `onMounted` to trigger simulation.
*   **Simulation Logic**: `setInterval` to increment progress over ~1.8s.
*   **Completion Logic**:
    *   Trigger Flash (set `isFlashing = true`).
    *   Wait 500ms.
    *   `uni.reLaunch({ url: '/pages/index/index' })`.

## 3. Styling (SCSS)
*   Use variables from `uni.scss` where applicable (though `scoped` might need direct values or imports if not global, but `uni.scss` is usually global in Uni-app).
*   Implement `flame-flicker` animation keyframes.
*   Implement `flash-fade` transition.
