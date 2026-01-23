# Implement Theater (Level Selection) Page

## 1. Configuration Update (pages.json)
*   **Action**: Update `pages/theater/index` configuration.
*   **Change**: Add `"navigationStyle": "custom"` to enable full-screen layout.

## 2. Page Implementation (`src/pages/theater/index.vue`)
*   **UI Structure**:
    *   **Background**: Full-screen container with linear gradient `#1a2a6c` -> `#b21f1f` -> `#fdbb2d`.
    *   **Decorations**: CSS-based cloud shapes (absolute positioning, opacity).
    *   **Header**:
        *   Title: "云上书院" (Vertical layout).
        *   Resource: "🎟️ x 5" (Top right).
    *   **Swiper Section**:
        *   `swiper` component centered vertically.
        *   `previous-margin` and `next-margin` to show adjacent cards.
        *   `swiper-item` containing the "Script Card".
    *   **Script Card**:
        *   Dynamic styling based on `active` state (scale/opacity transition).
        *   Content: Title, Status, Lock Icon (if locked).
*   **Logic**:
    *   **State**: `scripts` array (mock data), `currentIndex` (track active card).
    *   **Methods**:
        *   `onSwiperChange`: Update `currentIndex`.
        *   `enterScript`: Handle click (Toast success/lock).
*   **Styling**:
    *   Use SCSS.
    *   Implement "Cover Flow" effect manually using CSS classes based on `currentIndex` vs `index` logic (or simple active class if swiper structure allows).

