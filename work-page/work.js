document.addEventListener('DOMContentLoaded', () => {
  const wheel = document.querySelector('.timeline-wheel');
  const rotor = document.querySelector('.timeline-rotor');
  const experienceSection = document.querySelector('.experience-section');
  const experienceList = document.querySelector('.experience-list');
  const tabs = Array.from(document.querySelectorAll('.timeline-tab'));
  const panels = Array.from(document.querySelectorAll('.experience-card'));

  if (!wheel || !rotor || tabs.length !== 3 || panels.length !== 3 || !window.gsap) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let wheelLocked = false;
  let visualAngles = [0, 60, -60];

  const modulo = (value, length) => ((value % length) + length) % length;

  function slotAngle(tabIndex, selectedIndex) {
    const relative = modulo(tabIndex - selectedIndex, tabs.length);
    return relative === 0 ? 0 : relative === 1 ? 60 : -60;
  }

  function placeTab(tab, angle) {
    const radius = rotor.getBoundingClientRect().width / 2 - 0.5;
    const radians = angle * Math.PI / 180;
    gsap.set(tab, {
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
      rotation: 0
    });
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

  function setActive(index, animatePanel = true) {
    const nextIndex = modulo(index, tabs.length);
    if (nextIndex === activeIndex && panels[nextIndex].classList.contains('is-active')) return;

    activeIndex = nextIndex;
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === activeIndex;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

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

  function rotateTo(index, { focus = false } = {}) {
    const nextIndex = modulo(index, tabs.length);
    if (nextIndex === activeIndex) return;
    const direction = modulo(nextIndex - activeIndex, tabs.length) === 1 ? 1 : -1;
    setActive(nextIndex);

    tabs.forEach((tab, tabIndex) => {
      const desired = slotAngle(tabIndex, nextIndex);
      const state = { angle: visualAngles[tabIndex] };
      let target = desired;

      if (direction > 0) while (target >= state.angle) target -= 360;
      else while (target <= state.angle) target += 360;

      gsap.to(state, {
        angle: target,
        duration: reducedMotion ? 0 : 0.72,
        ease: 'power3.inOut',
        overwrite: true,
        onUpdate() { placeTab(tab, state.angle); },
        onComplete() {
          visualAngles[tabIndex] = desired;
          placeTab(tab, desired);
          if (focus && tabIndex === nextIndex) tab.focus({ preventScroll: true });
        }
      });
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => rotateTo(index));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
      rotateTo(activeIndex + direction, { focus: true });
    });
  });

  wheel.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (wheelLocked) return;
    wheelLocked = true;
    rotateTo(activeIndex + (event.deltaY > 0 ? 1 : -1));
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
        if (Math.abs(this.rotation) > 8) rotateTo(activeIndex + (this.rotation < 0 ? 1 : -1));
        gsap.set(dragProxy, { rotation: 0 });
      }
    });
  }

  tabs.forEach((tab, tabIndex) => placeTab(tab, visualAngles[tabIndex]));
  setActive(0, false);

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
