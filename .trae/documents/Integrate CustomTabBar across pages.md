# Refactor Pages to Use CustomTabBar

## 1. Refactor `src/pages/index/index.vue`
*   **Template**:
    *   Delete the manual `<view class="custom-tabbar">` block and its children.
    *   Insert `<CustomTabBar current-path="/pages/index/index" />`.
*   **Script**:
    *   Import `CustomTabBar`.
    *   Delete `uni.hideTabBar()` call in `onMounted`.
    *   Delete `tabItems` array and `switchTab` function (no longer needed).
    *   Delete `currentTab` state.

## 2. Refactor `src/pages/workshop/index.vue`
*   **Template**:
    *   Append `<CustomTabBar current-path="/pages/workshop/index" />` to the root view.
*   **Script**:
    *   Import `CustomTabBar`.
    *   (Check & Remove) `uni.hideTabBar()` if present (unlikely in this file based on history, but will verify).

## 3. Refactor `src/pages/theater/index.vue`
*   **Template**:
    *   Append `<CustomTabBar current-path="/pages/theater/index" />` to the root view.
*   **Script**:
    *   Import `CustomTabBar`.
    *   (Check & Remove) `uni.hideTabBar()` if present.

## 4. Verification
*   Ensure all pages import the component correctly.
*   Ensure no `uni.hideTabBar()` calls remain to prevent errors.

