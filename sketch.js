let maskGraphics;
let barsGraphics;
let sunsetColors;

// --------------------
// SETTINGS
let barHeight = 16;          // height of each bar
let barSpeed = 14;           // pixels per second (adjust this)
let sunDiameter = 600;
let horizonY;
let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id('vaporwaveSunset');
  canvas.parent('clockSunset');
  noStroke();

  // Off-screen graphics
  maskGraphics = createGraphics(width, height);
  barsGraphics = createGraphics(width, height);

  // Vaporwave sunset gradient colors
  sunsetColors = [
    color(255, 65, 70),   // pink-red
    color(255, 201, 42),
    color(255, 201, 42)    // orange (solid, not transparent)
  ];

  horizonY = height / 2 + 200; // horizon position
}

function draw() {
  clear(); // 🔑 transparent canvas

  barsGraphics.clear();

  // Calculate offset in pixels
  let offset = (millis() * (barSpeed / 1000)) % (barHeight * 2);

  // Loop enough bars to cover the canvas + some extra
  for (let i = -4; i < height / barHeight + 4; i++) {
    let yPos = i * barHeight + offset;

    // Alternate: even bars drawn, odd bars skipped (transparent)
    if (i % 2 === 0) {
      // Gradient factor based on vertical position inside the sun
      let t = constrain((yPos - (horizonY - sunDiameter / 2)) / sunDiameter, 0, 1);
      let col = lerpColor(sunsetColors[0], sunsetColors[1], t);

      barsGraphics.noStroke();
      barsGraphics.fill(col);
      barsGraphics.rect(0, yPos, width, barHeight);
    }
  }

  // ----------------
  // Mask circle (sunset)
  maskGraphics.clear();
  maskGraphics.fill(255);
  maskGraphics.noStroke();
  maskGraphics.ellipse(width / 2, horizonY + 70, sunDiameter, sunDiameter);

  maskGraphics.erase();
  maskGraphics.rect(0, horizonY, width, height - horizonY);
  maskGraphics.noErase();

  // Apply mask
  let maskedImage = barsGraphics.get();
  maskedImage.mask(maskGraphics.get());
  image(maskedImage, 0, 0);

  drawGrid(horizonY);
}

function glowLine(x1, y1, x2, y2, glowColor) {
  // Outer soft glow
  stroke(glowColor.levels[0], glowColor.levels[1], glowColor.levels[2], 40);
  strokeWeight(4);
  line(x1, y1, x2, y2);

  // Mid glow
  stroke(glowColor.levels[0], glowColor.levels[1], glowColor.levels[2], 100);
  strokeWeight(2);
  line(x1, y1, x2, y2);

  // Core line
  stroke(glowColor);
  strokeWeight(1.5);
  line(x1, y1, x2, y2);
}

function drawGrid(horizonY) {
  stroke(148, 35, 148, 100); // neon purple

  // Horizontal lines (spread out more as they go down)
  for (let i = 0; i < 20; i++) {
    let y = map(i, 0, 9, horizonY, height);
    line(0, y, width, y);
    strokeWeight(1.2);
  }

  // Vertical slanted lines (pulled toward center at horizon)
  let spacing = 250;
  let cx = width / 2;     // horizon center
  let lerpAmt = 0.75;     // 0=parallel, 1=converge fully
  
  for (let x = -width * 2; x <= width * 3; x += spacing) {
    let xBottom = x;
    let xTop = lerp(x, cx, lerpAmt);
    line(xBottom, height + 200, xTop, horizonY);
    strokeWeight(1.7);
  }

  // Horizon line itself
  stroke(148, 35, 148, 100); // neon purple
  strokeWeight(2);
  glowLine(0, horizonY, width, horizonY, color(148, 35, 148));
}
