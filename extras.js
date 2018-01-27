
//Canvas extensions from MJS
	CanvasRenderingContext2D.prototype.polygon = function (x,y,r,n,t){
	 t=t ||0;	
   var m = t+Math.PI*2;
   var px = x - r * Math.sin(t);
   var py = y - r * Math.cos(t);
   this.beginPath();
   this.moveTo(px,py);
   while (t<m){
      px = x - r * Math.sin(t);
      py = y - r * Math.cos(t);
      t += Math.PI*2 / n;
      this.lineTo(px,py);
   }
   this.closePath();
	};

	CanvasRenderingContext2D.prototype.star = function (x,y,r,ratio,n,t){
		 t=t ||0;	
	   var m = t + Math.PI * 2;
	   var px = x - r * Math.sin(t);
	   var py = y - r * Math.cos(t);
	   var dt = Math.PI / n;
	   this.beginPath();
	   this.moveTo(px, py);
	   t += dt ;
	   px = x - ratio * r * Math.sin(t);
	   py = y - ratio * r * Math.cos(t);
	   t += dt;
	   this.lineTo(px, py);
	   while (t < m) {
	       px = x - r * Math.sin(t);
	       py = y - r * Math.cos(t);
	       this.lineTo(px, py);
	       t += dt;
	       px = x - ratio * r * Math.sin(t);
	       py = y - ratio * r * Math.cos(t);
	       this.lineTo(px, py);
	       t += dt;
	   }
	   this.closePath();
	};

	CanvasRenderingContext2D.prototype.roundRect = function (x,y,w,h,r) {
	   if (!Array.isArray(r)){
	      r = Math.abs(r||0);
	      r = Math.min(r,Math.min(w/2,h/2));
	      r = [r,r,r,r];
	   } else {
	      for (var i =0;i<4;i++){
	         r[i] =  Math.min(Math.abs(r[i]),Math.min(w/2,h/2)) || 0;
	      }
	   }
	    var tpi = 2*Math.PI;
	   this.beginPath();
	   this.moveTo(x+r[0],y);
	   this.lineTo(x+w-r[1],y);
	   this.arc(x+w-r[1],y+r[1],r[1],0.75*tpi,0,false);
	   this.lineTo(x+w,y+h-r[2]);
	   this.arc(x+w-r[2],y+h-r[2],r[2],0,0.25*tpi,false);
	   this.lineTo(x+r,y+h);
	   this.arc(x+r[3],y+h-r[3],r[3],0.25*tpi,0.5*tpi,false);
	   this.lineTo(x,y+r[0]);
	   this.arc(x+r[0],y+r[0],r[0],0.5*tpi,0.75*tpi,false);
	   this.closePath();
	};

	CanvasRenderingContext2D.prototype.shape = function (x,y,points,s,t){
	   var startx = x + s*(Math.cos(t)*points[0][0] - Math.sin(t)*points[0][1]);
	   var starty = y + s*(Math.sin(t)*points[0][0] + Math.cos(t)*points[0][1]);
	   this.beginPath();
	   this.moveTo(startx, starty);
	   for (var i = 1;i<points.length;i++){
	      var px = x + s*(Math.cos(t)*points[i][0] - Math.sin(t)*points[i][1]);
	      var py = y + s*(Math.sin(t)*points[i][0] + Math.cos(t)*points[i][1]);
	      this.lineTo(px, py);
	   }
	   this.closePath();
	};



function randInt(below=1) {
    return Math.floor(Math.random()*below);
}

function probability(amt=0.5)  {
    return Math.random() < amt;
}