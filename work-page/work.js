document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".work-page");

  const wheel = document.querySelector(".timeline-wheel");
  const rotor = document.querySelector(".timeline-rotor");
  const yearLabel = document.querySelector(".timeline-year");
  const experienceSection = document.querySelector(".experience-section");
  const experienceList = document.querySelector(".experience-list");
  const experienceNext = document.querySelector(".experience-next");
  const tabs = Array.from(document.querySelectorAll(".timeline-tab"));
  const panels = Array.from(document.querySelectorAll(".experience-card"));
  const embeddedInFrame = window.self !== window.top;
  let languageButton = document.querySelector(".language-switch");

  const translatableSelector = [
    ".experience-intro p",
    ".experience-intro h1",
    ".experience-count",
    ".experience-heading-row h2",
    ".experience-description",
    ".experience-stats",
    ".experience-next-label",
    ".download-label",
    ".projects-intro h2",
    ".projects-intro p",
    ".skills-title",
    ".project-meta",
    ".project-title",
    ".project-details > p",
    ".project-action",
    ".credentials-label",
    ".credential-name",
    ".skills-link span:first-child",
    ".footer-link span:not(.footer-arrow)",
    ".copyright",
  ].join(",");
  const actionLabels = {
    en: { open: "View case", close: "Close case" },
    zh: { open: "查看案例", close: "收起案例" },
  };
  let currentLanguage = document.documentElement.lang === "zh-CN" ? "zh" : "en";

  function prepareTranslations() {
    document.querySelectorAll(translatableSelector).forEach((element) => {
      if (element.dataset.i18nPrepared === "true") return;
      element.dataset.enHtml = element.innerHTML;
      if (!element.dataset.zhHtml)
        element.dataset.zhHtml = element.dataset.enHtml;
      element.dataset.i18nPrepared = "true";
    });
  }

  function translateElement(element, language) {
    const htmlKey = language === "zh" ? "zhHtml" : "enHtml";
    const textKey = language === "zh" ? "zh" : "en";
    if (element.dataset[htmlKey]) {
      element.innerHTML = element.dataset[htmlKey];
    } else if (element.dataset[textKey]) {
      element.textContent = element.dataset[textKey];
    }
  }

  function setLanguage(language) {
    currentLanguage = language === "zh" ? "zh" : "en";
    document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
    document
      .querySelectorAll(translatableSelector)
      .forEach((element) => translateElement(element, currentLanguage));

    document.querySelectorAll(".project-card").forEach((card) => {
      const button = card.querySelector(".project-summary");
      const action = card.querySelector(".project-action");
      if (!button || !action) return;
      action.textContent =
        actionLabels[currentLanguage][
          button.getAttribute("aria-expanded") === "true" ? "close" : "open"
        ];
    });

    if (languageButton) {
      languageButton.setAttribute(
        "aria-pressed",
        String(currentLanguage === "zh"),
      );
      const languageSpans = languageButton.querySelectorAll("span");
      languageSpans[0].classList.toggle("is-active", currentLanguage !== "zh");
      languageSpans[1].classList.toggle("is-active", currentLanguage === "zh");
    }

    updateMonthTabs();
    updateNextButton();
  }

  prepareTranslations();

  function scrollToWorkSection(targetName) {
    const target = document.getElementById(targetName);
    if (!target) return;

    const apply = () => {
      if (targetName === "experiences") {
        const heading = target.querySelector(".experience-intro h1");
        const anchor = heading || target;
        const anchorTop = anchor.getBoundingClientRect().top + window.scrollY;
        const headingOffset = window.matchMedia("(max-width: 700px)").matches
          ? 16
          : 64;
        window.scrollTo({
          top: Math.max(0, anchorTop - headingOffset),
          behavior: "auto",
        });
        return;
      }

      target.scrollIntoView({ block: "start" });
    };

    apply();

    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(apply);
      const resizeTarget =
        targetName === "experiences"
          ? target.querySelector(".experience-intro") || target
          : document.documentElement;
      observer.observe(resizeTarget);
      const stop = () => observer.disconnect();
      setTimeout(stop, 4000);
      ["wheel", "touchstart", "keydown", "pointerdown"].forEach((type) => {
        window.addEventListener(type, stop, { once: true, passive: true });
      });
    }

    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(apply);
  }

  if (languageButton) {
    languageButton.addEventListener("click", () => {
      const nextLanguage =
        languageButton.getAttribute("aria-pressed") === "true" ? "en" : "zh";
      setLanguage(nextLanguage);
      if (embeddedInFrame) {
        window.parent.postMessage(
          { type: "set-site-language", language: nextLanguage },
          "*",
        );
      }
    });
  }

  window.addEventListener("message", (event) => {
    if (!event.data) return;
    if (event.data.type === "set-language") {
      setLanguage(event.data.language);
      return;
    }
    if (event.data.type === "scroll-to") {
      scrollToWorkSection(event.data.target);
    }
  });

  if (
    !wheel ||
    !rotor ||
    !yearLabel ||
    tabs.length !== 5 ||
    panels.length !== 3 ||
    !window.gsap
  )
    return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const mobileTimeline = window.matchMedia(
    "(max-width: 900px), (pointer: coarse)",
  ).matches;
  const monthAngles = [-36, -18, 0, 18, 36];
  const slotOffsets = [-2, -1, 0, 1, 2];
  const monthNames = {
    en: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ],
    zh: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
  };
  const experienceRanges = [
    { panelIndex: 0, start: monthIndex(2022, 8), end: monthIndex(2023, 3) },
    { panelIndex: 1, start: monthIndex(2024, 7), end: monthIndex(2025, 7) },
    { panelIndex: 2, start: monthIndex(2026, 1), end: monthIndex(2026, 3) },
  ];

  let activeIndex = 0;
  let activeMonth = monthIndex(2022, 8);
  let animatingExperienceJump = false;
  let wheelLocked = false;
  let visualAngles = [...monthAngles];

  function monthIndex(year, month) {
    return year * 12 + month - 1;
  }

  function dateParts(index) {
    const year = Math.floor(index / 12);
    const month = index - year * 12 + 1;
    return { year, month };
  }

  function monthLabel(index) {
    return monthNames[currentLanguage][dateParts(index).month - 1];
  }

  function panelIndexForMonth(index) {
    const direct = experienceRanges.find(
      (range) => index >= range.start && index <= range.end,
    );
    return direct ? direct.panelIndex : null;
  }

  function placeTab(tab, angle) {
    const radius = rotor.offsetWidth / 2 - 0.5;
    const radians = (angle * Math.PI) / 180;
    gsap.set(tab, {
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
      rotation: 0,
    });
    tab.style.setProperty("--month-rotation", `${angle * 0.72}deg`);
  }

  function alignActiveExperience() {
    const activeCard = panels[activeIndex];
    if (!activeCard || !experienceSection || !experienceList) return;
    const sectionRect = experienceSection.getBoundingClientRect();
    const rotorRect = rotor.getBoundingClientRect();
    const pageScale = page
      ? page.getBoundingClientRect().width / page.offsetWidth
      : 1;
    const cardHeight = activeCard.getBoundingClientRect().height / pageScale;
    const rotorCenterY =
      (rotorRect.top + rotorRect.height / 2 - sectionRect.top) / pageScale;
    experienceList.style.top = `${Math.round(rotorCenterY - cardHeight / 2)}px`;
    if (experienceNext && !mobileTimeline) {
      experienceNext.style.top = `${Math.round(rotorCenterY + 10)}px`;
    }
  }

  function updateMonthTabs(focusActive = false) {
    const { year } = dateParts(activeMonth);
    yearLabel.textContent = String(year);

    tabs.forEach((tab, tabIndex) => {
      const slot = slotOffsets[tabIndex];
      const tabMonth = activeMonth + slot;
      const { year: tabYear, month } = dateParts(tabMonth);
      const selected = slot === 0;
      const panelIndex = panelIndexForMonth(tabMonth);

      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.dataset.monthIndex = String(tabMonth);
      if (panelIndex === null) {
        tab.removeAttribute("aria-controls");
      } else {
        tab.setAttribute("aria-controls", panels[panelIndex].id);
      }
      tab.setAttribute(
        "aria-label",
        `${monthNames[currentLanguage][month - 1]} ${tabYear}`,
      );
      tab.querySelector(".timeline-number").textContent = monthLabel(tabMonth);
      if (focusActive && selected) tab.focus({ preventScroll: true });
    });
  }

  function setActivePanel(index, animatePanel = true) {
    const nextIndex = panelIndexForMonth(index);
    if (
      nextIndex !== null &&
      nextIndex === activeIndex &&
      panels[nextIndex].classList.contains("is-active")
    )
      return;
    if (
      nextIndex === null &&
      activeIndex === null &&
      panels.every((panel) => !panel.classList.contains("is-active"))
    )
      return;

    activeIndex = nextIndex;
    panels.forEach((panel, panelIndex) => {
      const selected = activeIndex !== null && panelIndex === activeIndex;
      panel.classList.toggle("is-active", selected);
      panel.setAttribute("aria-hidden", String(!selected));

      if (selected && animatePanel && !reducedMotion) {
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.42,
            ease: "power2.out",
            overwrite: true,
          },
        );
      } else if (selected) {
        gsap.set(panel, { autoAlpha: 1, y: 0 });
      } else {
        gsap.set(panel, { autoAlpha: 0, y: 18 });
      }
    });
    updateNextButton();
    requestAnimationFrame(alignActiveExperience);
  }

  function setActiveMonth(index, { animatePanel = true, focus = false } = {}) {
    activeMonth = index;
    updateMonthTabs(focus);
    setActivePanel(activeMonth, animatePanel);
  }

  function updateNextButton() {
    if (!experienceNext) return;
    const current = activeIndex ?? 0;
    const next = (current + 1) % experienceRanges.length;
    const prefix = currentLanguage === "zh" ? "下一段" : "Next experience";
    experienceNext.setAttribute(
      "aria-label",
      `${prefix}: ${panels[next].getAttribute("aria-label")}`,
    );
  }

  function jumpToExperience(index, { focus = false } = {}) {
    if (animatingExperienceJump) return;

    const range = experienceRanges[index];
    if (!range) return;

    animatingExperienceJump = true;
    const direction = range.start >= activeMonth ? 1 : -1;
    const step = monthAngles[1] - monthAngles[0];

    setActiveMonth(range.start, { focus, animatePanel: true });

    tabs.forEach((tab, tabIndex) => {
      const desired = monthAngles[tabIndex];
      const startAngle = desired + direction * step * 2.35;
      const state = { angle: startAngle };

      placeTab(tab, startAngle);

      gsap.to(state, {
        angle: desired,
        duration: reducedMotion ? 0 : 0.78,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate() {
          placeTab(tab, state.angle);
        },
        onComplete() {
          visualAngles[tabIndex] = desired;
          placeTab(tab, desired);
        },
      });
    });

    gsap.delayedCall(reducedMotion ? 0 : 0.78, () => {
      animatingExperienceJump = false;
    });
  }

  function rotateMonth(direction, { focus = false } = {}) {
    const nextMonth = activeMonth + direction;
    setActiveMonth(nextMonth, { focus });

    tabs.forEach((tab, tabIndex) => {
      const desired = monthAngles[tabIndex];
      const adjacentIndex = tabIndex + direction;
      const step = monthAngles[1] - monthAngles[0];
      const startAngle =
        monthAngles[adjacentIndex] ?? desired + direction * step;
      const state = { angle: startAngle };

      placeTab(tab, startAngle);

      gsap.to(state, {
        angle: desired,
        duration: reducedMotion ? 0 : 0.72,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate() {
          placeTab(tab, state.angle);
        },
        onComplete() {
          visualAngles[tabIndex] = desired;
          placeTab(tab, desired);
        },
      });
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetMonth = Number(tab.dataset.monthIndex);
      if (!Number.isFinite(targetMonth) || targetMonth === activeMonth) return;
      rotateMonth(Math.sign(targetMonth - activeMonth));
    });
    tab.addEventListener("keydown", (event) => {
      if (
        !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      )
        return;
      event.preventDefault();
      const direction =
        event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
      rotateMonth(direction, { focus: true });
    });
  });

  if (experienceNext) {
    experienceNext.addEventListener("click", () => {
      const current = activeIndex ?? 0;
      jumpToExperience((current + 1) % experienceRanges.length);
    });
  }

  wheel.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      if (wheelLocked) return;
      wheelLocked = true;
      rotateMonth(event.deltaY > 0 ? 1 : -1);
      window.setTimeout(
        () => {
          wheelLocked = false;
        },
        reducedMotion ? 80 : 520,
      );
    },
    { passive: false },
  );

  if (window.Draggable && !mobileTimeline) {
    gsap.registerPlugin(Draggable);
    const dragProxy = document.createElement("div");
    Draggable.create(dragProxy, {
      type: "rotation",
      trigger: wheel,
      dragResistance: 0.08,
      cursor: "grab",
      activeCursor: "grabbing",
      onPress() {
        gsap.set(dragProxy, { rotation: 0 });
      },
      onDrag() {
        tabs.forEach((tab, tabIndex) =>
          placeTab(tab, visualAngles[tabIndex] + this.rotation),
        );
      },
      onRelease() {
        tabs.forEach((tab, tabIndex) => placeTab(tab, visualAngles[tabIndex]));
        if (Math.abs(this.rotation) > 8)
          rotateMonth(this.rotation < 0 ? 1 : -1);
        gsap.set(dragProxy, { rotation: 0 });
      },
    });
  }

  tabs.forEach((tab, tabIndex) => placeTab(tab, visualAngles[tabIndex]));
  setActiveMonth(activeMonth, { animatePanel: false });
  updateNextButton();

  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  function scrollProjectToTop(card) {
    const offset = window.matchMedia("(max-width: 900px)").matches ? 54 : 18;
    const top = card.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  projectCards.forEach((card) => {
    const button = card.querySelector(".project-summary");
    const details = card.querySelector(".project-details");
    const action = card.querySelector(".project-action");

    button.addEventListener("click", () => {
      const opening = button.getAttribute("aria-expanded") !== "true";

      projectCards.forEach((otherCard) => {
        const otherButton = otherCard.querySelector(".project-summary");
        const otherDetails = otherCard.querySelector(".project-details");
        const otherAction = otherCard.querySelector(".project-action");
        otherCard.classList.remove("is-open");
        otherButton.setAttribute("aria-expanded", "false");
        otherAction.textContent = actionLabels[currentLanguage].open;
        otherDetails.hidden = true;
      });

      if (opening) {
        card.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        action.textContent = actionLabels[currentLanguage].close;
        details.hidden = false;
        if (!reducedMotion) {
          gsap.fromTo(
            details,
            { autoAlpha: 0, y: -10 },
            { autoAlpha: 1, y: 0, duration: 0.36, ease: "power2.out" },
          );
        }
        requestAnimationFrame(() => scrollProjectToTop(card));
      }
    });
  });

  document.querySelectorAll("[data-media-switcher]").forEach((switcher) => {
    const link = switcher.querySelector(".project-media-link");
    const image = switcher.querySelector(".project-media-frame img");
    const mediaTabs = Array.from(
      switcher.querySelectorAll(".project-media-tab"),
    );
    if (!link || !image || mediaTabs.length < 1) return;

    function selectMedia(nextTab, focusTab = false) {
      if (nextTab.getAttribute("aria-selected") === "true") return;

      mediaTabs.forEach((tab) => {
        const selected = tab === nextTab;
        tab.classList.toggle("is-active", selected);
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });

      switcher.classList.add("is-changing");
      const applyMedia = () => {
        image.src = nextTab.dataset.src;
        image.alt = nextTab.dataset.alt;
        link.href = nextTab.dataset.href;
        link.setAttribute("aria-label", nextTab.dataset.linkLabel);
        image.addEventListener(
          "load",
          () => switcher.classList.remove("is-changing"),
          { once: true },
        );
        if (image.complete) switcher.classList.remove("is-changing");
      };

      if (reducedMotion) applyMedia();
      else window.setTimeout(applyMedia, 110);
      if (focusTab) nextTab.focus({ preventScroll: true });
    }

    mediaTabs.forEach((tab, tabIndex) => {
      tab.addEventListener("click", () => selectMedia(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key))
          return;
        event.preventDefault();
        let nextIndex = tabIndex;
        if (event.key === "ArrowUp")
          nextIndex = (tabIndex - 1 + mediaTabs.length) % mediaTabs.length;
        if (event.key === "ArrowDown")
          nextIndex = (tabIndex + 1) % mediaTabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = mediaTabs.length - 1;
        selectMedia(mediaTabs[nextIndex], true);
      });
    });
  });

  window.addEventListener("resize", () => {
    tabs.forEach((tab, tabIndex) => placeTab(tab, visualAngles[tabIndex]));
    alignActiveExperience();
  });
  requestAnimationFrame(alignActiveExperience);
});
