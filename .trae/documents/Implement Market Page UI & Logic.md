# Implement Market Page (src/pages/market/index.vue)

## 1. Configuration Check
*   **Action**: Ensure `pages/market/index` in `pages.json` has `"navigationStyle": "custom"` to match the requested custom navbar design.

## 2. Page Implementation (`src/pages/market/index.vue`)
*   **UI Structure**:
    *   **Container**: Background `#F7F5F0`, full height, safe area padding.
    *   **Custom Navbar**: Fixed top, transparent/white, status bar padding.
    *   **Scroll Content**:
        *   **Hero Banner**: 16:9 placeholder.
        *   **Sticky Tabs**: `position: sticky`, category switching.
        *   **Product Grid**: 2-column grid, card layout.
    *   **Custom TabBar**: Fixed bottom.
*   **Product Card**:
    *   Square image placeholder (using color).
    *   Title, Tags (flex row), Footer (Price + Button).
*   **Logic**:
    *   **State**: `categories`, `currentCatIndex`.
    *   **Data**: `allProducts` (5 items).
    *   **Computed**: `displayProducts` based on filter.
    *   **Methods**: `switchCat`, `buyItem`.
*   **Styling**:
    *   "New Chinese Style": Minimalist, paper texture, elegant typography.
    *   Sticky header for tabs.

