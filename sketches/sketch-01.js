const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
    dimensions: [1000, 1000],
    animate: true,
    duration: 5,
    fps: 12,
    playbackRate: 'throttle'
};

const sketch = () => {
    return ({context, width, height}) => {
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
        context.lineWidth = width * 0.01;

        const w = width * 0.10;
        const h = height * 0.10;
        const gap = width * 0.03;
        const ix = width * 0.17;
        const iy = height * 0.17;

        const off = width * 0.03;

        const colorList = ['#FFBE0B', '#FB5607', '#F70000'];
        const colorListBoxes = ['#8338EC', '#3A86FF', '#06D6A0'];
        const shapeList = ['square', 'circle', 'triangle', 'none'];

        let x, y;

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                x = ix + (w + gap) * i;
                y = iy + (h + gap) * j;

                let colorBox = random.pick(colorListBoxes)
                context.shadowBlur = 10;
                context.shadowColor = colorBox;
                context.strokeStyle = colorBox;
                context.beginPath();
                context.rect(x, y, w, h);
                context.stroke();

                colorBox = random.pick(colorList);
                context.strokeStyle = colorBox;
                context.shadowColor = colorBox;
                switch (random.pick(shapeList)) {
                    case 'square':
                        context.beginPath();
                        context.rect(x + off / 2, y + off / 2, w - off, h - off);
                        context.stroke();
                        break;
                    case 'circle':
                        context.beginPath();
                        context.arc(x + w / 2, y + h / 2, w - off * 2.2, 0, Math.PI * 2);
                        context.stroke();
                        break;
                    case 'triangle':
                        context.beginPath();
                        context.moveTo(x + off / 2, y + off / 2);
                        context.lineTo(x + w - off / 2, y + off / 2);
                        context.lineTo(x + w / 2, y + h - off / 1.5);
                        context.lineTo(x + off / 2, y + off / 2);
                        context.lineTo(x + w - off / 2, y + off / 2);
                        context.stroke();
                }
            }
        }
    };
};

canvasSketch(sketch, settings);