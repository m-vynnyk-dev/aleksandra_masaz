const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const menuOpenClass = 'site-nav--open';
const mobileMenuQuery = window.matchMedia('(max-width: 900px)');

const setMenuState = (isOpen) => {
  if (!menuToggle || !navigation) return;

  menuToggle.setAttribute('aria-expanded', String(isOpen));
  navigation.classList.toggle(menuOpenClass, isOpen);
};

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenuState(!isOpen);
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('.site-nav__link')) setMenuState(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuState(false);
});

document.addEventListener('click', (event) => {
  if (!navigation?.classList.contains(menuOpenClass)) return;
  if (navigation.contains(event.target) || menuToggle?.contains(event.target)) return;

  setMenuState(false);
});

window.addEventListener('resize', () => {
  if (!mobileMenuQuery.matches) setMenuState(false);
});

const serviceDetails = {
  classic: {
    title: 'Masaż klasyczny',
    description:
      'Techniki dopasowane do napięcia mięśni pomagają rozluźnić ciało, poprawić komfort ruchu i wspierają regenerację po wysiłku.',
    tags: ['napięcie mięśni', 'zmęczenie', 'regeneracja'],
  },
  'hot-stones': {
    title: 'Masaż gorącymi kamieniami',
    description:
      'Ciepło kamieni i spokojne ruchy pozwalają głębiej się rozluźnić. To dobry wybór, gdy ciało jest spięte, a głowa potrzebuje wyciszenia.',
    tags: ['głęboki relaks', 'stres', 'przyjemne ciepło'],
  },
  kobido: {
    title: 'Kobido',
    description:
      'Dynamiczny masaż twarzy łączy rozluźnienie mięśni, stymulację i pracę nad naturalnym konturem. Pozostawia twarz wypoczętą i odświeżoną.',
    tags: ['napięcie twarzy', 'naturalny lifting', 'świeży wygląd'],
  },
  'gua-sha': {
    title: 'Gua Sha',
    description:
      'Delikatna praca kamieniem wspiera naturalny odpływ limfy, pomaga zmniejszyć uczucie opuchnięcia i przywrócić twarzy lekkość.',
    tags: ['opuchnięcie', 'pielęgnacja twarzy', 'lekkość'],
  },
  relaxation: {
    title: 'Masaż relaksacyjny',
    description:
      'Powolne, łagodne ruchy sprzyjają wyciszeniu i pozwalają odpuścić napięcie całego dnia. Idealny wtedy, gdy najbardziej potrzebujesz zatrzymania.',
    tags: ['stres', 'przebodźcowanie', 'spokojny odpoczynek'],
  },
  'lomi-lomi': {
    title: 'Lomi Lomi',
    description:
      'Płynne, szerokie ruchy przedramion obejmują całe ciało i tworzą spokojny, rytmiczny masaż, który pomaga odzyskać poczucie harmonii.',
    tags: ['pełne wyciszenie', 'zmęczenie', 'harmonia ciała'],
  },
};

const serviceDialog = document.querySelector('.service-dialog');
const serviceDialogTitle = document.querySelector('.service-dialog__title');
const serviceDialogDescription = document.querySelector('.service-dialog__description');
const serviceDialogTags = document.querySelector('.service-dialog__tags');
const serviceDialogClose = document.querySelector('.service-dialog__close');
const serviceDialogButton = document.querySelector('.service-dialog__button');
const serviceTriggers = [...document.querySelectorAll('.service-card__trigger')];
let activeServiceTrigger;

const clearActiveService = () => {
  activeServiceTrigger?.closest('.service-card')?.classList.remove('service-card--active');
  activeServiceTrigger = undefined;
};

const openServiceDialog = (trigger) => {
  const service = serviceDetails[trigger.dataset.service];

  if (!serviceDialog || !serviceDialogTitle || !serviceDialogDescription || !serviceDialogTags) {
    return;
  }

  if (!service) return;

  clearActiveService();
  activeServiceTrigger = trigger;
  trigger.closest('.service-card')?.classList.add('service-card--active');

  serviceDialogTitle.textContent = service.title;
  serviceDialogDescription.textContent = service.description;
  serviceDialogTags.replaceChildren(
    ...service.tags.map((tag) => {
      const item = document.createElement('li');
      item.className = 'service-dialog__tag';
      item.textContent = tag;
      return item;
    }),
  );

  serviceDialog.showModal();
};

serviceTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => openServiceDialog(trigger));
});

serviceDialogClose?.addEventListener('click', () => serviceDialog?.close());
serviceDialogButton?.addEventListener('click', () => serviceDialog?.close());

serviceDialog?.addEventListener('click', (event) => {
  const dialogBounds = serviceDialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < dialogBounds.left ||
    event.clientX > dialogBounds.right ||
    event.clientY < dialogBounds.top ||
    event.clientY > dialogBounds.bottom;

  if (clickedOutside) serviceDialog.close();
});

serviceDialog?.addEventListener('close', clearActiveService);

const carouselViewport = document.querySelector('.reviews-carousel__viewport');
const carouselSlides = [...document.querySelectorAll('.reviews-carousel__slide')];
const carouselIndicators = [...document.querySelectorAll('.reviews-carousel__indicator')];
const previousReviewButton = document.querySelector('.reviews-carousel__control--previous');
const nextReviewButton = document.querySelector('.reviews-carousel__control--next');
const carouselStatus = document.querySelector('.reviews-carousel__status');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (
  carouselViewport &&
  carouselSlides.length &&
  carouselIndicators.length === carouselSlides.length &&
  previousReviewButton &&
  nextReviewButton
) {
  let activeSlideIndex = 0;
  let scrollFrame;

  const updateCarouselState = (slideIndex) => {
    activeSlideIndex = slideIndex;

    carouselIndicators.forEach((indicator, indicatorIndex) => {
      const isActive = indicatorIndex === activeSlideIndex;

      indicator.classList.toggle('reviews-carousel__indicator--active', isActive);
      indicator.toggleAttribute('aria-current', isActive);
      indicator.tabIndex = isActive ? 0 : -1;
    });

    previousReviewButton.disabled = activeSlideIndex === 0;
    nextReviewButton.disabled = activeSlideIndex === carouselSlides.length - 1;

    if (carouselStatus) {
      carouselStatus.textContent = `Opinia ${activeSlideIndex + 1} z ${carouselSlides.length}`;
    }
  };

  const scrollToReview = (slideIndex, behavior = 'smooth') => {
    const nextSlideIndex = Math.min(Math.max(slideIndex, 0), carouselSlides.length - 1);

    carouselViewport.scrollTo({
      left: carouselSlides[nextSlideIndex].offsetLeft,
      behavior: reduceMotionQuery.matches ? 'auto' : behavior,
    });
    updateCarouselState(nextSlideIndex);
  };

  const updateActiveReviewFromScroll = () => {
    const closestSlideIndex = carouselSlides.reduce((closestIndex, slide, slideIndex) => {
      const currentDistance = Math.abs(slide.offsetLeft - carouselViewport.scrollLeft);
      const closestDistance = Math.abs(
        carouselSlides[closestIndex].offsetLeft - carouselViewport.scrollLeft,
      );

      return currentDistance < closestDistance ? slideIndex : closestIndex;
    }, 0);

    updateCarouselState(closestSlideIndex);
  };

  previousReviewButton.addEventListener('click', () => scrollToReview(activeSlideIndex - 1));
  nextReviewButton.addEventListener('click', () => scrollToReview(activeSlideIndex + 1));

  carouselIndicators.forEach((indicator, slideIndex) => {
    indicator.addEventListener('click', () => scrollToReview(slideIndex));
  });

  carouselViewport.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();
    scrollToReview(activeSlideIndex + (event.key === 'ArrowRight' ? 1 : -1));
  });

  carouselViewport.addEventListener('scroll', () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(updateActiveReviewFromScroll);
  });

  window.addEventListener('resize', () => scrollToReview(activeSlideIndex, 'auto'));

  updateCarouselState(activeSlideIndex);
}
