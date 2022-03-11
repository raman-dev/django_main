class Polygon{

    static FRAME_DELTA = 16;

    static getVerticesForPolygon(n){
        let theta = 360/n;
        let currentAngle = theta;
        let i = 1;
        let points = [];
        while(i <= n){
            points.push([Math.cos(currentAngle * Math.PI/180),Math.sin(currentAngle * Math.PI/180)]);
            i+=1;
            currentAngle = theta * i;
        }
        return points;
    }

    constructor(n,fillColor,scaleFactor){
        this.num_vertices = n;
        this.vertices = Polygon.getVerticesForPolygon(n);
        this.pointDeltas = [];
        this.vertices.forEach( (x,i) => {
            //delta maintains final positiona and current position
            this.pointDeltas.push([0,0]);
        });
        this.frameHandler = null;
        this.renderContext = null;
        this.fillColor = fillColor;
        this.angle = 0;
        this.scaleFactor = scaleFactor;//what percentage of the parent should the polygon fill
    }
    
    setSize(width,height){
        //on resize scale points
        this.scale = this.scaleFactor*Math.min(width/2,height/2);
    }

    startAnimation(context,width,height){
        this.renderContext = {
            context:context,
            width:width,
            height:height,
            
            scale:this.scale,
            
            originalPoints:this.vertices,//use these points to generate new points
            points:this.vertices.slice(),//render these points
            pointsStart:this.vertices.slice(),
            pointsEnd:this.vertices.slice(),//animate toward points end
            
            fillColor:this.fillColor,
            polygon:this
        }

        //this.frameHandler = setInterval(Polygon.onDrawFrame.bind(this.renderContext),Polygon.FRAME_DELTA);
        Polygon.onDrawFrame.bind(this.renderContext)();
    }

    stopAnimation(){
        if(this.frameHandler != null){
            clearInterval(this.frameHandler);
            //draw frame so it doesn't disappear on resize
            Polygon.onDrawFrame.bind(this.renderContext)();
            this.frameHandler = null;
            this.renderContext = null;
        }
    }
    
    static render(renderContext){
        let ctx = renderContext.context;
        ctx.save();

        ctx.fillStyle = renderContext.fillColor;
        ctx.clearRect(0,0,renderContext.width,renderContext.height);   
        let points = renderContext.points;
        
        renderContext.polygon.angle += 0.5;

        if(renderContext.polygon.angle >= 360){
            renderContext.polygon.angle = 0;
        }
        //translate to center
        ctx.translate(renderContext.width/2,renderContext.height/2);
        ctx.scale(renderContext.scale,renderContext.scale);
        ctx.rotate(renderContext.polygon.angle * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(points[0][0],points[0][1]);
        let i = 1;
        while(i < points.length){
            //i can add a random x translation left or right in between the right and left points
            //need to change points like
            ctx.lineTo(points[i][0],points[i][1]);
            i+=1;
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        //change the points
    }

    static getRandomPoint(left,right){
        return (right - left) * Math.random();
    }
    
    static getNewEndPoints(pointsEnd,originalPoints){
        //
        let i = 1;
        while(i < originalPoints.length){
            //i can add a random x translation left or right in between the right and left points
            //select a random point between these 2
            //need to change points like
            if(Math.random() > 0.5){
                pointsEnd[i][0] = originalPoints[i][0] + Math.min(0.02,Math.random());
            }else{
                pointsEnd[i][0] = originalPoints[i][0] - Math.min(0.02,Math.random());
            }
            i+=1;
        }
    }
   
    static onDrawFrame(){
        //this is our interpolation
        // console.log('getting new endPoints');
        Polygon.getNewEndPoints(this.pointsEnd,this.originalPoints);
        this.pointsStart = this.pointsEnd.slice();//since we ended up here
        this.points = this.pointsStart.slice();
        Polygon.render(this);
    }
}
