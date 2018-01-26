
imageList = [
    "gear2.svg",
    "cog8.svg",
    "cog12.svg",
    "cog16.svg",
    "cog20.svg"
].map(a=>"images/"+a);

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

imageList.forEach(loadImage);

function scaledImage(image, w,h=w) {
    var result=document.createElement("canvas");

    result.width=w;
    result.height=h;

    let ctx=result.getContext("2d");
    
    ctx.drawImage(image,0,0,image.width,image.height,0,0,w,h);
    return result;
}