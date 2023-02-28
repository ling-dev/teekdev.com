gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);

const navToggle = document.querySelector(".main-nav__toggler");
const nav = document.querySelector(".main-nav");

navToggle.addEventListener("click", () => {
  nav.classList.toggle("is-active");
});
nav.addEventListener("click", () => {
  nav.classList.toggle("is-active");
});

const heroCanvasScrollTrigger = {
  trigger: "#js-canvas__wrapper",
  start: "10% center",
  end: "center center",
  scrub: 2,
  //   markers: true,
};

/* Wait until the whole page is loaded */

window.addEventListener("load", (event) => {
  /* Hide, resize and reposition canvas container at the beginning */
  gsap.set("#canvas-container", {
    opacity: 0,
    scale: 0.3,
    yPercent: -30,
  });

  /* Hide canvas at the beginning */
  gsap.set("#canvas-container canvas", {
    opacity: 0,
  });

  /* Hide text inside canvas */
  gsap.set(".canvas__copy", {
    zIndex: -99,
  });

  /* Chain of animations when the whole page is loaded */
  var tl = gsap.timeline();

  /* Start of timeline */
  /* Remove the loader first */
  tl.to(".loader__top, .loader__middle, .loader__bottom", {
    duration: 1,
    xPercent: 100,
    stagger: 0.1,
  });

  tl.to("#loader", {
    duration: 1,
    opacity: 0,
    zIndex: -9999,
  });

  /* Hero text animation */

  /* Blinking vertical line at the end of the welcome text */
  // tl.fromTo(
  //   ".js-vertical-line",
  //   { opacity: 1 },
  //   { duration: 0.5, opacity: 0, yoyo: true, repeat: -1 }
  // );

  tl.from(".js-hero__welcome", {
    duration: 0.5,
    opacity: 0,
  });
  tl.from(
    ".hero__copy",
    {
      duration: 0.5,
      opacity: 0,
    },
    "<"
  );

  /* Show canvas after hero appears */
  tl.to("#canvas-container", {
    duration: 1,
    opacity: 1,
  });
  /* End of timeline */

  /* Animation of canvas when scrolling */

  gsap.to("#canvas-container", {
    scrollTrigger: heroCanvasScrollTrigger,
    scale: 1,
    yPercent: 0,
  });

  gsap.to("#canvas-container canvas", {
    scrollTrigger: heroCanvasScrollTrigger,
    opacity: 1,
  });
  gsap.to(".canvas__copy", {
    scrollTrigger: heroCanvasScrollTrigger,
    zIndex: 99,
  });

  /* Hide pink canvas background when scrolling down */
  gsap.to("#js-canvas__bg", {
    scrollTrigger: heroCanvasScrollTrigger,
    opacity: 0,
  });
});

/* About section animation */

gsap.from(".about__body", {
  scrollTrigger: ".about__body",
  opacity: 0,
  yPercent: 20,
  duration: 1,
  ease: "power1.out",
});

/* Work section animation */

gsap.from(".work-card", {
  scrollTrigger: {
    trigger: "#work",
    start: "top center",
    end: "20% center",
    scrub: 1,
    // markers: true,
  },
  duration: 1,
  yPercent: 40,
  stagger: 0.3,
});

/* Contact section */

const contactSectionScrollTrigger = {
  trigger: "#contact",
  start: "top center",
  end: "25% center",
  scrub: 2,
  // markers: true,
};

gsap.set(".js-contact__wrapper", {
  rotationX: 60,
});
gsap.to(".js-contact__wrapper", {
  scrollTrigger: contactSectionScrollTrigger,
  duration: 1,
  rotationX: 0,
});

/* Polygon animation */

const polygons = document.querySelectorAll(".js-polygon");

const polygonShapes = [
  "polygon__shape--1",
  "polygon__shape--2",
  "polygon__shape--3",
  "polygon__shape--4",
  "polygon__shape--5",
  "polygon__shape--6",
  "polygon__shape--7",
  "polygon__shape--8",
  "polygon__shape--9",
  "polygon__shape--10",
];

const changeShape = () => {
  const newPolygonShapes = [];

  polygons.forEach((polygon) => {
    for (let i = 0; i < polygonShapes.length; i++) {
      if (!polygon.classList.contains(polygonShapes[i])) {
        newPolygonShapes.push(polygonShapes[i]);
      }
    }

    const newShapeClass =
      newPolygonShapes[Math.floor(Math.random() * newPolygonShapes.length)];

    polygon.classList.remove(...polygonShapes);
    polygon.classList.add(newShapeClass);
  });
};

setInterval(changeShape, 2000); // Repeat function every 2 seconds
