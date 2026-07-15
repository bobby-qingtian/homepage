# Interests playlist accordion QA

- Source visual truth: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/assets/interests-accordion-reference.png`
- Collapsed implementation: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/implementation-accordion-collapsed.png`
- Expanded implementation: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/implementation-accordion-expanded.png`
- Viewport: 1402 x 1122
- State: English; all playlists collapsed initially, then individual playlist expanded by click

**Findings**

- No actionable P0, P1, or P2 issues remain for the requested accordion behavior.

**Full-view comparison evidence**

- The supplied reference confirms the intended expanded playlist design and the compact appearance of the remaining rows.
- The initial implementation screenshot confirms all five playlists render as compact rows with Photography immediately below them.
- The expanded screenshot and browser DOM confirm the selected row is replaced in place by the full record/title/description/track-count/Spotify presentation.

**Focused interaction evidence**

- Initial visible expanded-detail count: 0.
- After clicking playlist 01: visible expanded-detail count is 1 and the visible detail id is `playlist-01-detail`.
- After clicking playlist 02: visible expanded-detail count remains 1, playlist 01 reports `aria-expanded=false`, and playlist 02 reports `aria-expanded=true`.
- Clicking the expanded panel outside Spotify collapses it; Escape also collapses the active panel.

**Required fidelity surfaces**

- Fonts and typography: existing Courier Prime hierarchy, sizes, line-height, and wraps are preserved.
- Spacing and layout rhythm: compact rows remain 80 px, the last row remains 91 px, and an expanded item uses the original 260 px detailed layout.
- Colors and visual tokens: unchanged from the approved dark Interests page.
- Image quality and asset fidelity: record crops and photography fields continue using the supplied raster source assets.
- Copy and content: each playlist retains its name, genre, track count, and Spotify destination; expanded panels use playlist-specific copy.

**Browser and accessibility checks**

- Five playlist summaries are native buttons with unique `aria-controls` relationships.
- `aria-expanded` state updates correctly when opening and switching playlists.
- Only one detail panel can be visible at a time.
- EN/中 translation messaging remains wired to the homepage shell.
- Browser console warnings/errors from the Interests implementation: none.
- JavaScript syntax and diff whitespace checks: passed.

**Comparison history**

- Before: playlist 01 was permanently expanded on page load and rows 02–05 navigated directly to Spotify.
- Fix: converted all five entries to a shared accordion structure, made every initial state collapsed, and moved Spotify navigation into each expanded detail panel.
- Post-fix: initial expanded count is 0; clicking an item expands exactly one; clicking another closes the previous item.

**Follow-up polish**

- No remaining P3 item is required for this behavior change.

## Vinyl record icon update

- Material reference: `/Users/lions/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_2tj7zkrarrkw22_0a75/temp/RWTemp/2026-07/d3b19358c47e173d9c0b9a5db6b026a2.png`
- Final transparent asset: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/assets/vinyl-record.png`
- Rendered evidence: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/implementation-vinyl-collapsed.png`
- The five collapsed-row icons now use the same photorealistic black-vinyl asset with visible concentric grooves, restrained reflected highlights, an off-white center label, and transparent outer corners.
- The expanded large record uses the same asset and `background-size: contain`, preserving material consistency at both sizes.
- Asset validation: optimized 512 x 512 RGBA PNG, alpha range 0–255, all four corners fully transparent, no chroma-key fringe visible at UI size.
- Layout validation: all five records remain aligned in the existing record column; row dimensions, accordion behavior, text, counts, and Photography placement are unchanged.
- Browser console warnings/errors from this update: none.

## Equal-height music and photography split

- Source annotation: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/assets/interests-half-split-reference.png`
- Rendered evidence: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/implementation-half-split.png`
- Desktop viewport: 1402 x 1122.
- Listening bounds: top 0 px, height 561 px, bottom 561 px.
- Photography bounds: top 561 px, height 561 px, bottom 1122 px.
- The page has no horizontal or document-level vertical overflow in the default desktop state.
- When playlist 01 is expanded, Listening remains 561 px high and becomes internally scrollable (`scrollHeight: 673 px`); Photography stays fixed at top 561 px with height 561 px.
- Both section headers remain sticky within their own half, and internal scrollbars are visually hidden.
- Mobile validation at 390 x 844: the 50/50 lock is removed, sections return to natural vertical flow, and `scrollWidth` remains 390 px.
- Browser console warnings/errors from this update: none.

## Photography staggered albums

- Layout reference: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/assets/photography-layout-reference.png`.
- Album-index evidence: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/implementation-photography-staggered.png`.
- Expanded-album evidence: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/implementation-photography-album.png`.
- Four offset cover cards reproduce the reference's two-row diagonal rhythm while preserving the Photography half-height boundary.
- Source folders copied into `interests-page/assets/photography/` as web-optimized, orientation-corrected JPEGs: Brazil 13, Australia 12, China 10, Indonesia 10; 45 files total.
- Every cover opens its corresponding album in place. The viewer includes all album thumbnails, previous/next controls, arrow-key navigation, Escape/back return, active-photo state, and a zero-padded counter.
- Automated browser audit confirmed counts of 13 / 12 / 10 / 10, no broken images, and no console errors.
- The homepage `srcdoc` integration was also exercised: opening Interests and then Australia produced `01 / 12`, 12 thumbnails, and the expected project-relative image URL.
- Responsive check at the available 1280 x 720 browser viewport confirmed all four staggered covers remain fully inside the Photography section; mobile falls back to a two-column staggered grid and natural page flow.

## Rounded Photography images

- Source visual truth: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/qa-reference-rounded.png`.
- Implementation screenshot: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/implementation-photography-rounded.png`.
- Viewport/state: 1280 x 720, English, Interests page, all four album covers visible.
- Full-view comparison: the requested Photography composition, 50/50 section split, staggered cover positions, copy, colors, and imagery remain unchanged; all four cover photos now show consistent 12 px rounded corners.
- Focused interaction evidence: opening Brazil rendered one rounded main image and all 13 rounded thumbnails; back navigation returned to the four-cover index.
- Fonts and typography: unchanged.
- Spacing and layout rhythm: unchanged apart from the requested corner treatment; no clipping or overlap was introduced.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: original project-local JPEGs and crops are preserved; rounding is applied only as a CSS mask.
- Copy and content: unchanged.
- Findings: no actionable P0, P1, or P2 issues.
- Comparison history: square image corners were the reported mismatch; 12 px cover/main-image radii and 6 px thumbnail radii were added; the browser-rendered post-fix capture confirms the update.

## Separated staggered album positions

- Source visual truth: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/assets/photography-stagger-annotation.png`.
- Implementation screenshot: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/implementation-photography-separated-stagger.png`.
- Viewport/state: 1280 x 720, English, Interests page, all four covers visible.
- Full-view comparison: Brazil now starts at grid column 4, Australia at column 10, China remains at column 1, and Indonesia starts at column 7. This matches the annotated rightward offsets while keeping the two rows visually distinct.
- Focused region comparison: the upper pair occupies columns 4–6 and 10–12; the lower pair occupies columns 1–3 and 7–9. No cover cards share a grid column within the same row, so there is explicit negative space and no overlap.
- Fonts and typography: unchanged.
- Spacing and layout rhythm: the requested stronger diagonal stagger is present; cover sizes, row heights, labels, rounded corners, and the 50/50 section boundary remain unchanged.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: original project-local album images and crops are preserved.
- Copy and content: unchanged.
- Interaction evidence: China still opens at `01 / 10` with all 10 thumbnails and returns to the index normally.
- Findings: no actionable P0, P1, or P2 issues.
- Comparison history: the previous grid positions looked too close and visually stacked; the three annotated cards were shifted right to columns 4, 10, and 7; the post-fix browser capture confirms separated staggered placement.

## Photography album modal and lightbox

- Source visual truth: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/assets/photography-modal-annotation.png`.
- Album-modal implementation: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/implementation-photography-modal.png`.
- Enlarged-photo implementation: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/implementation-photography-lightbox.png`.
- Viewport/state: 1280 x 720, English, Brazil album popup followed by enlarged photograph 05 / 13.
- Full-view comparison: clicking a cover now opens a centered overlay above both page sections, matching the annotated popup region instead of replacing the Photography content in place.
- Focused region comparison: the album popup shows every photograph in a five-column rounded grid with title, frame count, and close control; selecting any grid image opens a second, darker full-screen preview with previous, next, close, and counter controls.
- Fonts and typography: the existing monospace family, uppercase labels, weights, and letter spacing are preserved.
- Spacing and layout rhythm: the popup uses a 76 vw by up-to-680 px panel and remains centered with a dimmed, blurred backdrop; the image grid scrolls internally if necessary.
- Colors and visual tokens: the established black, muted gray, off-white, and fine-line palette is preserved.
- Image quality and asset fidelity: all project-local photos load eagerly in the popup and use the existing optimized JPEGs; the preview uses `object-fit: contain` to avoid cropping the selected photograph.
- Copy and content: album names, total frame counts, per-image indices, and EN/中 close/navigation labels are present.
- Interaction evidence: all album popup counts passed (13 / 12 / 10 / 10); clicking Brazil image 04 opened `04 / 13`, Next advanced to `05 / 13`, the lightbox close returned to the gallery, and the modal close returned focus to the cover index.
- Accessibility evidence: album covers expose `aria-haspopup="dialog"` and `aria-controls`; the popup uses `role="dialog"` plus `aria-modal`; the background page becomes inert while the popup is open.
- Findings: no actionable P0, P1, or P2 issues.
- Comparison history: the former in-section viewer did not behave like the requested popup and exposed one primary image plus a thumbnail strip; it was replaced with a complete album-grid modal and a second-level enlarged preview, verified in the browser-rendered post-fix captures.

## Unified Interests arrow asset

- Source visual truth: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/assets/interests-arrow-annotation.png`.
- Supplied source asset: `/Users/lions/Downloads/arrow-up-right.svg`.
- Project asset: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/assets/arrow-up-right.svg`.
- Implementation screenshot: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/implementation-arrow-source-color.png`.
- Viewport/state: 1280 x 720, English, all playlists collapsed and all four album covers visible.
- Full-view comparison: the five music-row arrows and four Photography arrows retain their annotated positions, direction, and hierarchy while now rendering with the supplied SVG's own black fill.
- Focused region comparison: all 14 arrow images in the DOM—including five collapsed rows, five expanded Spotify actions, and four album links—now resolve to the copied `assets/arrow-up-right.svg`; zero `↗` text-glyph arrows remain.
- Fonts and typography: unchanged.
- Spacing and layout rhythm: unchanged; the SVG is 18 px for music/Spotify and 16 px for album metadata.
- Colors and visual tokens: all arrow filters are removed, so every instance displays the source SVG's exact `#000000` fill in default, hover, and focus states.
- Image quality and asset fidelity: the project copy is byte-identical to `/Users/lions/Downloads/arrow-up-right.svg` and remains a vector at every rendered size.
- Copy and content: unchanged.
- Interaction evidence: expanding playlist 01 preserved the Spotify link and confirmed its icon source is the unified asset.
- Findings: no actionable P0, P1, or P2 issues.
- Comparison history: album links previously used a text glyph and the shared SVG instances were recolored green with CSS; every arrow now references the exact user-supplied SVG and uses `filter: none` so its native black color is preserved.

final result: passed

## Interests header seam removal

- Source annotation: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/assets/interests-header-seam-annotation.png`.
- Browser-rendered evidence: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/interests-page/implementation-header-seam-fixed.png`.
- Viewport/state: 1280 × 720, homepage Interests dialog fully open.
- The light 1 px separator previously drawn by `.drawer-motion-card--work::after` is now disabled only for the Interests full-page card.
- HOME and Interests tabs retain their shapes and alignment; the black Interests iframe now meets the navigation boundary without the annotated light gap.
- Work and About retain their existing separator treatment.
- Browser DOM confirmed the embedded Interests page and all primary controls remain present after the scoped change.
- Findings: no actionable P0, P1, or P2 issues.

final result: passed

## About Education reference-content recreation

- Source visual truth: `/Users/lions/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_2tj7zkrarrkw22_0a75/temp/RWTemp/2026-07/49b1a5bc3cd2d0b79d720bf008364c0a.png`.
- Browser-rendered implementation: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/about-page/implementation-education-reference-layout.png`.
- Combined comparison evidence: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/about-page/qa-education-side-by-side.png`.
- Viewport/state: 1280 × 720, English, About page, Education at its initial scroll position.

**Findings**

- No actionable P0, P1, or P2 mismatch remains for the requested Education content and layout recreation.

**Full-view comparison evidence**

- The implementation preserves the reference hierarchy: title, three vertically distributed education records, and a two-column location/details layout.
- The reference is a standalone 1518 × 790 Education composition, while the implementation is intentionally fitted into the narrower right panel; the responsive adaptation preserves information order and line structure rather than stretching or clipping the panel.

**Focused region comparison evidence**

- All three university names render on one line.
- Every right-column record renders as the reference's institution line followed by exactly three metadata lines.
- Dates, locations, degree names, `MAJOR:` labels, GPA formatting, WAM/honours copy, and the curly apostrophe in `DEAN’S LIST` match the reference.
- The three left-column text tops are evenly spaced at the final desktop layout, and both columns use stable shared x-coordinates.

**Required fidelity surfaces**

- Fonts and typography: the existing Martian Mono/Geist system is retained; institution names remain bold, dates and locations regular, and metadata uppercase. The 1101–1350 px desktop adjustment reduces metadata only as needed to preserve the reference's single-line structure.
- Spacing and layout rhythm: three records use equal vertical cadence, a consistent two-column grid, and the same per-record hierarchy as the reference.
- Colors and visual tokens: the existing off-white panel, black text, and project tokens remain unchanged and match the reference's neutral treatment.
- Image quality and asset fidelity: this Education region contains no image assets or icons; no source asset was replaced or approximated.
- Copy and content: all English Education copy now matches the supplied reference; equivalent Chinese translations remain wired to the existing language switch.

**Responsive and browser checks**

- At 1280 × 720, all institution and metadata lines remain single-line, the rightmost content retains 20 px clearance, and horizontal overflow is 0 px.
- At 1512 × 890, all target lines remain single-line and the Education panel has no horizontal overflow.
- Below 700 px, nowrap is removed so the existing single-column mobile layout can wrap safely.
- Browser console warnings/errors from the implementation: none.
- HTML/CSS diff whitespace validation: passed.

**Comparison history**

- Earlier P2: the first recreation used equal-width columns and 14 px metadata, causing the longest line to overflow by 45 px at desktop widths.
- Fix: expanded the details column, reduced its gap, introduced a scoped 1101–1350 px type adjustment, and retained the single-column mobile fallback.
- Post-fix evidence: all target lines render once, `panelOverflow` is 0 px, and the rightmost content remains inside the panel at both tested desktop sizes.

**Follow-up polish**

- No remaining P3 refinement is required for the requested region.

final result: passed

## About Education compact height alignment

- Source visual truth: `/var/folders/m8/x42xrj1n74n470j55bpc2l0m0000gn/T/codex-clipboard-4d3ee95f-f871-4edd-8e83-cb67b5852c9f.png`.
- Browser-rendered implementation: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/about-page/implementation-education-compact-height.png`.
- Combined comparison evidence: `/Users/lions/Documents/项目开发/项目代做/黄擎天个人主页/huang-homepage/about-page/qa-education-compact-height-side-by-side.png`.
- Viewport/state: 1512 × 890, English, About page, initial scroll position.

**Findings**

- No actionable P0, P1, or P2 mismatch remains for the requested Education spacing and height alignment.

**Focused region comparison evidence**

- The Education title and the left story title share the same 26 px top coordinate.
- The left story text ends at 431.95 px and the third Education record ends at 430.71 px, leaving only a 1.23 px measured difference.
- The Education content height is 404.71 px versus 405.95 px for the left title-and-copy region.
- All content, type sizes, two-column positions, and single-line metadata from the supplied Education reference remain unchanged.

**Comparison history**

- Earlier P2: 46 px vertical padding on each Education record created excessive gaps and extended the right region well below the left story text.
- Fix: reduced the desktop Education record vertical padding from 46 px to 16 px while keeping the first record flush to the title.
- Post-fix evidence: the right region is 1.23 px shorter than the left region, which is visually aligned at the tested viewport without clipping or overlap.

final result: passed
