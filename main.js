"use strict"
// nothing here yet
Sugar.extend();
$(init);

var canvas=document.createElement("canvas");
var ctx=canvas.getContext("2d")
var note = "hrmm";
var level = {
  pegs: [],
  cogs:[]
}
var cogImage = [];

function init() {
  $(".content").append($(canvas));
  
  canvas.width=1400;
  canvas.height=1000;
  waitForImages();
}


function waitForImages() {

   ctx.clearRect(0,0,canvas.width,canvas.height);
   if (imagesPending.length > 0) {
    ctx.star(randInt(2000),randInt(1000),randInt(500),1+Math.random(),randInt(20)+3,randInt(360));
    ctx.fill();
    ctx.fillText(JSON.stringify(imagesPending),10,10);

    requestAnimationFrame(waitForImages);
   } else gameInit();
  
}

var titleScreen = {
  pegs : [[1000,35,0]],
  cogs :[[0,60]]
}

var puzzle1 = {
  pegs : [[-550,-270], [-550,0], [-550, 270],[550,-270],[550,270],[-41,278] ,[-70,90] , [-90,-77], [10,-180], [135,-293] ],
  cogs :[[0,8],[1,12],[2,16],[3,20],[4,20]]
}

var puzzle2 = {
  pegs : [[-550,-270], [-550,0], [-550, 270],[550,-270],[550,0],[550,270],  [-265,353] ,[-107,285] , [-363,210], [-291,0], [-107,64], [-186,-191], [135,-293], [3,-304], [-322,-139],[80,122],[273,27],[137,-112] ],
  cogs :[[0,8],[1,12],[2,16],[3,20],[4,16],[5,20],[10,20]]
}


var mouseDownPosition;
var mouse;
var cogUnderMouse;

var pegUnderMouse;

var dragging=null;
var dragOffset;
var age = 0;


function gameInit() {
  $(canvas).on("mousemove", handleMouseMove)
           .on("mouseup", handleMouseUp)
           .on("mousedown", handleMouseDown);

  cogImage[8]=Assets.cog8;
  cogImage[12]=Assets.cog12;
  cogImage[16]=Assets.cog16;
  cogImage[20]=Assets.cog20;
  cogImage[100]=Assets.cog100;
  cogImage[60]=Assets.intro_screen;
  
  setPuzzle(titleScreen);
  let magicPeg = level.pegs[2];
  let orgMove = magicPeg.move;
  magicPeg.move = function() {
      orgMove();
      let {x,y} = magicPeg.getPosition();
      if (x > 0)  x*=0.95;
      magicPeg.setPosition({x,y});
      
      if (dragging) setPuzzle(puzzle1);

  }
  magicPeg.draw = function() {
    let {x,y} = magicPeg.getPosition();    
    //ctx.drawImage(Assets.happy_piston_2,x-50,y-53);
  } 
  update();
}


function setPuzzle(puzzle) {
  dragging=null;
  cogUnderMouse=null;
  let  fixedpegs=  [ 
    [0,-1000,0],[0,1000,0]
  ]  
  level.pegs = [...fixedpegs,...puzzle.pegs].map(a=>makePeg(...a));
  
  let pegs=level.pegs;

  let bottom = makeCog(pegs[1],100);
  let top = makeCog(pegs[0],100);
  top.fixed=true;
  bottom.direction=1;
  bottom.fixed=true;
  level.bottom=bottom;
  level.top=top;
  level.cogs = [bottom,top]; 

  for (let [peg,teeth] of puzzle.cogs) {
    level.cogs.push(makeCog(pegs[peg+2],teeth));
  }
}


var lastTime  = performance.now();
var frameDurationInMilliseconds = 1000/60;
function update() {
  let currentTime=performance.now();
  let deltaTime = currentTime-lastTime;
  let ticks = Math.round(deltaTime / frameDurationInMilliseconds);
  if (ticks > 10) ticks=1;
  lastTime=currentTime;
  note = JSON.stringify({ticks,deltaTime});
  
  ticks.times(move);
  draw();
  requestAnimationFrame(update);
}

function move() {
  age+=1;
 scanCogs();

 for (let e of [...level.pegs,...level.cogs]) {
    e.move();
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if (imagesPending.length > 0) {
    ctx.fillText(JSON.stringify(imagesPending),10,10);
    return;
  }

  drawBackdrop(); 
  gameDraw();

  ctx.fillText(note,10,10);

}


function handleMouseDown(e) {
  let x=e.offsetX;
  let y=e.offsetY;
  playSound(Assets.bleep);

  mouseDownPosition= mouseToWorld({x,y});
  if (cogUnderMouse) {
    let cogPos = cogUnderMouse.getPosition();
    let {x,y}=mouseDownPosition;
    let dx=x-cogPos.x;
    let dy=y-cogPos.y;

    dragOffset={dx,dy};
    dragging=cogUnderMouse;
  }
}

function handleMouseUp(e) {
  if (dragging) {
    let peg = pegUnderPos(dragging.getPosition())
    if (peg) {
      dragging.setPeg(peg);
    }
  }
  dragging=false;
}

function mouseToWorld(pos) {
  let x= pos.x-canvas.width/2;
  let y= pos.y-canvas.height/2;
  return {x,y};
}

function distance(a,b) {
  let dx=a.x-b.x;
  let dy=a.y-b.y;
  return Math.sqrt(dx*dx+dy*dy);
}

function cogUnderPos(pos) {
  var best=null;
  for (let cog of level.cogs) {
    if (cog.fixed) continue;
    if (distance(pos,cog.getPeg().getPosition()) < cog.radius) {
      if (best) {
        if (cog.radius<best.radius) {
          best=cog;
        }
      } else best = cog;
    }
  }
  return best;
}

function pegUnderPos(pos) {
  for (let peg of level.pegs) {
    if (distance(pos,peg.getPosition()) < 100) {
      return peg;
    }
  }
  return null;
}


function handleMouseMove(e) {
  let x=e.offsetX;
  let y=e.offsetY;

  mouse={x,y};
  cogUnderMouse=cogUnderPos(mouseToWorld(mouse));
  pegUnderMouse=pegUnderPos(mouseToWorld(mouse));
  note=JSON.stringify(mouseToWorld(mouse));
  if (dragging)  {
    note=JSON.stringify(dragging.getPosition());
  }
}

function gameDraw() {
  ctx.save(); 
  ctx.translate(canvas.width/2,canvas.height/2);

  ctx.save();
  ctx.translate(0,1000);
  let qx = 434;
  let qy = 606;
  ctx.rotate(level.bottom.getAngle()%(Math.PI/50))
  ctx.drawImage(Assets.cog100,-qx,-qy);

  ctx.restore();
  ctx.save();
  ctx.translate(0,-1000);
  ctx.rotate(level.top.getAngle()%(Math.PI/50)+Math.PI);
  ctx.drawImage(Assets.cog100,-qx,-qy);

  ctx.restore();
  
  for (let e of [...level.pegs,...level.cogs]) {
    e.draw();
  }
  if (dragging) {
      //dragging.highlight();    
  } else {
    if (cogUnderMouse) {
      cogUnderMouse.highlight();
    }
  }
  ctx.restore();  
}
function cogTouching(a,b) {
  let apos=a.getPosition();
  let bpos=b.getPosition();
  let d=distance(apos,bpos);
  let want= a.radius+b.radius;
  let e = d-want;
  return (Math.sqrt(e*e)  < 10 );
}

function scanCogs() {
  for(let a of level.cogs) {
    a.direction=0;
  }
  level.bottom.direction=1;

  let movingCogs=[level.bottom];

  function linkNextCog() {
    for (let a of level.cogs) {
      if (a.direction==0) continue;
        for (let b of level.cogs) {
          if (b.direction==0) {
            if (cogTouching(a,b)) {
              b.linkTo(a);
              return true;
            } 
          }
        }
      }
    return false;
  }
  
  while (linkNextCog()) {};

}

function drawSprite(image,x,y,frame=0) {
  let frameWidth = image.width;
  let frameHeight = image.height;
  let oy=0;
  let ox=0;
  if (image.framesWide) {
    frameWidth = image.width / image.framesWide;
    oy= Math.floor(frame/image.framesWide);
  }
  if (image.framesHigh) {
    frameHeight = image.height / image.framesHigh;
    ox= frame%image.framesWide;
  }
  let hx = frameWidth/2;
  let hy = frameHeight/2;

  
    ctx.drawImage(image,ox*frameWidth,oy*frameHeight,frameWidth,frameHeight,x-hx,y-hy,frameWidth,frameHeight);
    

}

function makePeg(placedX,placedY,zoomFrom=1) {
  
  function move(){
    zoomFrom*=0.90;
  }
  function draw() 
  {
    let {x,y} = getPosition();
    drawSprite(Assets.peg,x,y);
  }
  function getPosition() {
    let x= placedX*(1+1*zoomFrom)
    let y= placedY*(1+1*zoomFrom)
    
    return {x,y};
  }
  function setPosition(pos) {
    zoomFrom=0;
    placedX=pos.x;
    placedY=pos.y;
  }
  return {move,draw,getPosition,setPosition}
}



function makeCog(peg,teeth) {
  let mouthFrame=0; 
  let angle=Math.random();
  if (teeth==60) angle=0.6;
  let radius = (teeth*37.7)/(Math.PI*2);
  let eyeSize = radius/10;
  let rotation =(1/radius);
  let toothAngle = Math.PI*2/teeth;
  //if (Math.random()<0.5) rotation=-rotation; 
  let self = {move,draw,getPosition,radius,toothAngle,teeth,setPeg,getPeg,getAngle,getPhase,linkTo,highlight};
  self.direction=0;
  let ratio = (radius+20)/radius;
  //let teeth = Math.floor((radius*Math.PI*2)/38);
  var image; 
  let parts = cogParts[teeth];
  let leftEye; 
  let rightEye;
  
  if (cogImage[teeth]) {
    image = cogImage[teeth];//scaledImage(cogImage[teeth],radius*2.5,radius*2.5);
  } else image = scaledImage(Assets.gear2,radius*2,radius*2);
  
  function getAngle() {
    return angle;
  }
  function getPosition() {
    if (dragging == self) {
      let {x,y}=mouseToWorld(mouse);
      let {dx,dy} = dragOffset;
      x-=dx;
      y-=dy;
      return {x,y};
    } else {
      return peg.getPosition();
    }
  }
  function getPhase(direction = 0) {
    return ((angle+direction)%toothAngle)/toothAngle; 
  }
  
  function setPhase(desiredPhase, direction = 0) {
    let current = getPhase(direction);
    let delta = desiredPhase-current;
    if (delta > 0.5) delta = -1+delta;
    if (delta < -0.5) delta = 1+delta;
    angle+= delta*toothAngle;
    //angle=desiredPhase*toothAngle;
  }
  function linkTo(other) {
    self.direction=-other.direction;
    let a=getPosition();
    let b=other.getPosition();
    var dir=Math.atan2(a.y-b.y,-(a.x-b.x));
    //note=dir;
    setPhase(0.5-other.getPhase(dir),dir+Math.PI);
    
  }
  function makeEyeBall(white,iris,x,y,base = workingImage(white)) {
    let c=base.getContext("2d")
    c.save();
    c.clearRect(0,0,base.width,base.height);
    c.drawImage(white,0,0); 
    c.globalCompositeOperation="source-atop";
    c.translate((base.width)/2+x+iris.x,(base.height)/2 +y+iris.y)
    c.rotate(-angle);
    c.drawImage(iris.image,-(iris.image.width)/2, -(iris.image.height)/2); 
    c.restore();
    return base;
  }
  function drawAt(x,y) {
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle); 

    drawSprite(image,0,0);

    if (parts) {
      leftEye = makeEyeBall(parts.leftWhite.image, parts.leftIris,Math.sin(angle*8)*eyeSize/3,3+Math.cos(angle*8)*eyeSize/3,leftEye);
      drawSprite(leftEye,parts.leftWhite.x,parts.leftWhite.y)
      rightEye = makeEyeBall(parts.leftWhite.image, parts.rightIris,Math.sin(angle*-9)*eyeSize/3,3+Math.cos(angle*-9)*eyeSize/3,rightEye);
      drawSprite(rightEye,parts.rightWhite.x,parts.rightWhite.y)

      drawSprite(parts.mouth.image,parts.mouth.x,parts.mouth.y,mouthFrame);
    }

    ctx.restore();

  }
  function setPeg(newPeg) {
    peg=newPeg;
  }
  function getPeg() {
    return peg;
  }
  function move() {
    if (self == level.bottom) {
      angle+=rotation*self.direction;
    }
    if (probability(0.01)) {
      mouthFrame=1-mouthFrame;
    }
  }
  function draw() {
      let {x,y} = getPosition();
      drawAt(x,y);    
  }
  function highlight() {
    let {x,y} = getPosition();
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle); 
    
    ctx.lineWidth=3;
    ctx.star(0,0,radius,ratio,teeth,0);
    ctx.strokeStyle="rgb(255,255,90)";
    ctx.stroke();  
    ctx.star(0,0,radius+3,ratio,teeth,0);
    ctx.strokeStyle="rgba(255,200,30,0.5)";
    ctx.stroke();  
    ctx.star(0,0,radius-3,ratio,teeth,0);
    ctx.stroke();  

    ctx.restore();
  }
  return self;
  
}


var happy2Angle = 0.46;


var happy2Pos = [621,304];
var happy1Pos = [-180,180];


var angry1Pos = [0,-170];
var angry2Pos = [-60,-100];
var angry3Pos = [470,820];

var tweak = 0;

function drawBackdrop( ) {
  age+=1;

  let shunt=Math.sin(age/30)*50;

  let angryShunt=Math.sin(age/50);

  ctx.save();
  { let  [x,y] = happy2Pos;
    x+=shunt;
    ctx.translate(x,y);
  }
  ctx.rotate(happy2Angle+shunt/350);
  ctx.drawImage(Assets.happy_piston_2,-50,-53);
  ctx.restore();
  { let  [x,y] = happy1Pos;
    x+=shunt;    
    ctx.drawImage(Assets.happy_piston_1,x,y);
  }

  ctx.save();
  ctx.translate(...angry3Pos);
  ctx.rotate(-0.3+angryShunt*0.2);
  ctx.drawImage(Assets.angry_piston_3,-Assets.angry_piston_3.width/2,-Assets.angry_piston_3.height/2);
  ctx.translate(...angry2Pos);
  ctx.rotate(-0.2+(angryShunt*-0.02));
  ctx.drawImage(Assets.angry_piston_2,-28,-45);
  { let [x,y] = angry1Pos;
    x+=(angryShunt+1)*100;
    ctx.translate(x,y);
  }
  ctx.drawImage(Assets.angry_piston_1,100,100);
  ctx.restore();

}