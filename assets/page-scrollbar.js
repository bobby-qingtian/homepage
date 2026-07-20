/* Shared page scrollbar.
   Originally lived in work.css / work.js / work.html; extracted here so every
   standalone page (work, interests, about) shows the same rail, on desktop and
   on mobile. Self-injects its markup and styles, so a page only has to load it.

   The rail drives window scroll, so it reflects whatever the document scrolls —
   sections with their own overflow (e.g. the interests photography grid) keep
   their native behaviour. */
(function () {
  const TICK_COUNT = 32;

  function start() {
    if (document.querySelector(".page-scrollbar")) return;

    const pageBackground = getComputedStyle(document.body).backgroundColor;
    const channels = (
      pageBackground.match(/[\d.]+/g) || ["255", "255", "255"]
    ).map(Number);
    const luminance =
      (0.299 * channels[0] + 0.587 * channels[1] + 0.114 * channels[2]) / 255;
    const dark = luminance < 0.5;
    const tick = dark ? "#5c6472" : "#99948b";
    const thumbEdge = dark ? "#7d879a" : "#8f8a82";
    const thumbFill = dark ? "#0f172a" : "#f8f9fa";
    const thumbHalo = dark ? "rgba(15,23,42,.72)" : "rgba(248,249,250,.72)";

    const style = document.createElement("style");
    style.textContent = `
      html { scrollbar-width: none; }
      html::-webkit-scrollbar { width: 0; height: 0; }
      .page-scrollbar {
        position: fixed;
        z-index: 30;
        top: 28px;
        right: 4px;
        bottom: 28px;
        width: 12px;
        user-select: none;
        touch-action: none;
        cursor: pointer;
      }
      .page-scrollbar[hidden] { display: none; }
      .page-scrollbar-track { position: relative; width: 100%; height: 100%; }
      .page-scrollbar-ticks {
        position: absolute;
        inset: 6px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        pointer-events: none;
      }
      .page-scrollbar-ticks i {
        display: block;
        width: 7px;
        height: 1px;
        background: ${tick};
        opacity: .82;
      }
      .page-scrollbar-thumb {
        position: absolute;
        top: 0;
        left: 1px;
        width: 10px;
        height: 24px;
        border: 1px solid ${thumbEdge};
        background: ${thumbFill};
        box-shadow: 0 0 0 1px ${thumbHalo};
        pointer-events: auto;
        cursor: grab;
        will-change: transform;
      }
      .page-scrollbar-thumb:active { cursor: grabbing; }
      @media (max-width: 700px) {
        .page-scrollbar { top: 16px; bottom: 16px; right: 2px; width: 10px; }
        .page-scrollbar-thumb { left: 0; width: 9px; }
        .page-scrollbar-ticks i { width: 5px; }
      }
    `;
    document.head.appendChild(style);

    const rail = document.createElement("div");
    rail.className = "page-scrollbar";
    rail.setAttribute("aria-hidden", "true");
    rail.innerHTML =
      '<div class="page-scrollbar-track">' +
      '<div class="page-scrollbar-ticks">' +
      "<i></i>".repeat(TICK_COUNT) +
      "</div>" +
      '<div class="page-scrollbar-thumb"></div>' +
      "</div>";
    document.body.appendChild(rail);

    const track = rail.querySelector(".page-scrollbar-track");
    const thumb = rail.querySelector(".page-scrollbar-thumb");
    let drag = null;

    const maxScrollOf = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    function sync() {
      const maxScroll = maxScrollOf();
      const travel = Math.max(0, track.clientHeight - thumb.offsetHeight);
      const progress = maxScroll ? window.scrollY / maxScroll : 0;
      rail.hidden = maxScroll === 0;
      thumb.style.transform = `translateY(${Math.round(progress * travel)}px)`;
    }

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    window.addEventListener("load", sync);

    rail.addEventListener("pointerdown", (event) => {
      const trackBox = track.getBoundingClientRect();
      const maxScroll = maxScrollOf();
      const travel = Math.max(1, track.clientHeight - thumb.offsetHeight);

      if (event.target === thumb) {
        drag = { y: event.clientY, scrollTop: window.scrollY, maxScroll, travel };
        thumb.setPointerCapture(event.pointerId);
        return;
      }
      const nextProgress = Math.min(
        1,
        Math.max(
          0,
          (event.clientY - trackBox.top - thumb.offsetHeight / 2) / travel,
        ),
      );
      window.scrollTo({ top: nextProgress * maxScroll, behavior: "smooth" });
    });
    thumb.addEventListener("pointermove", (event) => {
      if (!drag) return;
      window.scrollTo({
        top:
          drag.scrollTop +
          ((event.clientY - drag.y) / drag.travel) * drag.maxScroll,
      });
    });
    thumb.addEventListener("pointerup", () => {
      drag = null;
    });
    thumb.addEventListener("pointercancel", () => {
      drag = null;
    });

    if (typeof ResizeObserver === "function") {
      new ResizeObserver(sync).observe(document.documentElement);
    }
    sync();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start);
  else start();
})();
