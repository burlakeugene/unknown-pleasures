class JoyDevision{
    constructor(props){
        this.state = {
            lineColor: props && props.lineColor ? props.lineColor : '#ffffff',
            linesCount: props && props.linesCount ? props.linesCount : 60,
            lineWidth: props && props.lineWidth ? props.lineWidth : 1.5,
            background: props && props.background ? props.background : '#000000',            
            pointsCount: props && props.pointsCount ? props.pointsCount : 100,
            renderTime: props && props.renderTime ? props.renderTime : 10,
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
        this.renderLoop = false;
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
                    end: canvas.clientWidth - offset.x
                },
                y: {
                    start: offset.y,
                    end: canvas.clientHeight - offset.y
                }
            }
        })
    }

    renderPoints(){
        let {
            context,
            points,
            background,
            lineColor,
            lineWidth
        } = this.state;
        context.fillStyle = background;
        context.strokeStyle = lineColor;
        context.lineWidth = lineWidth;
        
        for (let  i = 0; i < points.length; i++) {
            context.beginPath();
            let row = points[i];
            context.moveTo(row[0].x, row[0].y);
            for (let  j = 0; j < row.length; j++) {
                let col = row[j];
                context.lineTo(col.x, col.y);
            }
            context.fill();
            context.stroke();
        }
    }

    movePoints(){
        let {points} = this.state;
        return new Promise((resolve, reject) => {
            for (let  i = 0; i < points.length; i++) {
                let row = points[i];
                for (let  j = 0; j < row.length; j++) {
                    let current = row[j],
                        prev = row[j - 1],
                        next = row[j + 1];
                    points[i][j].y = (prev && next) ?
                        this.makeSmooth(
                            prev.y, 
                            current.y, 
                            next.y)
                        :   
                        points[i][j].y;
                    if(i === points.length-1 && j === row.length - 1){
                        this.setState({
                            points: points
                        })
                        resolve();
                    }
                }
            }
        });
    }

    makeSmooth(prev, current, next){
        return current - (Math.random() - Math.random());
    }

    generateData(){
        return new Promise((resolve, reject) => {
            this.calcRect();
            let {
                linesCount, 
                pointsCount, 
                rect
            } = this.state,
            points = [],
            pointPeriod = (rect.x.end - rect.x.start) / pointsCount,
            linePeriod = (rect.y.end - rect.y.start) / linesCount,
            x = rect.x.start,
            y = rect.y.start;
            for (let  i = 0; i < linesCount; i++) {
                let row = []
                for (let j = 0; j < pointsCount; j++) {
                    let noiseddY = y - this.calcNoise(j, pointsCount);
                    row.push({
                        x:x,
                        y:noiseddY
                    });
                    x = x + pointPeriod;
                }
                x = rect.x.start;
                y = y + linePeriod;
                points.push(row);
            }
            this.setState({
                points: points,
                pointPeriod: pointPeriod,
                linePeriod: linePeriod
            }, () => {
                resolve(points);
            });
        });
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

    setState(props, callback){
        for(let item in props){
            this.state[item] = props[item];
        }
        callback && callback();
    }

    initContext(){
        let {canvas} = this.state;
        this.setState({
            context: canvas.getContext('2d')
        });
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
        //this.render();
    }

    render(){
        let {renderTime} = this.state;
        if(this.renderLoop){
            clearInterval(this.renderLoop);
            this.renderLoop = false;
        }
        this.generateData().then((data) => {
            this.runRenderLoop();
            this.renderLoop = setInterval(() => {
                this.runRenderLoop()
            }, renderTime);
        });
    }

    runRenderLoop(){
        this.clearCanvas();
        this.renderBackground();
        this.movePoints().then(() => {
            this.renderPoints();
        });
    }
}

export default JoyDevision;