# Implement Wiki Music Page (src/pages/wiki/music.vue)

## 1. Page Registration
*   **File**: `pages.json`
*   **Action**: Ensure `pages/wiki/music` has `"navigationStyle": "custom"`.

## 2. Page Implementation (`src/pages/wiki/music.vue`)
*   **UI Structure**:
    *   **Container**: Full screen, gradient background `#1A237E` to `#000000`.
    *   **Custom Back Button**: Top left.
    *   **Player Section** (Centered):
        *   **Control Stick (Tone Arm)**: Top right relative to disc, pivot animation.
        *   **Zoetrope (Disc)**:
            *   Rotating container.
            *   Center Character: Dynamic visual (Grey/Red placeholder).
    *   **Controls**:
        *   Play/Pause Toggle Button.
        *   Lyrics/Status Text.
    *   **Floating Notes**: CSS particle effect (simple dots floating up).
*   **Logic**:
    *   **State**: `isPlaying`.
    *   **Audio**: `uni.createInnerAudioContext`.
    *   **Methods**: `togglePlay`, `onUnmounted` (cleanup).
*   **Styling**:
    *   **Animations**: `rotate` keyframe, transition for tone arm.
    *   **Layout**: Flex column, safe area spacing.

