import JoyDivision from './js/joyDivision.js';

let image = new JoyDivision({
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