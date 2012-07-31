var fuzzyLogic = {
		
	init: function(){
		var self = this;
		
		// element refs
		this.canvas = $('#funnyFaceCanvas');
		this.ctx = this.canvas[0].getContext('2d');
		
		// shared vars
		this.settings = {
			canvasWidth: this.canvas.width(),
			canvasHeight: this.canvas.height(),
			particleCount: 100,
			particleStartingRadius: 30,
			particleLength: 4
		}
		this.particles = []; // generated as we go
		this.mouseDown = false; // flag for mouse events
		this.curMouseCoord = [0,0];
					
		// events
		this.canvas.on('mousedown', $.proxy(this.onMouseDown, this));
		this.canvas.on('mouseup', $.proxy(this.onMouseUp, this));
		this.canvas.on('mousemove', $.proxy(this.onMouseMove, this));
		
		// setup
		this.ctx.strokeStyle = 'black';
		this.createParticles();
	},

	onMouseDown: function(e){
		var clickX = e.pageX - this.canvas.offset().left,
			clickY = e.pageY - this.canvas.offset().top;

		this.orientParticles(clickX, clickY);
		this.mouseDown = true;
	},

	onMouseUp: function(e){
		this.mouseDown = false;
	},

	onMouseMove: function(e){
		if(this.mouseDown){
			mouseX = e.pageX - this.canvas.offset().left,
			mouseY = e.pageY - this.canvas.offset().top;

			this.moveParticles(mouseX, mouseY);
		}
	},
	
	createParticles: function(){
		var horzCenter =  this.settings.canvasWidth / 2 - 15, // radius of 30
			vertCenter = this.settings.canvasHeight / 2 - 15, // radius of 30
			hypotenuse = this.settings.particleLength * this.settings.particleLength,
			xStart,
			yStart,
			xEnd,
			yEnd,
			coords;
		
		for(var i = 0, len = this.settings.particleCount; i < len; i++){
			xStart = horzCenter + (Math.random() * this.settings.particleStartingRadius);
			yStart = vertCenter + (Math.random() * this.settings.particleStartingRadius);
			xEnd = hypotenuse - (Math.random() * hypotenuse);
			yEnd = hypotenuse - xEnd;
			xEnd = xStart + (Math.sqrt(xEnd) * (Math.random() > .5 ? 1 : -1));
			yEnd = yStart + (Math.sqrt(yEnd) * (Math.random() > .5 ? 1 : -1));
			
			coords = [xStart,yStart,xEnd,yEnd];
			this.particles.push(coords);
			
			this.drawLine(xStart,yStart,xEnd,yEnd);
		}
	},
	
	orientParticles: function(mouseX, mouseY){
		var slope = 0,
			angle = 0,
			endX = 0,
			endY = 0;
		
		this.ctx.clearRect(0, 0, this.settings.canvasWidth, this.settings.canvasHeight);

		for(var i = 0, len = this.particles.length; i < len; i++){
			slope = (mouseY - this.particles[i][1]) / (mouseX - this.particles[i][0]);
			angle = Math.atan(slope);
			endX = Math.cos(angle) * this.settings.particleLength;
			endY = Math.sin(angle) * this.settings.particleLength;
			this.particles[i][2] = this.particles[i][0] + endX;
			this.particles[i][3] = this.particles[i][1] + endY;
			
			this.drawLine(this.particles[i][0],this.particles[i][1],this.particles[i][2],this.particles[i][3]);
		}
		
		this.curMouseCoord[0] = mouseX;
		this.curMouseCoord[1] = mouseY;
	},
	
	moveParticles: function(mouseX, mouseY){
		var distance = Math.sqrt((mouseX*mouseX)+(mouseY*mouseY)) - Math.sqrt((this.curMouseCoord[0]*this.curMouseCoord[0]) + (this.curMouseCoord[1]*this.curMouseCoord[1]));
			slope = 0,
			angle = 0,
			startX = 0,
			startY = 0,
			endX = 0,
			endY = 0;
			
		this.ctx.clearRect(0, 0, this.settings.canvasWidth, this.settings.canvasHeight);
			
		for(var i = 0, len = this.particles.length; i < len; i++){
			slope = (mouseY - this.particles[i][1]) / (mouseX - this.particles[i][0]);
			angle = Math.atan(slope);
			startX = Math.cos(angle) * distance;
			startY = Math.sin(angle) * distance;
			endX = Math.cos(angle) * (this.settings.particleLength + distance);
			endY = Math.sin(angle) * (this.settings.particleLength + distance);
			this.particles[i][0] += startX;
			this.particles[i][1] += startY;
			this.particles[i][2] = this.particles[i][0] + endX;
			this.particles[i][3] = this.particles[i][1] + endY;

			this.drawLine(this.particles[i][0],this.particles[i][1],this.particles[i][2],this.particles[i][3]);
		}
		
		this.curMouseCoord[0] = mouseX;
		this.curMouseCoord[1] = mouseY;
	},
	
	drawLine: function(x1,y1,x2,y2){
		this.ctx.beginPath();  
		this.ctx.moveTo(x1,y1);  
		this.ctx.lineTo(x2,y2);
		this.ctx.closePath();  
		this.ctx.stroke();
	}
};

$(function(){
	fuzzyLogic.init();
});