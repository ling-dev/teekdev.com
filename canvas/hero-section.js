const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const Color = require("canvas-sketch-util/color");
const { degToRad, mapRange } = require("canvas-sketch-util/math");

const settings = {
  dimensions: [1920, 1920],
  animate: true,
  fps: 6,
  parent: document.querySelector("#canvas-container"),
};

let elCanvas;
let imgA;
let maxDist;
let lineWidth;
let ptRadius;
let isPressing;
let isTouching;
const cirColorOptions = ["#fff", "#dca66d", "#ff85f9"];
let cirColor;
const circles = [];

const sketch = ({ canvas, width, height }) => {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("touchstart", handleStart);

  elCanvas = canvas;
  maxDist = 40;
  ptRadius = 1;
  isPressing = false;
  isTouching = false;

  const cX = width * 0.5;
  const cY = height * 0.5;
  const numCir = 30;
  const bgColor = "#1c0c2e";
  cirColor = cirColorOptions[0];

  for (i = 4; i < numCir; i++) {
    const points = [];
    const cRadius = i * i;
    const numPt = i * 2;

    for (j = 0; j < numPt; j++) {
      const slice = math.degToRad(360 / numPt);
      const angle = i + slice * j;
      const x = cX + cRadius * Math.cos(angle);
      const y = cY + cRadius * Math.sin(angle);
      points.push(new Point(x, y, ptRadius));
    }
    circles.push(points);
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    // Drawing circles

    circles.forEach((circle, i) => {
      lineWidth = mapRange(i, 0, numCir, 0.6, 0);
      const points = circle;
      context.save();
      context.lineWidth = lineWidth;
      context.strokeStyle = cirColor;

      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      points.forEach((point) => {
        context.lineTo(point.x, point.y);
      });
      context.closePath();
      context.stroke();
      context.restore();
    });

    // Creating points

    circles.forEach((circle) => {
      const points = circle;
      points.forEach((point) => {
        if (isPressing || isTouching) {
          cirColor = random.boolean() ? cirColorOptions[1] : cirColorOptions[2];
        } else {
          cirColor = cirColorOptions[0];
        }

        point.create(context, frame, cirColor);
      });
    });

    // Drawing image
    context.save();
    context.translate(cX, cY);
    context.translate(imgA.width * -0.5, imgA.height * -0.4);
    context.drawImage(imgA, 0, 0);
    context.restore();
  };
};

// Animation when mouse moves

const updatePt = (circles, mouseX, mouseY) => {
  if ((mouseX == null) & (mouseY == null)) {
    circles.forEach((circle) => {
      const points = circle;

      points.forEach((point) => {
        point.x = point.baseX;
        point.y = point.baseY;
        point.radius = isTouching
          ? point.baseRadius * Math.floor(random.range(1, 16))
          : point.baseRadius;
      });
    });
  } else {
    if (isPressing) {
      maxDist = 80;
    } else {
      maxDist = 50;
    }
    circles.forEach((circle) => {
      const points = circle;

      points.forEach((point) => {
        const { dDist, dAngle } = point.getDist(mouseX, mouseY);

        if (dDist < maxDist) {
          const offsetDistX = Math.sin(dAngle) * (maxDist - dDist);
          const offsetDistY = Math.cos(dAngle) * (maxDist - dDist);
          point.x = point.baseX + offsetDistX;
          point.y = point.baseY + offsetDistY;
          point.radius = isPressing
            ? point.baseRadius * Math.floor(random.range(1, 16))
            : point.baseRadius * Math.floor(random.range(8, 12));
        } else {
          point.x = point.baseX;
          point.y = point.baseY;
          if (dDist < maxDist * 2) {
            point.radius = isPressing
              ? point.baseRadius * 8
              : point.baseRadius * 4;
          } else if (dDist < maxDist * 3) {
            point.radius = isPressing
              ? point.baseRadius * 6
              : point.baseRadius * 3;
          } else if (dDist < maxDist * 4) {
            point.radius = isPressing
              ? point.baseRadius * 3
              : point.baseRadius * 2;
          } else {
            point.radius = point.baseRadius;
          }
        }
      });
    });
  }
};

function onMouseMove(e) {
  const mouseX = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const mouseY = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  updatePt(circles, mouseX, mouseY);
}

const onMouseDown = (e) => {
  window.addEventListener("mouseup", onMouseUp);

  const mouseX = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const mouseY = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;
  isPressing = true;
  isTouching = false;

  updatePt(circles, mouseX, mouseY);
};

const onMouseUp = (e) => {
  const mouseX = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const mouseY = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  isPressing = false;
  isTouching = false;

  updatePt(circles, mouseX, mouseY);
};

const handleStart = (e) => {
  window.addEventListener("touchend", handleEnd);

  const mouseX = null;
  const mouseY = null;

  isPressing = false;
  isTouching = true;

  updatePt(circles, mouseX, mouseY);
};
const handleEnd = (e) => {
  const mouseX = null;
  const mouseY = null;

  isPressing = false;
  isTouching = false;
  updatePt(circles, mouseX, mouseY);
};

const loadImage = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

const start = async () => {
  imgA = await loadImage("star.png");
  canvasSketch(sketch, settings);
};

start();

class Point {
  constructor(x, y, radius, baseX = x, baseY = y, baseRadius = radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.baseX = baseX; // Original position
    this.baseY = baseY;
    this.baseRadius = baseRadius;
  }

  create(context, frame, cirColor) {
    const n = random.noise1D(this.x + frame * 100, 0.001);
    const rgb = Color.parse(cirColor).rgb;
    const ptColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]},
      ${math.mapRange(n, -1, 1, 0, 1)})`;

    context.save();
    context.translate(this.x, this.y);
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fillStyle = ptColor;
    context.fill();
    context.restore();
  }

  getDist(x, y) {
    const dX = this.baseX - x;
    const dY = this.baseY - y;
    const dDist = Math.sqrt(dX * dX + dY * dY);
    const dAngle = Math.atan2(dX, dY);

    return { dDist, dAngle };
  }
}
