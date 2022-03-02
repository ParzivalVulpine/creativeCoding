const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const color = require('canvas-sketch-util/color')

const settings = {
  dimensions: [ 1080, 1080 ],
  fps: 60,
  playbackRate: 'throttle',
  animate: true
};

const sketch = ({ width, height }) => {
  let colorCount = 0;
  const agents = [];

  for (let i = 0; i < 50  ; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        for (let k = j + 1; k < agents.length; k++) {
          agents[i].displayTriangle(agents[j], agents[k], context, colorCount);
        }
      }
    }
    context.fillStyle = 'white';
    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.wrap(width, height);
    })

    colorCount += 1;

    /*for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        agent.createLine(context, other);


      }*/
    }
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = 8;
  }

  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width)  this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }

  wrap(width, height){
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }

  displayTriangle(p1, p2, context, colorCount){
    const areaThres = 50000;
    const distThres = 250;

    const dist1 = dist(this, p1);
    const dist2 = dist(this, p2);
    const dist3 = dist(p1, p2);

    const sp = (dist1 + dist2 + dist3) * 0.5;
    const area = Math.sqrt(sp * (sp - dist1) * (sp - dist2) * (sp - dist3))

    if (area < areaThres && dist1 < distThres && dist2 < distThres && dist3 < distThres){
      const colorFill = color.parse(saturatedColor(colorCount));
      context.fillStyle = colorFill.hex;
      //context.strokeStyle = 'black';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(this.pos.x, this.pos.y);
      context.lineTo(p1.pos.x, p1.pos.y);
      context.lineTo(p2.pos.x, p2.pos.y);
      context.lineTo(this.pos.x, this.pos.y);
      context.fill();
      context.stroke();
    }

  }

  createLine(context, otherPoint){
    const distThreshold = 200;
    const dist = this.pos.getDistance(otherPoint.pos);

    if (dist < distThreshold) {
      context.lineWidth = math.mapRange(dist, 0, 200, 12, 1);

      context.beginPath();
      context.moveTo(this.pos.x, this.pos.y);
      context.lineTo(otherPoint.pos.x, otherPoint.pos.y);
      context.stroke();
    }
  }
}

function dist(agent1, agent2){
  const dx = agent1.pos.x - agent2.pos.x;
  const dy = agent1.pos.y - agent2.pos.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function saturatedColor(colorCount){
  const h = colorCount * 10;
  return hslToHex(h, 100, 50);
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}