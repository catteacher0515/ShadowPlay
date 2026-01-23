# Implement Wiki Menu Page (src/pages/wiki/menu.vue)

## 1. Configuration Check
*   **Action**: Ensure `pages/wiki/menu` in `pages.json` has `"navigationStyle": "custom"` for full-screen immersive design.

## 2. Page Implementation (`src/pages/wiki/menu.vue`)
*   **UI Structure**:
    *   **Container**: `#F7F5F0` background (paper texture).
    *   **Bamboo Shadow Layer**: Absolute positioned `div` with SVG/CSS-shape bamboo leaves, animation `sway`.
    *   **Header**: "影卷" (Wiki) Title, centered or stylized.
    *   **Menu List**: Vertical flex column.
        *   **Cards**: 3 items (History, Craft, Music).
            *   Layout: Flex row (conditional direction based on `align`).
            *   Visual: Dark background color (mocking image), text overlay.
            *   Typography: Vertical writing mode for title, smaller horizontal for desc.
    *   **Custom TabBar**: Fixed bottom.
*   **Logic**:
    *   **Data**: `navItems` array.
    *   **Methods**: `navigateTo(path)`.
*   **Styling**:
    *   **Animations**: Keyframes for bamboo sway.
    *   **Typography**: `writing-mode: vertical-rl` for titles.

