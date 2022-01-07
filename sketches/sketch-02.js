// noinspection SpellCheckingInspection

const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');


const settings = {
    dimensions: [1080, 1080],
    animate: true,
    fps: 48,
    duration: 5,
    playbackRate: 'throttle',
    loop: true
};

const sketch = ({width, height}) => {

    //First array for radius, second for startAngle, last for endAngle
    const arcRanges = [
        [0.7, 1.3],
        [1, -8],
        [1, 5]
    ]

    const arcArray = []
    const numOfArcs = 25

    for (let i = 0; i < numOfArcs; i++) {
        const x = width * 0.5;
        const y = width * 0.5;
        const radius = width * 0.3 * random.range(arcRanges[0][0], arcRanges[0][1]);
        const startAngle = math.degToRad(random.range(0, 360))
        const endAngle = startAngle + math.degToRad(random.range(30, 40))
        const lineWidth = random.range(5, 20);

        arcArray.push(new Arc(x, y, radius, startAngle, endAngle, lineWidth));
    }

    const cx = width * 0.5;
    const cy = height * 0.5;
    const radius = width * 0.3;

    let clock = new Clock(cx, cy, 40, radius, height*0.1);

    return ({context, width, height, playhead}) => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);
        context.fillStyle = 'black';

        const w = width * 0.007;
        const h = height * 0.05;

        clock.draw(context, w, h, playhead);

        arcArray.forEach(arc => {
            arc.update(playhead);
            arc.draw(context);
        })
    };
};

canvasSketch(sketch, settings);

class Arc {
    constructor(x, y, radius, startAngle, endAngle, lineWidth) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.lineWidth = lineWidth;
        this.speedMod = random.range(1, 5);
    }

    draw(context) {
        context.lineWidth = this.lineWidth;

        context.beginPath();
        context.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
        context.stroke();
    }

    update() {
        this.startAngle = this.startAngle + (2 * Math.PI/ settings.duration/2/settings.fps * this.speedMod);
        this.endAngle = this.endAngle + (2 * Math.PI/ settings.duration/2/settings.fps*this.speedMod);
    }

}

class Clock {
    constructor(x, y, slices, radius, height) {
        this.x = x;
        this.y = y;
        this.slices = slices;
        this.radius = radius;
        this.valuesToUse = this.generateClock(height)
    }

    generateClock(h) {
        let randomValues = [
                [],
                [],
                []
            ]
        ;
        for (let i = 0; i < this.slices; i++) {
            randomValues[0].push(random.range(0.5, 2));
            randomValues[1].push(random.range(1, 3));
            randomValues[2].push(random.range(0, -h * 0.25));
        }
        return randomValues;
    }

    draw(context, w, h, playhead) {
        for (let i = 0; i < this.slices; i++) {
            const currentSlice = math.degToRad(360 / this.slices);
            const angle = currentSlice * i + (2 * Math.PI * playhead);

            let currentX = this.x + this.radius * Math.sin(angle);
            let currentY = this.y + this.radius * Math.cos(angle);

            context.save();
            context.translate(currentX, currentY);
            context.rotate(-angle);
            context.scale(this.valuesToUse[0][i], this.valuesToUse[1][i]);

            context.beginPath();
            context.rect(-w * 0.5, this.valuesToUse[2][i], w, h);
            context.fill();
            context.restore();
        }
    }
}