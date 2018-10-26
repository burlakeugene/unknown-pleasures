class JoyDevision{
    constructor(props){
        this.state = {
            lineColor: props && props.lineColor ? props.lineColor : '#ffffff',
            linesCount: props && props.linesCount ? props.linesCount : 60,
            lineWidth: props && props.lineWidth ? props.lineWidth : 1.5,
            background: props && props.background ? props.background : '#000000',            
            pointsCount: props && props.pointsCount ? props.pointsCount : 100,            
            canvas: (props && props.selector && document.querySelector(props.selector)) ? 
                    document.querySelector(props.selector) : 
                    false,           
            offset: {
                x: (props && props.offset && props.offset.x) ? props.offset.x : 40,
                y: (props && props.offset && props.offset.y) ? props.offset.y : 100,
            },           
            points: [],
        }
        this.init();
    }   

    renderBackground(){
        let {background, context, canvas} = this.state;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        context.fillStyle = background;
        context.fillRect(0, 0, canvas.width, canvas.height)
    }

    calcRect(){
        let {canvas, offset} = this.state;
        this.setState({
            rect: {
                x: {
                    start: offset.x,
                    end: canvas.width - offset.x
                },
                y: {
                    start: offset.y,
                    end: canvas.height - offset.y
                }
            }
        }, false, false)
    }

    renderLines(){
        this.calcRect();
        let {
                context, 
                linesCount, 
                pointsCount, 
                rect,
                lineColor,
                lineWidth,
                background,
                points
            } = this.state,
            pointsNew = [];
        let pointPeriod = (rect.x.end - rect.x.start) / pointsCount,
            linePeriod = (rect.y.end - rect.y.start) / linesCount,
            x = rect.x.start,
            y = rect.y.start;
        context.fillStyle = background;
        context.strokeStyle = lineColor;
        context.lineWidth = lineWidth;
        for (let  i = 0; i < linesCount; i++) {
            let row = []
            context.beginPath();
            for (let  j = 0; j < pointsCount; j++) {   
                let noiseddY = y - this.calcNoise(j, pointsCount);
                row.push({
                    x:x,
                    y:noiseddY
                });
                context.lineTo(x, noiseddY);
                x = x + pointPeriod;
            }
            context.fill();
            context.stroke();
            x = rect.x.start;
            y = y + linePeriod;
            context.moveTo(x, y);
            pointsNew.push(row);
        }
        if(!points.length){
            this.setState({
                points: pointsNew
            });
        }
    }

    calcNoise(x, points){
        let y = Math.random() * 5,
            activePointStart = Math.floor(points / 4),
            activePointEnd = activePointStart * 3,
            bigActivePointsStart = Math.floor(points / 3),
            bigActivePointEnd = bigActivePointsStart * 2;
        if(x > activePointStart && x < activePointEnd){
            y = Math.random() * ((activePointStart + activePointEnd) / 5)
            if(x > bigActivePointsStart && x < bigActivePointEnd){
                y = y + Math.random() * 80;
            }
        }      
        return y;
    }

    setState(props, callback, render = true){
        for(let item in props){
            this.state[item] = props[item];
        }
        callback && callback();
        render && this.render();
    }

    initContext(){
        let {canvas} = this.state;
        this.setState({
            context: canvas.getContext('2d')
        }, false, false);
    }

    clearCanvas() {
        let {context, canvas} = this.state,
            width = canvas.width;
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 1;
        canvas.width = width;
    }

    init(){
        let {canvas} = this.state;
        if(!canvas){
            throw Error('Canvas not found');
        }
        window.addEventListener('resize', this.resize.bind(this));
        this.initContext();
        this.render();
    }

    resize(){
        this.render();
    }

    runSmooting(){
        
    }

    render(){
        this.clearCanvas();
        this.renderBackground();
        this.renderLines();
        this.runSmooting();
    }
}

export default JoyDevision;