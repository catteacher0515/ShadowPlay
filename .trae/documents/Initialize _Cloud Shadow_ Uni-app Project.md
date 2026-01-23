# Initialize "Cloud Shadow" Project Structure & Config

## 1. Project Initialization
*   Scaffold Uni-app (Vue 3 + Vite) project in the current directory.
*   Install development dependencies: `sass` for styling support.
*   Install production dependencies: `pinia` for state management.

## 2. Directory Structure Creation
*   Create the `src/pages` hierarchy with all requested sub-pages (`loading`, `index`, `workshop`, `theater`, `wiki`, `market`, `profile`).
*   Create the `src/static` directory structure for images (`bg`, `common`, etc.) and audio.
*   Create the `src/stores` directory.
*   Generate placeholder `.vue` files for all pages to ensure `pages.json` registration is valid.

## 3. Core Configuration Implementation
*   **src/main.js**: Bootstrap the Vue app and register the Pinia instance.
*   **src/pages.json**: 
    *   Set `pages/loading/index` as the entry page.
    *   Configure global navigation bar styles (Black background, White text).
    *   Register all page routes.
    *   *Bonus*: Configure the `tabBar` navigation for the 5 main tabs (Index, Workshop, Theater, Wiki, Market) to match the "Main Hall", "Workshop", etc. structure.
*   **src/uni.scss**: Define the requested SCSS variables (`$theme-color-gold`, `$theme-bg-dark`, `$theme-text-light`).
*   **src/App.vue**: Configure global lifecycle and inject global styles.
*   **src/stores/index.js** & **src/stores/user.js**: Set up the Pinia store and the specific User module.
