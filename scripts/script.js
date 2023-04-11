import PETS from "./pets.js";
alert("Уважаемые проверяющие! К сожалению еще не успела доделать эту часть задания. Еще ведется работа над сайтом. Если есть возможность, пожалуйста проверьте мою работу как можно ближе к дедлайну проверки. Заранее спасибо");

// MENU
const page = document.querySelector('.page');
const navButton = document.querySelector('.nav-button');
const nav = document.querySelector('.nav');
const navItems = [... document.querySelectorAll('.nav__item')];

// CAROUSEL
const sliderButtonPrev = document.querySelector('.slider__arrow--prev');
const sliderButtonNext = document.querySelector('.slider__arrow--next');

const sliderContainer = document.querySelector('.slider__container');
const sliderContent = sliderContainer.querySelector('.slider__content');
const sliderPrevItems = sliderContent.querySelector('.slider__content-item--left');
const sliderNextItems = sliderContent.querySelector('.slider__content-item--right');
const sliderActiveItems = sliderContent.querySelector('.slider__content-item--active');


let activeCards = [];
let nextCards = [];
let prevCards = [];

const CARD__WIDTH = 270;
let cardsNumber = 3;
let sliderWidthItems = sliderContainer.clientWidth;
let gapSlides = 90;
let translateX = 990 + gapSlides;

// POPUP
const sliderModal = document.querySelector('.slider-modal');
const sliderModalButton = sliderModal.querySelector('.slider-modal__button');

// MENU-FUNCTIONS
const toggleMenu = () => {
  const isOpen = navButton.classList.contains('nav-button--open');
  navButton.classList.toggle('nav-button--open');
  nav.classList.toggle('nav--open');
  page.classList.toggle('page--clip');
}

navButton.addEventListener('click', (e) => {
  e.stopPropagation();

  toggleMenu();
});

navItems.forEach(element => {
  element.addEventListener('click', e => {
    toggleMenu(); 
  });
});

document.addEventListener('click', e => {
  const target = e.target;
  const isNav = target == nav || nav.contains(target);
  const isNavButton = target == navButton;
  const isNavOpen = nav.classList.contains('nav--open');

  if (!isNav && !isNavButton && isNavOpen) {
    toggleMenu();
  }
});

window.addEventListener('resize', function() {
  if (document.documentElement.clientWidth > 767) {
    navButton.classList.remove('nav-button--open');
    page.classList.remove('page--clip');
    nav.classList.remove('nav--open');
  }
}, false);

// SLIDER-FUNCTIONS
setSliderCardsNumber();
setSliderSizes();
initializeSlider();

window.addEventListener('resize', function() {
  setSliderCardsNumber();
  setSliderSizes();
  initializeSlider();
}, false);

function setSliderCardsNumber() {
  if (document.documentElement.clientWidth >= 1132) {
    cardsNumber = 3;
  }

  if (document.documentElement.clientWidth < 1132 && document.documentElement.clientWidth >= 768) {
    cardsNumber = 2;
  }

  if (document.documentElement.clientWidth < 768) {
    cardsNumber = 1;
  }
}

function setSliderSizes() {
  const containerWidth = sliderContainer.clientWidth;
  
  let gapNumber = (cardsNumber-1) > 0 ? cardsNumber-1 : 1;
  gapSlides = Math.floor((containerWidth - CARD__WIDTH * cardsNumber)/gapNumber);
  translateX = containerWidth + gapSlides;
  if (cardsNumber == 1) translateX = CARD__WIDTH + gapSlides/2;

  let gapStr = "gap:" + gapSlides +"px;";
  let translateXStr = "transform: translateX(-" + translateX + "px);";

  sliderContent.style = gapStr + translateXStr;
  sliderPrevItems.style = gapStr;
  sliderActiveItems.style = gapStr;
  sliderButtonNext.style = gapStr;
}

function setAnimLeft() {
  
  let gapStr = "gap:" + gapSlides +"px;";

  if (cardsNumber == 1) {

    sliderContent.style =  "gap:" + gapSlides +"px;" +
                           "transform: translateX("+gapSlides/2+"px);" +
                           "transition: transform  0.7s cubic-bezier(.65, 0, .35, 1);";
  } else {
    sliderContent.style =  "gap:" + gapSlides +"px;" +
                           "transform: translateX(0);" +
                           "transition: transform  0.7s cubic-bezier(.65, 0, .35, 1);";
  }
  sliderPrevItems.style = gapStr;
  sliderActiveItems.style = gapStr;
  sliderNextItems.style = gapStr;
}

function setAnimRight() {
  let gapStr = "gap:" + gapSlides +"px;";
  if (cardsNumber == 1) {
    sliderContent.style = "gap:" + gapSlides +"px;" +
                          "transform: translateX(-" + (CARD__WIDTH*2 + gapSlides + gapSlides/2) + "px);" +
                          "transition: transform  0.7s cubic-bezier(.65, 0, .35, 1);";
  } else {
    sliderContent.style = "gap:" + gapSlides +"px;" +
                          "transform: translateX(calc(-200% - " + gapSlides*2 + "px));" +
                          "transition: transform  0.7s cubic-bezier(.65, 0, .35, 1);";
  }
  sliderPrevItems.style = gapStr;
  sliderActiveItems.style = gapStr;
  sliderNextItems.style = gapStr;
}

function setAnimCenter() {
  let gapStr = "gap:" + gapSlides +"px;";
  sliderContent.style = "gap:" + gapSlides +"px;" +
                        "transform: translateX(-" + translateX + "px);";
  sliderPrevItems.style = gapStr;
  sliderActiveItems.style = gapStr;
  sliderNextItems.style = gapStr;
}

function moveSliderPrev (e) {
  sliderContent.classList.add('slider__content--anim-left');
  setAnimLeft();

  sliderButtonPrev.removeEventListener('click', moveSliderPrev);
  sliderButtonNext.removeEventListener('click', moveSliderNext);
}
sliderButtonPrev.addEventListener('click', moveSliderPrev);

function moveSliderNext (e) {
  sliderContent.classList.add('slider__content--anim-right');
  setAnimRight();

  sliderButtonPrev.removeEventListener('click', moveSliderPrev);
  sliderButtonNext.removeEventListener('click', moveSliderNext);
}
sliderButtonNext.addEventListener('click', moveSliderNext);

sliderContent.addEventListener('transitionend', (e) => {
  if (e.target === sliderContent) {
    const isPrev = sliderContent.classList.contains('slider__content--anim-left');

    if (isPrev) {
      sliderContent.classList.remove('slider__content--anim-left');
      setAnimCenter();
      sliderActiveItems.innerHTML =  sliderPrevItems.innerHTML;

      activeCards = prevCards;
      generatePrevCards();
      createSetCards(sliderPrevItems, prevCards);
  
    } else {
      sliderContent.classList.remove('slider__content--anim-right');
      setAnimCenter();
      sliderActiveItems.innerHTML  =  sliderNextItems.innerHTML;

      activeCards = nextCards;
      generateNextCards();
      createSetCards(sliderNextItems, nextCards);
    }
    
    sliderButtonPrev.addEventListener('click', moveSliderPrev);
    sliderButtonNext.addEventListener('click', moveSliderNext);
  }
});

function generateActiveCards() {
  let i = 0;
  activeCards = [];
  while (i !== cardsNumber) {
    const cardNumber =  Math.floor(Math.random() * 8);
    if (!activeCards.includes(cardNumber)) {
      activeCards.push(cardNumber);
      i++;
    } 
  }
}

function generateNextCards() {
  let i = 0;
  nextCards = [];
  while (i !== cardsNumber) {
    const cardNumber =  Math.floor(Math.random() * 8);
    if (!activeCards.includes(cardNumber) && !nextCards.includes(cardNumber)) {
      nextCards.push(cardNumber);
      i++;
    } 
  }
}

function generatePrevCards() {
  let i = 0;
  prevCards = [];
  while (i !== cardsNumber) {
    const cardNumber =  Math.floor(Math.random() * 8);
    if (!activeCards.includes(cardNumber) && !prevCards.includes(cardNumber)) {
      prevCards.push(cardNumber);
      i++;
    } 
  }
}

function initializeSlider () {
  generateActiveCards();
  generatePrevCards();
  generateNextCards();

  createSetCards(sliderActiveItems, activeCards);
  createSetCards(sliderPrevItems, prevCards);
  createSetCards(sliderNextItems, nextCards);
}

function createCard(cardNumber) {
  const img = document.createElement('img');
  img.classList.add('slider__img');
  img.src = PETS[cardNumber].img;
  img.alt = PETS[cardNumber].type;

  const descriptionText = document.createElement('p');
  descriptionText.classList.add('slider__title');
  descriptionText.innerText = PETS[cardNumber].name;

  const span = document.createElement('span');
  span.innerText = 'Learn more';

  const button = document.createElement('button');
  button.classList.add('slider__button');
  button.classList.add('button');
  button.classList.add('button--light');
  button.appendChild(span);

  const card = document.createElement('li');
  card.dataset.id = cardNumber;
  card.classList.add('slider__item');
  card.appendChild(img);
  card.appendChild(descriptionText);
  card.appendChild(button);

  return card;
}

function createSetCards(elem, setNumbers) {
  elem.innerHTML = '';
  for (let i = 0; i < cardsNumber; i++) {
    elem.appendChild(createCard(setNumbers[i]));
  }
}

// POPUP-FUNCTIONS

// open
sliderActiveItems.addEventListener("click", (e) => {
  const activeElement = e.target;
  if (activeElement !== sliderActiveItems) {
    const activeCardNumber = activeElement.closest(".slider__item").dataset.id;
    setModalContent(activeCardNumber);
    sliderModal.classList.add('slider-modal--open');
    page.classList.add('page--clip');
  }
});

sliderModal.addEventListener("click", (e) => {
  if ((e.target == sliderModal) || (e.target == sliderModalButton)) {
    sliderModal.classList.remove('slider-modal--open');
    page.classList.remove('page--clip');
  }
})

function setModalContent(activeCardNumber) {
  const img = sliderModal.querySelector('.slider-modal__img');
  img.setAttribute('src', PETS[activeCardNumber].imgmodal);

  const title = sliderModal.querySelector('.slider-modal__title');
  title.innerText = PETS[activeCardNumber].name;
  
  const subtitle = sliderModal.querySelector('.slider-modal__subtitle');
  subtitle.innerText = PETS[activeCardNumber].type +" - "+ PETS[activeCardNumber].breed;
  
  const description = sliderModal.querySelector('.slider-modal__description');
  description.innerText = PETS[activeCardNumber].description;
  
  const age = sliderModal.querySelector('.slider-modal__item--age');
  age.querySelector('.slider-modal__normal').innerText = PETS[activeCardNumber].age;
  
  const inoculations = sliderModal.querySelector('.slider-modal__item--inoculations');
  inoculations.querySelector('.slider-modal__normal').innerText = PETS[activeCardNumber].inoculations;
  
  const diseases = sliderModal.querySelector('.slider-modal__item--diseases');
  diseases.querySelector('.slider-modal__normal').innerText = PETS[activeCardNumber].diseases;
  
  const parasites = sliderModal.querySelector('.slider-modal__item--parasites');
  parasites.querySelector('.slider-modal__normal').innerText = PETS[activeCardNumber].parasites;

  
}