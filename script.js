"use strict";

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
///////////////////////////////////////
// Modal window

//functions
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

//Event handler
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
//--implementing smooth scrolling

btnScrollTo.addEventListener("click", function (e) {
  // const s1coords = section1.getBoundingClientRect(); // will return where we want to scroll
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log(
  //   "Current scroll (X/Y)",
  //   window.pageXOffset || window.scrollX,
  //   window.pageYOffset || window.scrollY
  // );
  // console.log(
  //   "Height/Width viewport",
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );
  //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.scrollX || window.pageXOffset, // pageXOffset is deprecated
  //   s1coords.top + window.scrollY || window.pageYOffset
  // ); // to get the position of the document relative to the window
  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: "smooth", //behavior is used to set the scroll smooth
  // });
  //For modern JavaScript
  section1.scrollIntoView({ behavior: "smooth" });
});

//Page Navigation
// document.querySelectorAll(".nav__link").forEach(function (e) {
//   e.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

//Using event delegation because the above function will create a copy for every ele in the nav that is not efficient instead we use event bubble

//1.Add event listener to common parent element
//2.Determine what ele originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//Tabbed component
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

// tabs.forEach((t) => t.addEventListener("click", () => console.log("Tabs"))); // we would have 200 copies if we have 200 tabs
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  // console.log(clicked);

  // Guard clause
  if (!clicked) return;

  //Removing the active tabs
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));
  clicked.classList.add("operations__tab--active");
  //Activate content area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const sibling = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    sibling.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
const nav = document.querySelector(".nav");
// passing the argument with this keyword
nav.addEventListener("mouseover", handleHover.bind(0.5)); // bind return a new function which is mapped to the parent function
nav.addEventListener("mouseout", handleHover.bind(1));

//Sticky Navigation
// the given method is not efficient\
/*
const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
window.addEventListener("scroll", function (e) {
  // console.log(this.window.scrollY);
  if (this.window.scrollY > initialCoords.top) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
});
*/
//Sticky navigation: Intersection Observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// }; // the entries are the threshold entries
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions); // the obsCallback will fire when the obsOptions are met
// observer.observe(section1);

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Revel section
const allSections = document.querySelectorAll("section");
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add("section--hidden");
});

//Lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

//Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  //code to remove later just for debugging
  /*
const slider = document.querySelector(".slider");
slider.style.transform = "scale(0.5)";
slider.style.overflow = "visible";
*/

  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");
  let curSlide = 0;

  //functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `
      <button class="dots__dot" data-slide="${i}"></button>
    `
      );
    });
  };
  createDots();

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };
  activateDot(0);

  const maxSlide = slides.length;
  //next slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    ); //curSlide:100%,0%,100%,200%
  };
  // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`)); //0%,100%,200%,300%
  goToSlide(0);
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    // console.log("next");
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  };

  //Event handler
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    // console.log(e);
    if (e.key === "ArrowLeft") prevSlide();
    //Using the short circuiting
    e.key === "ArrowRight" && nextSlide();
  });
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//lecture
// //------------------------Selecting, creating and Deleting the Element--------------------------------//
// console.log(document.documentElement); // We select the entire document element of the page
// console.log(document.body);
// console.log(document.head);

// // to select an element of html
// const header = document.querySelector(".header");
// //to select multiple element of the html
// const allSections = document.querySelectorAll(".section"); // will return an node list that contains all of the elements
// console.log(allSections);
// // to select an ID
// document.getElementById("section--1");
// const allButtons = document.getElementsByTagName("button"); // return an html collection
// console.log(allButtons);

// console.log(document.getElementsByClassName("btn"));

// //----------------------------------Creating and inserting element-------------------------------------//
// //.insertAdjacentHTML
// const message = document.createElement("div"); // creating an Element, return an element that we can save and use
// message.classList.add("cookie-message");
// message.innerHTML =
//   "We use cookies for improved functionality and analytics.<button class ='btn btn--close-cookie'>Got it!</button>";
// // header.prepend(message); // to add html before the header
// header.append(message); // to add html at last of the header
// // header.append(message.cloneNode(true)); // to add multiple element. close node will copy all the element of the html so that we can use it later
// // header.before(message); // to add ele before  this are sibling of the header
// // header.after(message); // to add ele after

// //-----------------------Deleting the ele-----------------------------------------//
// document.querySelector(".btn--close-cookie").addEventListener("click", () => {
//   message.remove(); // this is added recently before that we used to select the parent element and then remove the child ele
//   // message.parentElement.removeChild(message);
// });
// //--------------------------------------style, attributes and classes---------------------//
// // Styles (inLine style)
// message.style.backgroundColor = "#37383d";
// message.style.width = "120%";
// console.log(message.style.height); // this will only work for inline style
// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message)); // to get style of the element that is not inline style
// console.log(getComputedStyle(message).color); // to get particular style

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + "px";

// //set Property is used to set the property of the css
// document.documentElement.style.setProperty("--color-primary", "orangered");

// //-------------------Attributes---------------------------------------//
// //reading the attributes
// const logo = document.querySelector(".nav__logo");
// console.log(logo);
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);
// console.log(logo.classList); // will return multiple class list

// //non standard attributes
// console.log(logo.designer);
// console.log(logo.getAttribute("designer"));

// //to set the attributes
// logo.alt = "Beautiful minimalist logo";
// console.log(logo.alt);
// logo.setAttribute("company", "Bankist");
// console.log(logo.src);
// console.log(logo.getAttribute("src"));

// //also works on the links
// const link = document.querySelector(".twitter-link");
// console.log(link.href);

// //data attributes
// console.log(logo.dataset.versionNumber);

// //classes
// logo.classList.add();
// logo.classList.remove();
// logo.classList.toggle();
// logo.classList.contains(); // not includes for like array

// //Don't use because it will over write all the class name and just set to one
// // logo.className = 'Adarsh';

//-----------------Events and Event Handler-------------------------------//
// Event is the certain signal that is generated in the dom node
// const h1 = document.querySelector("h1");

// //using the addEventListener (can add multiple events, remove an eventHandler)
// const alertH1 = function (e) {
//   alert("addEventListener: Great! You are reading the heading :D");
//   // to remove an eventListener
//   // h1.removeEventListener("mouseenter", alertH1);
// };
// h1.addEventListener("mouseenter", alertH1);
// //to remove an event lister after sometime
// setTimeout(() => h1.removeEventListener("mouseenter", alertH1), 3000);
// another method to attach the event listener (old way)
// h1.onmouseenter = function (e) {
//   alert("onmouseenter: Great! you are reading the heading :D");
// };

//Not be used
// html attribute
//<h1 onclick="alert("html")>Hello</h1>

//----------------------Event Bubbling and Capturing----------------------------------//
//1.Capture phase: when we click at the event the event start with link but it is generated at the document level and pass along the child ele
//2.Target phase: when it reach the child element Target phase will start
//3. Bubbling phase: Simply put the event will bubble up from the target to the document root (it will pass all the parent ele)

// //---------------------Event propagation in practice---------------------------------//
// //rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   console.log("Link", e.target, e.currentTarget); // current target will return the target in which the event is taking place
//   this.style.backgroundColor = randomColor();
//   console.log(e.currentTarget === this); // the current event will be same has the this keyword

//   // we can stop the propagation of the event
//   // e.stopPropagation();
// });
// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   console.log("Container:", e.target);
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector(".nav").addEventListener(
//   "click",
//   function (e) {
//     console.log("Nav:", e.target);
//     this.style.backgroundColor = randomColor();
//   },
//   true
// ); // by setting the value to true we can force the event not o bubble but to capture the event
// // the event handler keeps happing in the bubble of the parent element and the target element will be the sme for all 3 ele, all three will receive the exact same event e

//---------------------------Dom Traversing----------------------------//

// const h1 = document.querySelector("h1");

// // Going downwards: child
// console.log(h1.querySelectorAll(".highlight"));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = "white";

// //going upwards:parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// // the closest ele finds the parent
// h1.closest(".header").style.background = "var(--gradient-secondary)";

// h1.closest("h1").style.background = "var(--gradient-primary)";

// // Going sideways: siblings we can only access the direct siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = "scale(0.5)";
// });

//---------------------lifecycle DOM Events--------------------------//
//this code is fired as soon has the html is converted into the device
// document.addEventListener("DOMContentLoaded", function (e) {
//   console.log(e);
// });
// // this happens when the network tab is fully loaded alone with the js and all other source is loaded
// window.addEventListener("load", function (e) {
//   console.log("page fully loaded", e);
// });

//this event is loaded before the user is about to leave the page
// window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = "";
// });
//efficient script loading defer and async
/*
we can load the js file in different ways and the script tag can be added in head or in the body
//1.Regular <script src=script.js> 
Head:-  Parsing the html->waiting for fetch script->execute->Finish parsing the html (page loading time increase for html )
body:- Parsing the html->fetch script->execute (html is loaded first)


//2.ASYNC  <script async src="script.js">
good for long js 
Head:- Parsing the HTML (also fetch script )->wait (execute)-> Finish parsing HTML
Body:- no differ
DOM content load event waits for all scripts to execute, except for async scripts. SO DOM content loaded does not wait for an async script


//3. Differ <script defer src ="script.js">
over all best solution
script is fetched async and executed after the html is completely parsed 
DOM content is loaded and fired after the js is loaded
Head:- parsing html(fetch the html)->execute (html parsing is not affected, js is executed after the html)
Body:- no differ
*/
