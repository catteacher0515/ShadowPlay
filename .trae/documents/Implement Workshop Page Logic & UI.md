# Implement Workshop Page (src/pages/workshop/index.vue)

## 1. UI Structure Implementation
*   **Global Layout**: Flex container, vertical split.
    *   **Stage (Top 65%)**: `#F7F5F0` background with vignette overlay (using radial gradient).
    *   **Inventory (Bottom 35%)**: `#3E2723` background, z-index elevated.
*   **Stage Elements**:
    *   **Ghost Outline**: Centered div with dashed gold border and breathing animation.
    *   **Equipped Parts**: Absolute positioned divs inside the ghost outline representing the assembled parts (Head, Body, Hand, Leg).
    *   **Status Sidebar**: Fixed left column with 4 indicators (circle icons), dynamic styling based on `equipped` state.
    *   **Controls**:
        *   "Light Check" button (bottom-right of stage).
        *   "Test Play" button (centered, conditional display `v-if="isComplete"`).
*   **Inventory Elements**:
    *   **Tabs**: Horizontal scroll/flex row for categories (Head, Body, Hand, Leg). Highlight active tab.
    *   **Grid**: Scrollable grid area displaying placeholder parts.

## 2. Logic Implementation (`<script setup>`)
*   **State Management**:
    *   `currentTab`: 'head' | 'body' | 'hand' | 'leg'
    *   `equipped`: Reactive object tracking selected part IDs for each slot.
    *   `isComplete`: Computed property checking if all 4 slots are filled.
*   **Mock Data**:
    *   `partsData`: Object mapping categories to arrays of part items (id, color, name).
*   **Actions**:
    *   `selectTab(tab)`: Switch current category.
    *   `equipPart(part)`:
        *   Update `equipped[currentTab]`.
        *   Auto-advance to next tab logic (Head -> Body -> Hand -> Leg -> Done).
    *   `toggleLight()`: Console log stub.
    *   `startTestPlay()`: Console log stub.

## 3. Styling (SCSS)
*   **Vignette Effect**: `radial-gradient` on Stage.
*   **Wood Texture**: Simple background color for MVP, maybe CSS pattern if simple.
*   **Animations**: `breathing-glow` for Ghost, `fade-in` for equipped parts.
*   **Responsiveness**: Use percentages for height split.

