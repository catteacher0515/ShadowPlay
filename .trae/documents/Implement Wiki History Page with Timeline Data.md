# Implement Wiki History Page (src/pages/wiki/history.vue)

## 1. Page Registration

* **File**: `pages.json`

* **Action**: Ensure `pages/wiki/history` has `"navigationStyle": "custom"` (implied by previous context of immersive pages, though user prompt focuses on data, I should ensure the file exists and is configured).

## 2. Page Implementation (`src/pages/wiki/history.vue`)

* **Note**: The user provided a data update request, but the file `src/pages/wiki/history.vue` likely doesn't exist yet or is empty based on previous turns (I only implemented `daily`, `craft`, `music`, `menu`). I need to create the full page to hold this data.

* **UI Structure**:

  * **Timeline Layout**: Horizontal scroll (`scroll-view scroll-x`) or Swiper. Given "7-Node Narrative", a horizontal timeline feels appropriate.

  * **Background**: Parallax or static historical background (sepia tones).

  * **Nodes**:

    * Timeline axis line.

    * Node points (dots).

    * **Card**: Displaying Era, Title, Desc, Image.

  * **Special Node (7th)**: Highlighted style for "Future".

* **Logic**:

  * **Data**: Use the provided `historyEvents` array.

  * **State**: `activeIndex` (to highlight current node in timeline).

  * **Methods**: `onScroll` or `onSwiperChange` to update active index.

## 3. Data Integration

* Insert the exact `historyEvents` array provided in the prompt.

