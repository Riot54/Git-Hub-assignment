// JavaScript Document

// Global variables
var stage;
var pencil;
var penMark; //graphics instance
var mouseDown = false;
var penSmooth = 1;

// you should give us an assingment to just refactor our code, because I'm not a pro developer and *I* think this code looks awfull.

function init() {
	stage = new createjs.Stage("myCanvas");
	pencil = new createjs.Bitmap("images/pencil.png");

	createjs.Ticker.addEventListener("tick", draw);

	makePenMark();
	makePencil();

	createjs.Ticker.setFPS(30);

	var exportImage = document.querySelector("#export");
	//exportImage.onclick=function(){toImage();} //this wasn't working with an event listener? then the event listener started working, leaving this here in case it breaks again.
	exportImage.addEventListener("click", toImage, false);

	var resetBut = document.querySelector("#reset");
	resetBut.addEventListener("click", resetImage, false);

	var sizeSlide = document.querySelector("#sizeRange");
	sizeSlide.addEventListener("input", function () {setPenSize();}, false);

	//I know global variables are awfull, but it works
	redSlide = document.querySelector("#redRange");
	greenSlide = document.querySelector("#greenRange");
	blueSlide = document.querySelector("#blueRange");
	redSlide.addEventListener("input", function () {setPenColor(redSlide.value, greenSlide.value, blueSlide.value);}, false);
	greenSlide.addEventListener("input", function () {setPenColor(redSlide.value, greenSlide.value, blueSlide.value);}, false);
	blueSlide.addEventListener("input", function () {setPenColor(redSlide.value, greenSlide.value, blueSlide.value);}, false);

	var smoothSlider = document.querySelector("#smoothRange");
	smoothSlider.addEventListener("input", function () {penSmooth = smoothSlider.value; document.getElementById("penSpeed").innerHTML=smoothSlider.value;}, false);

	var eraseCheck = document.querySelector("#toggle");
	eraseCheck.addEventListener("change", function (){
		if(eraseCheck.checked == true){
			console.log('boop');
			setPenColor(256, 256, 256);
		}else{
			setPenColor(redSlide.value, greenSlide.value, blueSlide.value);
		}
	});

	var brushSelect = document.querySelector("#brushShape");
	brushSelect.addEventListener("change", setPenSize);


}



function setPenColor(r, g, b) {

	makePenMark(r, g, b);
	document.getElementById("penRed").innerHTML=r;
	document.getElementById("penGreen").innerHTML=g;
	document.getElementById("penBlue").innerHTML=b;
	
}


function setPenSize() {
	// why do I do it this way you ask? It avoids a bug I Was having
	// where resetting the image changed the stroke back to 1 regardless
	// of the sldier setting.
	var sizeSlide = document.querySelector("#sizeRange");
	var brushSelect = document.querySelector("#brushShape");
	penMark.setStrokeStyle(sizeSlide.value, brushSelect.value);
	document.getElementById("brushSize").innerHTML=sizeSlide.value;
	


}

function makePencil() {
	
	stage.addChild(pencil);
}

function makePenMark(r, g, b) {
	penMark = new createjs.Graphics();
	setPenSize();
	penMark.beginStroke(createjs.Graphics.getRGB(r,g,b));
	var paper = new createjs.Shape(penMark);
	paper.width = 638;
	paper.height = 825;
	stage.addChild(paper);
	makePencil();
	stage.update();
}


function resetImage() {
	stage.removeAllChildren();
	stage.update();
	setPenColor(redSlide.value, greenSlide.value, blueSlide.value);
}


function draw() {
	if(mouseDown == true) {
		pencil.x += (stage.mouseX - pencil.x) * (penSmooth / 10);
		pencil.y += (stage.mouseY - pencil.y) * (penSmooth / 10);
		penMark.lineTo(pencil.x, pencil.y);
		stage.update();
	}
}


function buttonDown(e){
// move pencil to current location of mouse pointer
	if(e.button == 0){
		pencil.x = stage.mouseX;
		pencil.y = stage.mouseY;
		penMark.moveTo(pencil.x, pencil.y);
// set mouse ready state to true
		mouseDown = true;
	}
}


function buttonUp(){
	mouseDown = false;
}


function toImage(){
	var canvasExport =  document.querySelector("#myCanvas");
	if(canvasExport.getContext){
		pencil.visible = false;
		stage.update();
		var ctx = canvasExport.getContext("2d");
		var myImage = canvasExport.toDataURL("image/png");
	}
	window.location = myImage;
	pencil.visible = true;
	stage.update();
}


window.addEventListener("load", init, false);
window.addEventListener("mouseup", buttonUp, false);
window.addEventListener("mousedown", function (e){
	buttonDown(e);}, false);
