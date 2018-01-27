
imageList = [
    "gear2.svg",
    "cog8.png",
    "cog12.png",
    "cog16.png",
    "cog20.png",
    "cog100.png",
    "eyeball.png",
    "cog100.png",

    "8_left_iris.png",
    "8_left_white.png",
    "8_right_iris.png",
    "8_right_white.png",

    "12_left_iris.png",
    "12_left_white.png",
    "12_right_iris.png",
    "12_right_white.png",

    "16_left_iris.png",
    "16_right_iris.png",
    "16_left_white.png",
    "16_right_white.png",

    "20_left_iris.png",
    "20_right_iris.png",
    "20_left_white.png",
    "20_right_white.png",


    "8-12_mouth.png|2|1",
    "16-20_mouth.png|2|1",

    "angry_piston_1.png",
    "angry_piston_2.png",
    "angry_piston_3.png",
    "happy_piston_1.png",
    "happy_piston_2.png",

    "intro_screen.png",
    "peg.png",
    "blarg.png|10|1"
].map(imageDetailsFromString);

var soundList = ["bleep.wav"];

var imagesPending = [];
var Assets = {};

var audioContext = new AudioContext();

function loadImage (url) {
    imagesPending.push(url);

    var result = new Image();
    result.onload =e=>imagesPending.remove(url);
    result.src = url;

    let name = url.slice(url.lastIndexOf("/")+1);
    Assets[name.replace(/\.[^/.]+$/, "")]=result;
    return result;
}

function imageDetailsFromString(s) {
    let [name,framesWide=1,framesHigh=1] = s.split("|");
    name="images/"+name;
    return {name,framesWide,framesHigh}
}

function playSound(buffer) {
  var source = audioContext.createBufferSource();
  source.buffer = buffer;                   
  source.connect(audioContext.destination);      
  source.start(0);                               
}

function loadSound(url) {
    var onError = a=>(console.log(a));
    console.log(url);
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  let name = url.slice(url.lastIndexOf("/")+1).replace(/\.[^/.]+$/, "");
  Assets[name]=audioContext.createBuffer(1,1,44100);//temporary null buffer until loaded
  // Decode asynchronously
  request.onload = function() {
      console.log(name+" loaded");
    audioContext.decodeAudioData(request.response, function(buffer) {
      Assets[name]=buffer;
    }, onError);
  }
  request.send();
}

var cogParts =[];
function loadAssets() {
    
    for (let i of imageList) {
        
        let image = loadImage(i.name);
        image.framesWide=i.framesWide;
        image.framesHigh=i.framesHigh;
    }

    for (let s of soundList) {
        loadSound("sounds/"+s);
    }
    function pos(name,x,y) {
        let image = Assets[name];
        return {image,x,y}
    }

    let cog8Parts = {
        leftIris : pos("8_left_iris",0,-2),
        rightIris : pos("8_right_iris",0,-2),
        leftWhite : pos("8_left_white",-13,-7),
        rightWhite : pos("8_right_white",18,-4),
        mouth: pos("8-12_mouth",-3,17),
    }
    let cog12Parts = {
        leftIris : pos("12_left_iris",0,-2),
        rightIris : pos("12_right_iris",0,-2),
        leftWhite : pos("12_left_white",-25,-19),
        rightWhite : pos("12_right_white",23,-14),
        mouth: pos("8-12_mouth",-1,19),
    }

    let cog16Parts = {
        leftIris : pos("16_left_iris",0,-3),
        rightIris : pos("16_right_iris",0,-3),
        leftWhite : pos("16_left_white",-33,-30),
        rightWhite : pos("16_right_white",16,-21),
        mouth: pos("16-20_mouth",-1,37),

    }
    
    let cog20Parts = {
        leftIris : pos("20_left_iris",-0,-3),
        rightIris : pos("20_right_iris",0,-3),
        leftWhite : pos("20_left_white",-35,-36),
        rightWhite : pos("20_right_white",14,-27),
        mouth: pos("16-20_mouth",+5,36),
        
    }
    

    cogParts[8]=cog8Parts;
    cogParts[12]=cog12Parts;
    cogParts[16]=cog16Parts;
    cogParts[20]=cog20Parts;
    
    
}
//imageList.forEach(loadImage);
loadAssets();
function scaledImage(image, w,h=w) {
    var result=document.createElement("canvas");

    result.width=w;
    result.height=h;

    let ctx=result.getContext("2d");
    
    ctx.drawImage(image,0,0,image.width,image.height,0,0,w,h);
    return result;
}

function workingImage(from,paddingLeft=0,paddingTop=paddingLeft,paddingRight=paddingLeft,paddingBottom=paddingTop) {
    var result=document.createElement("canvas");

    result.width=from.width+paddingLeft+paddingRight;
    result.height=from.width+paddingTop+paddingBottom;


    let ctx=result.getContext("2d");
    ctx.drawImage(from,paddingLeft,paddingTop);
    return result;
}

function blankCanvas(w,h=w) {
    var result=document.createElement("canvas");
    result.width=w;
    result.height=h;
    return result;
}