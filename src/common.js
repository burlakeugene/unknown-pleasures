import JoyDevision from './js/joyDevision.js';

let image = new JoyDevision({
    lineColor: 'white',
    background: 'black',
    selector: '#canvas',
    pointsCount: 200,
    linesCount: 50,
    renderTime: 30,
    startSmooth: 6,
    lineWidth: 1.5
});