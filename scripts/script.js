import PETS from "./pets.js";

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
const sliderLeftItems = sliderContent.querySelector('.slider__content-item--left');
const sliderRightItems = sliderContent.querySelector('.slider__content-item--right');
const sliderActiveItems = sliderContent.querySelector('.slider__content-item--active');



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
function moveSliderPrev (e) {
  sliderContent.classList.add('slider__content--anim-left');
  sliderButtonPrev.removeEventListener('click', moveSliderPrev);
  sliderButtonNext.removeEventListener('click', moveSliderNext);
}
sliderButtonPrev.addEventListener('click', moveSliderPrev);

function moveSliderNext (e) {
  sliderContent.classList.add('slider__content--anim-right');
  sliderButtonPrev.removeEventListener('click', moveSliderPrev);
  sliderButtonNext.removeEventListener('click', moveSliderNext);
}
sliderButtonNext.addEventListener('click', moveSliderNext);

sliderContent.addEventListener('transitionend', (e) => {
  if (e.target === sliderContent) {
    const isLeft = sliderContent.classList.contains('slider__content--anim-left');
    let newItems;
    if (isLeft) {
      sliderContent.classList.remove('slider__content--anim-left');
  
      newItems = sliderLeftItems;
      sliderActiveItems.innerHTML =  sliderLeftItems.innerHTML;
  
    } else {
      sliderContent.classList.remove('slider__content--anim-right');
      newItems = sliderRightItems;
      sliderActiveItems.innerHTML  =  sliderRightItems.innerHTML;
    }
  
    newItems.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      newItems.appendChild(createCard());
    }
    
    sliderButtonPrev.addEventListener('click', moveSliderPrev);
    sliderButtonNext.addEventListener('click', moveSliderNext);
  }
});

let activeCards = [];
let nextCards = [];
let prevCards = [];
function generateFirstCards() {
  let i = 0;
  while (i !== 3) {
    const cardNumber =  Math.floor(Math.random() * 8);
    if (!activeCards.includes(cardNumber)) {
      activeCards.push(cardNumber);
      i++;
    } 
  }
}

function generateNextCards() {
  let i = 0;
  while (i !== 3) {
    const cardNumber =  Math.floor(Math.random() * 8);
    if (!activeCards.includes(cardNumber) && !nextCards.includes(cardNumber)) {
      nextCards.push(cardNumber);
      i++;
    } 
  }
}

function generatePrevCards() {
  let i = 0;
  while (i !== 3) {
    const cardNumber =  Math.floor(Math.random() * 8);
    if (!activeCards.includes(cardNumber) && !prevCards.includes(cardNumber)) {
      prevCards.push(cardNumber);
      i++;
    } 
  }
}
function initializeSlider () {
  generateFirstCards();
  generateNextCards();
  generatePrevCards();



}
function createCard() {
  const cardNumber = Math.floor(Math.random() * 8);

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
  card.classList.add('slider__item');
  card.appendChild(img);
  card.appendChild(descriptionText);
  card.appendChild(button);

  return card;
}