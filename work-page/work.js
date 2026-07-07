document.addEventListener('DOMContentLoaded', () => {
  const wheel = document.querySelector('.timeline-wheel');
  const rotor = document.querySelector('.timeline-rotor');
  const yearLabel = document.querySelector('.timeline-year');
  const experienceSection = document.querySelector('.experience-section');
  const experienceList = document.querySelector('.experience-list');
  const tabs = Array.from(document.querySelectorAll('.timeline-tab'));
  const panels = Array.from(document.querySelectorAll('.experience-card'));

  if (!wheel || !rotor || !yearLabel || tabs.length !== 5 || panels.length !== 3 || !window.gsap) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const monthAngles = [-70, -35, 0, 35, 70];
  const slotOffsets = [-2, -1, 0, 1, 2];
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const experienceRanges = [
    { panelIndex: 0, start: monthIndex(2022, 8), end: monthIndex(2023, 3) },
    { panelIndex: 1, start: monthIndex(2024, 7), end: monthIndex(2025, 7) },
    { panelIndex: 2, start: monthIndex(2026, 1), end: monthIndex(2026, 3) }
  ];

  let activeIndex = 0;
  let activeMonth = monthIndex(2022, 8);
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
    return monthNames[dateParts(index).month - 1];
  }

  function panelIndexForMonth(index) {
    const direct = experienceRanges.find((range) => index >= range.start && index <= range.end);
    if (direct) return direct.panelIndex;

    return experienceRanges
      .map((range) => ({
        panelIndex: range.panelIndex,
        distance: index < range.start ? range.start - index : index - range.end
      }))
      .sort((a, b) => a.distance - b.distance)[0].panelIndex;
  }

  function placeTab(tab, angle) {
    const radius = rotor.getBoundingClientRect().width / 2 - 0.5;
    const radians = angle * Math.PI / 180;
    gsap.set(tab, {
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
      rotation: 0
    });
    tab.style.setProperty('--month-rotation', `${angle * 0.72}deg`);
  }

  function alignActiveExperience() {
    const activeCard = panels[activeIndex];
    if (!activeCard || !experienceSection || !experienceList) return;
    const sectionRect = experienceSection.getBoundingClientRect();
    const rotorRect = rotor.getBoundingClientRect();
    const cardHeight = activeCard.getBoundingClientRect().height;
    const rotorCenterY = rotorRect.top + rotorRect.height / 2 - sectionRect.top;
    experienceList.style.top = `${Math.round(rotorCenterY - cardHeight / 2)}px`;
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

      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.dataset.monthIndex = String(tabMonth);
      tab.setAttribute('aria-controls', panels[panelIndex].id);
      tab.setAttribute('aria-label', `${monthNames[month - 1]} ${tabYear}`);
      tab.querySelector('.timeline-number').textContent = monthLabel(tabMonth);
      if (focusActive && selected) tab.focus({ preventScroll: true });
    });
  }

  function setActivePanel(index, animatePanel = true) {
    const nextIndex = panelIndexForMonth(index);
    if (nextIndex === activeIndex && panels[nextIndex].classList.contains('is-active')) return;

    activeIndex = nextIndex;
    panels.forEach((panel, panelIndex) => {
      const selected = panelIndex === activeIndex;
      panel.classList.toggle('is-active', selected);
      panel.setAttribute('aria-hidden', String(!selected));

      if (selected && animatePanel && !reducedMotion) {
        gsap.fromTo(panel, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power2.out', overwrite: true });
      } else if (selected) {
        gsap.set(panel, { autoAlpha: 1, y: 0 });
      } else {
        gsap.set(panel, { autoAlpha: 0, y: 18 });
      }
    });
    requestAnimationFrame(alignActiveExperience);
  }

  function setActiveMonth(index, { animatePanel = true, focus = false } = {}) {
    activeMonth = index;
    updateMonthTabs(focus);
    setActivePanel(activeMonth, animatePanel);
  }

  function rotateMonth(direction, { focus = false } = {}) {
    const nextMonth = activeMonth + direction;
    setActiveMonth(nextMonth, { focus });

    tabs.forEach((tab, tabIndex) => {
      const desired = monthAngles[tabIndex];
      const adjacentIndex = tabIndex + direction;
      const step = monthAngles[1] - monthAngles[0];
      const startAngle = monthAngles[adjacentIndex] ?? desired + direction * step;
      const state = { angle: startAngle };

      placeTab(tab, startAngle);

      gsap.to(state, {
        angle: desired,
        duration: reducedMotion ? 0 : 0.72,
        ease: 'power3.inOut',
        overwrite: true,
        onUpdate() { placeTab(tab, state.angle); },
        onComplete() {
          visualAngles[tabIndex] = desired;
          placeTab(tab, desired);
        }
      });
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetMonth = Number(tab.dataset.monthIndex);
      if (!Number.isFinite(targetMonth) || targetMonth === activeMonth) return;
      rotateMonth(Math.sign(targetMonth - activeMonth));
    });
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
      rotateMonth(direction, { focus: true });
    });
  });

  wheel.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (wheelLocked) return;
    wheelLocked = true;
    rotateMonth(event.deltaY > 0 ? 1 : -1);
    window.setTimeout(() => { wheelLocked = false; }, reducedMotion ? 80 : 520);
  }, { passive: false });

  if (window.Draggable) {
    gsap.registerPlugin(Draggable);
    const dragProxy = document.createElement('div');
    Draggable.create(dragProxy, {
      type: 'rotation',
      trigger: wheel,
      dragResistance: 0.08,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onPress() { gsap.set(dragProxy, { rotation: 0 }); },
      onDrag() {
        tabs.forEach((tab, tabIndex) => placeTab(tab, visualAngles[tabIndex] + this.rotation));
      },
      onRelease() {
        tabs.forEach((tab, tabIndex) => placeTab(tab, visualAngles[tabIndex]));
        if (Math.abs(this.rotation) > 8) rotateMonth(this.rotation < 0 ? 1 : -1);
        gsap.set(dragProxy, { rotation: 0 });
      }
    });
  }

  tabs.forEach((tab, tabIndex) => placeTab(tab, visualAngles[tabIndex]));
  setActiveMonth(activeMonth, { animatePanel: false });

  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  projectCards.forEach((card) => {
    const button = card.querySelector('.project-summary');
    const details = card.querySelector('.project-details');
    const action = card.querySelector('.project-action');

    button.addEventListener('click', () => {
      const opening = button.getAttribute('aria-expanded') !== 'true';

      projectCards.forEach((otherCard) => {
        const otherButton = otherCard.querySelector('.project-summary');
        const otherDetails = otherCard.querySelector('.project-details');
        const otherAction = otherCard.querySelector('.project-action');
        otherCard.classList.remove('is-open');
        otherButton.setAttribute('aria-expanded', 'false');
        otherAction.textContent = 'View case';
        otherDetails.hidden = true;
      });

      if (opening) {
        card.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        action.textContent = 'Close case';
        details.hidden = false;
        if (!reducedMotion) {
          gsap.fromTo(details, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: 'power2.out' });
        }
      }
    });
  });

  window.addEventListener('resize', () => {
    tabs.forEach((tab, tabIndex) => placeTab(tab, visualAngles[tabIndex]));
    alignActiveExperience();
  });
  requestAnimationFrame(alignActiveExperience);
});
