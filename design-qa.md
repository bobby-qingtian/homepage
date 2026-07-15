# Homepage drawer proportion and fixed-viewport design QA

- Source visual truth: `/var/folders/m8/x42xrj1n74n470j55bpc2l0m0000gn/T/codex-clipboard-5914a4e8-4e59-4459-aa1e-b165e1840b62.png`
- Raised-position reference: `/var/folders/m8/x42xrj1n74n470j55bpc2l0m0000gn/T/codex-clipboard-03c3df5f-0fd1-4971-a1bd-3259c841d732.png`
- Baseline implementation screenshot: `/tmp/huang-homepage-drawer-before.png`
- Revised implementation screenshot: `/tmp/huang-homepage-drawer-after.png`
- Combined comparison evidence: `/tmp/huang-homepage-drawer-comparison.png`
- Fixed centered implementation screenshot: `/tmp/huang-homepage-drawer-fixed.png`
- Raised implementation screenshot: `/tmp/huang-homepage-drawer-raised.png`
- Viewport: 1988 x 1248
- State: desktop, English, welcome guide dismissed, drawer raised slightly and page scrolling locked

**Full-view comparison evidence**

- The source, baseline implementation, and revised implementation were opened and visually inspected.
- The coded drawer bounding box changed from 1036.53 x 913.68 px to 943.49 x 989.81 px at the comparison viewport.
- This is a 9.0% width reduction and an 8.3% height increase, centered on the same horizontal axis.
- The revised page has no horizontal overflow and the full drawer remains visible in the viewport.
- The drawer remains horizontally centered and is deliberately raised by 32 CSS px on desktop so its lower edge is not obscured at the reference scale.

**Focused region comparison evidence**

- A separate crop was not needed because the requested change affects the single top-level drawer transform, while all internal geometry, type, borders, and labels inherit the same proportional change.

**Findings**

- No actionable P0, P1, or P2 differences remain for the requested proportion and fixed-position adjustments.

**Required fidelity surfaces**

- Fonts and typography: unchanged; the existing Martian Mono and Geist hierarchy remains intact.
- Spacing and layout rhythm: the drawer is visibly taller and narrower; internal rows, tabs, front lip, and side taper remain aligned.
- Colors and visual tokens: unchanged.
- Image quality and asset fidelity: no raster assets are used by the drawer itself; existing arrow assets and page chrome are unchanged.
- Copy and content: unchanged.

**Responsive and interaction checks**

- Desktop: 1988 x 1248, drawer top 104.13 px and bottom 1093.95 px after the raised-position adjustment.
- Desktop wheel test: document height equals viewport height (1248 px) and `scrollY` remains 0 after a 720 px wheel input.
- Mobile: 390 x 844, drawer width 361.8 px and height 425.11 px, centered at 209.44 px from the top with no overflow.
- Mobile wheel test: document height equals viewport height (844 px) and `scrollY` remains 0 after a 500 px wheel input.
- Welcome guide dismissal was tested successfully.
- Browser console errors checked: none.

**Comparison history**

- Initial pass: the drawer measured 1036.53 x 913.68 px.
- Fix applied: reduced the horizontal scale and increased the overall zoom.
- Post-fix pass: the drawer measured 943.49 x 989.81 px with no overflow or alignment regression.
- Fixed-position pass: changed the homepage shell to a centered 100vh frame, locked root scrolling, and changed mobile scaling to use the drawer's center.
- Post-fix evidence: both desktop and mobile remain centered and ignore vertical wheel input.
- Raised-position pass: moved the desktop drawer upward by 32 CSS px; its full lower edge remains visible and no element overlap was introduced.

**Implementation checklist**

- [x] Increase the drawer height.
- [x] Reduce the drawer width.
- [x] Preserve centering and internal alignment.
- [x] Lock vertical page scrolling and overscroll.
- [x] Keep the mobile drawer vertically centered and raise the desktop drawer slightly.
- [x] Keep the desktop drawer's lower edge visible and unobstructed.
- [x] Verify desktop and mobile overflow.
- [x] Check browser console errors.

final result: passed
