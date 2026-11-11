const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const menuOpenClass = 'site-nav--open';
const pageLockedClass = 'page--scroll-locked';
const mobileMenuQuery = window.matchMedia('(max-width: 900px)');
const pageLockReasons = new Set();

const setPageScrollLock = (reason, shouldLock) => {
  if (shouldLock) {
    pageLockReasons.add(reason);
  } else {
    pageLockReasons.delete(reason);
  }

  const isPageLocked = pageLockReasons.size > 0;

  document.documentElement.classList.toggle(pageLockedClass, isPageLocked);
  document.body.classList.toggle(pageLockedClass, isPageLocked);
};

const syncMenuScrollLock = () => {
  if (!navigation) return;

  const menuBounds = navigation.getBoundingClientRect();
  const isMenuOpen = navigation.classList.contains(menuOpenClass);
  const isMenuFullscreen =
    menuBounds.width >= window.innerWidth - 1 && menuBounds.height >= window.innerHeight - 1;

  setPageScrollLock('menu', isMenuOpen && isMenuFullscreen);
};

const setMenuState = (isOpen) => {
  if (!menuToggle || !navigation) return;

  const shouldOpen = mobileMenuQuery.matches && isOpen;

  menuToggle.setAttribute('aria-expanded', String(shouldOpen));
  navigation.classList.toggle(menuOpenClass, shouldOpen);
  navigation.inert = mobileMenuQuery.matches && !shouldOpen;
  syncMenuScrollLock();
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

mobileMenuQuery.addEventListener('change', () => setMenuState(false));
window.addEventListener('resize', syncMenuScrollLock);

setMenuState(false);

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
  setPageScrollLock('service-dialog', true);
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

serviceDialog?.addEventListener('close', () => {
  clearActiveService();
  setPageScrollLock('service-dialog', false);
});

const contactFormEndpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT?.trim() ?? '';
const contactDialog = document.querySelector('.contact-dialog');
const contactDialogClose = document.querySelector('.contact-dialog__close');
const contactOpenTriggers = [...document.querySelectorAll('[data-contact-open]')];
const contactForm = document.querySelector('.contact-form');
const contactFormContext = document.querySelector('.contact-form__context');
const contactFormService = document.querySelector('.contact-form__service');
const contactFormServiceName = document.querySelector('.contact-form__service-name');
const contactFormSubmit = document.querySelector('.contact-form__submit');
const contactFormSubmitLabel = document.querySelector('.contact-form__submit-label');
const contactFormStatus = document.querySelector('.contact-form__status');
let contactRequestController;

const setContactFormStatus = (message = '', type = '') => {
  if (!contactFormStatus) return;

  contactFormStatus.textContent = message;
  contactFormStatus.hidden = !message;
  contactFormStatus.classList.remove(
    'contact-form__status--demo',
    'contact-form__status--success',
    'contact-form__status--error',
  );

  if (type) contactFormStatus.classList.add(`contact-form__status--${type}`);
};

const setContactFormPending = (isPending) => {
  if (contactForm) contactForm.setAttribute('aria-busy', String(isPending));
  if (contactFormSubmit) contactFormSubmit.disabled = isPending;
  if (contactFormSubmitLabel) {
    contactFormSubmitLabel.textContent = isPending ? 'Wysyłanie…' : 'Wyślij zapytanie';
  }
};

const openContactDialog = (trigger) => {
  if (!contactDialog) return;

  const selectedService =
    trigger === serviceDialogButton ? (serviceDialogTitle?.textContent.trim() ?? '') : '';

  if (contactFormContext) contactFormContext.value = selectedService;
  if (contactFormServiceName) contactFormServiceName.textContent = selectedService;
  if (contactFormService) contactFormService.hidden = !selectedService;

  setMenuState(false);
  if (serviceDialog?.open) serviceDialog.close();

  setContactFormStatus();
  contactDialog.showModal();
  setPageScrollLock('contact-dialog', true);
};

contactOpenTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openContactDialog(trigger);
  });
});

contactDialogClose?.addEventListener('click', () => contactDialog?.close());

contactDialog?.addEventListener('click', (event) => {
  const dialogBounds = contactDialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < dialogBounds.left ||
    event.clientX > dialogBounds.right ||
    event.clientY < dialogBounds.top ||
    event.clientY > dialogBounds.bottom;

  if (clickedOutside) contactDialog.close();
});

contactDialog?.addEventListener('close', () => {
  contactRequestController?.abort();
  contactRequestController = undefined;
  setContactFormPending(false);
  setContactFormStatus();
  setPageScrollLock('contact-dialog', false);
});

contactForm?.addEventListener('input', () => setContactFormStatus());

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const formData = new FormData(contactForm);
  const honeypotValue = String(formData.get('website') ?? '').trim();

  if (honeypotValue) {
    contactForm.reset();
    setContactFormStatus('Dziękujemy. Wiadomość została przyjęta.', 'success');
    return;
  }

  if (!contactFormEndpoint) {
    setContactFormStatus(
      'To wersja demonstracyjna — wiadomość nie została wysłana. Po akceptacji formularz zostanie połączony z Telegramem.',
      'demo',
    );
    return;
  }

  const requestController = new AbortController();
  contactRequestController = requestController;
  setContactFormPending(true);
  setContactFormStatus();

  const payload = {
    name: String(formData.get('name') ?? '').trim(),
    phone: String(formData.get('phone') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    message: String(formData.get('message') ?? '').trim(),
    service: String(formData.get('service') ?? '').trim(),
    contactConsent: formData.get('contactConsent') === 'on',
    source: window.location.href,
  };

  try {
    const response = await fetch(contactFormEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: requestController.signal,
    });

    if (!response.ok) throw new Error(`Contact form request failed: ${response.status}`);

    contactForm.reset();
    setContactFormStatus(
      'Dziękujemy. Wiadomość została wysłana — Aleksandra odezwie się wkrótce.',
      'success',
    );
  } catch (error) {
    if (error.name === 'AbortError') return;

    setContactFormStatus(
      'Nie udało się wysłać wiadomości. Spróbuj ponownie lub skontaktuj się telefonicznie.',
      'error',
    );
  } finally {
    if (contactRequestController === requestController) {
      contactRequestController = undefined;
      setContactFormPending(false);
    }
  }
});

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
