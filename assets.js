
imageList = [
    "gear2.svg",
    "cog8.png",
    "cog12.png",
    "cog16.png",
    "cog20.png",
    "cog100.png",
    "eyeball.png",

    "blarg.png|10|1"
].map(imageDetailsFromString);


var imagesPending = [];
var Assets = {};

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

function loadAssets() {
    for (let i of imageList) {
        
        let image = loadImage(i.name);
        image.framesWide=i.framesWide;
        image.framesHigh=i.framesHigh;
    }
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