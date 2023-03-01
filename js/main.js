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

const headerScrollTrigger = {
  trigger: "#about",
  start: "top center",
  end: "bottom center",
  scrub: 1,
  // markers: true,
};

gsap.set(".fa-bars", {
  border: "1px rgba(255, 255, 255, 0) solid",
  backgroundColor: "rgba(0,0,0,0)",
});

gsap.to(".fa-bars", {
  scrollTrigger: headerScrollTrigger,
  border: "1px rgba(255, 255, 255, 1) solid",
  backgroundColor: "rgba(0,0,0,1)",
});

gsap.to("#site-logo", {
  scrollTrigger: headerScrollTrigger,
  opacity: 0,
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

  tl.from(".js-hero__welcome", {
    duration: 0.5,
    opacity: 0,
  });
  tl.from(
    ".hero__copy",
    {
      duration: 1,
      opacity: 0,
    },
    "<"
  );

  /* End of timeline */
});

/* Blinking vertical line at the end of the welcome text */
// tl.fromTo(
//   ".js-vertical-line",
//   { opacity: 1 },
//   { duration: 0.5, opacity: 0, yoyo: true, repeat: -1 }
// );

/* About section animation */

gsap.from(".about__body", {
  scrollTrigger: {
    trigger: ".about__body",
    start: "-20% center",
    end: "bottom center",
    // markers: true,
  },
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
