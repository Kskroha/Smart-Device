import {iosVhFix} from './utils/ios-vh-fix';
import {initModals} from './modules/modals/init-modals';
import {Form} from './modules/form-validate/form';
import {initAccordions} from './modules/accordion/init-accordion';
import {initPhoneMask} from './vendor/phone-mask';
import smoothscroll from 'smoothscroll-polyfill';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {
  const scrollBtn = document.querySelector('.hero__button');
  const mainForm = document.querySelector('.contact');
  const showMoreBtn = document.querySelector('.company__button');
  const hiddenText = document.querySelector('.company__hidden');
  const mobileHiddenText = document.querySelector('.company__mobile-hidden');

  let isTextShown = false;
  // Utils
  // ---------------------------------
  smoothscroll.polyfill();
  iosVhFix();

  // Modules
  initAccordions();
  initPhoneMask();

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  scrollBtn.addEventListener('click', () => {
    mainForm.scrollIntoView({behavior: 'smooth'});
  });

  showMoreBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    if (isTextShown === false) {
      hiddenText.classList.remove('company__hidden');
      mobileHiddenText.classList.remove('company__mobile-hidden');
      showMoreBtn.textContent = 'Свернуть';
      isTextShown = !isTextShown;
      return;
    }
    hiddenText.classList.add('company__hidden');
    mobileHiddenText.classList.add('company__mobile-hidden');
    showMoreBtn.textContent = 'Подробнее';
    isTextShown = !isTextShown;
  });

  window.addEventListener('load', () => {
    initModals();
    const form = new Form();
    window.form = form;
    form.init();
    window.focusLock.lock('modal__content form');
  });
});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используется matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
