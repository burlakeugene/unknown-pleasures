import JoyDevision from './js/joyDevision.js';

let image = new JoyDevision({
    lineColor: 'white',
    background: 'black',
    selector: '#canvas',
    pointsCount: 200,
    linesCount: 50,    
    smooth: 6,
    lineWidth: 1.5,
    renderTime: 1000,
    frames: 60,
});