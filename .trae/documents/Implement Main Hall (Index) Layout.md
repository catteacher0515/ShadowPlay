# Implement Main Hall (Index) Page

## 1. Analysis & Verification
*   **Routing**: The user requests a link to `/pages/wiki/daily`. I need to check `pages.json` to see if this route exists. If not, I should probably stick to `console.log` as requested ("如不存在请注册或暂用 log") or register it if I feel proactive, but `console.log` is safer for now to avoid scope creep. The user prompt says "如不存在请注册或暂用 log", I will choose to just log it for now to keep the scope focused on the layout.
*   **TabBar**: The user requests a *custom* TabBar in Layer 5. This means I should probably hide the native TabBar in `pages.json` for this page or generally, OR just overlay this custom one. Since `pages.json` already has a native `tabBar` configured, showing a custom one might conflict. However, for a "game-like" immersive UI, custom is common. I will implement the custom TabBar visually as requested.
*   **Navigation**: `uni.navigateTo` / `uni.redirectTo` for TabBar.

## 2. UI Structure Implementation (src/pages/index/index.vue)
*   **Layer 1 (Background)**:
    *   Radial gradient container.
    *   Left/Right "Curtain" overlays (fixed position, translucent black).
*   **Layer 2 (Stage)**:
    *   Flex container centered.
    *   Two placeholder blocks: "孙悟空" and "白骨精".
    *   CSS animation `breathing` for these blocks.
*   **Layer 3 (HUD)**:
    *   Top-left: Avatar circle + Gong icon (BGM toggle).
    *   Top-center: Vertical text "云上·皮影".
*   **Layer 4 (Foreground Props)**:
    *   "拾影·日签" button (Red card style) positioned at bottom center (above TabBar).
*   **Layer 5 (Custom TabBar)**:
    *   Absolute/Fixed at bottom.
    *   Gradient black background.
    *   4 items: Workshop, Theater (Active), Wiki, Market. Note: "Theater" is the current page conceptually (Main Hall / Stage), but usually "Index" is the first tab. Wait, the prompt says "Current Highlight: [Theater] (Default Home)". This implies the "Index" page IS the "Theater" context or they are mapped differently.
    *   *Correction*: The `pages.json` maps `pages/index/index` to "大厅" (Main Hall). The prompt asks for tabs [工坊], [剧场], [影卷], [集市]. It seems "大厅" might be "剧场" (Theater) in this context? Or maybe "Theater" is a separate tab?
    *   *Clarification*: `pages.json` has 5 tabs: Index(大厅), Workshop(工坊), Theater(剧场), Wiki(影卷), Market(集市).
    *   The user prompt says: "包含 4 个图标按钮：[工坊]、[剧场]、[影卷]、[集市]。当前高亮: [剧场] (默认为主页)。"
    *   This is slightly confusing because `pages/index/index` is usually the "Main Hall". If "Index" IS "Theater", then highlighting "Theater" makes sense. If they are different, then why is "Index" the home page highlighting "Theater"?
    *   *Assumption*: The "Main Hall" (`pages/index/index`) IS the "Theater" experience. I will label the active tab as "剧场".
    *   *Action*: I will render 4 buttons as requested.

## 3. Logic Implementation
*   **BGM Toggle**: Simple boolean state `isBgmPlaying`.
*   **Navigation**:
    *   TabBar clicks -> `console.log("Navigate to ...")`.
    *   "Daily Sign-in" -> `console.log("Navigate to /pages/wiki/daily")`.

## 4. Styling (SCSS)
*   Use `uni.scss` variables.
*   Implement `breathing` animation.
*   Ensure Safe Area handling for the custom TabBar (`padding-bottom: constant(safe-area-inset-bottom)`).

## 5. Configuration Update (pages.json)
*   The native TabBar is configured in `pages.json`. If I render a custom one on the index page, the native one might show up too.
*   *Strategy*: I won't remove the native TabBar from `pages.json` yet as it affects other pages, but I might need to hide it on this page using `uni.hideTabBar()` in `onShow`, or just assume the user wants this custom UI *on top* or as a replacement design mock for now. I will add `uni.hideTabBar()` in `onMounted` to be safe.

