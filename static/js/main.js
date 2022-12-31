let magnitudeImageInput = document.querySelector("#magnitudeImageInput");
let phaseImageInput = document.querySelector("#phaseImageInput");
let magnitudeImage = document.querySelector("#magnitudeImage");
let magnitudeImageBtn = document.querySelector(".magnitudeImageBtn");
let phaseImageBtn = document.querySelector(".phaseImageBtn");
let phaseImage = document.querySelector("#phaseImage");
// let imageCrop=document.getElementById('image-box');
let mag_icon = document.querySelector("#mag-icon");
let phase_icon = document.querySelector("#phase-icon");
let rectFlag = 0;
let phaseFlag = 0;
let magFlag=0;
var path = "";
let rect;
let rectArray = [];
let magPoints = [];
let phasePoints = [];
let isNowDrawing = false;
var path = "";
function upload_image_action(image,button) {
  image.style.display = `flex`;
  button.style.display = `none`;
}
function drawStage(contain){
var stage = new Konva.Stage({
  container: contain,
  width: 500,
  height: 320
});
return stage;
}
function drawLayer(stage){
var layer = new Konva.Layer();
stage.add(layer);
stage.draw();
return layer;
}
function circleDown(stage,layer) {
  cir = new Konva.Circle({
    x: stage.getPointerPosition().x,
    y: stage.getPointerPosition().y,
    radius: 0,
    fill: "transparent",
    stroke: "##1d27b6",
    strokeWidth: 4,
  });
  layer.add(cir);
  layer.draw();
}
function circleMove(stage) {
  const rise = Math.pow(stage.getPointerPosition().y - cir.y(), 2);
  const run = Math.pow(stage.getPointerPosition().x - cir.x(), 2);
  const newRadius = Math.sqrt(rise + run);
  cir.radius(newRadius);
}

function rectDown(stage,layer){
  rect = new Konva.Rect({
    x: stage.getPointerPosition().x,
    y: stage.getPointerPosition().y,
    width: 0,
    height: 0,
    fill: "transparent",
    stroke: "#1d27b6",
    strokeWidth: 2,
  });
  layer.add(rect);
  rectArray.push(rect);
  layer.draw();
}
function rectMove(stage){
  const newWidth = stage.getPointerPosition().x - rect.x();
  const newHeight = stage.getPointerPosition().y - rect.y();
  rect.width(newWidth);
  rect.height(newHeight);
}
function drawRect(stage,layer){
  stage.on("mousedown ", mousedownHandler);
  stage.on("mousemove ", mousemoveHandler);
  stage.on("mouseup ", mouseupHandler);
  values=[];
  function mousedownHandler() {
    if(rectArray.length>0){
      rect.destroy();
      values=[];
    }
      isNowDrawing = true;
      values.push(stage.getPointerPosition().x);
      values.push(stage.getPointerPosition().y);
      rectDown(stage,layer);
  }
  function mousemoveHandler() {

      if (!isNowDrawing) return false;
      rectMove(stage);
  }
  function mouseupHandler() {
      isNowDrawing = false;
      values.push(stage.getPointerPosition().x);
      values.push(stage.getPointerPosition().y);
      if(stage===stageMagnitude){
        $.ajax({
        type: "POST",
        url: "/data/1",
        data: JSON.stringify(values),
        contentType: "application/json",
        dataType: 'json'
      });}else{
      $.ajax({
        type: "POST",
        url: "/data/2",
        data: JSON.stringify(values),
        contentType: "application/json",
        dataType: 'json'
      });
    }
  }
  stage.add(layer);
}
function drawImage(img,path,layer){
  img.src = `${path}`;
  img.onload = function() {
  var theImg = new Konva.Image({
    image: img,
    x: 0,
    y: 0,
    width: 500,
    height: 320,
  });
  layer.add(theImg);
  layer.draw();
}
}
magnitudeImageInput.addEventListener("change", function () {
  let reader = new FileReader();
  magnitudeImage.style.display = `flex`;
  reader.addEventListener("load" ,() => {
  path = reader.result;
  stageMagnitude=drawStage('canvas-magnitude');
  layerMagnitude=drawLayer(stageMagnitude);
  drawImage(magnitudeImage,path,layerMagnitude,stageMagnitude);
  drawRect(stageMagnitude,layerMagnitude,magnitudeImage);
  upload_image_action(magnitudeImage,magnitudeImageBtn);
  });
  reader.readAsDataURL(this.files[0]);
  let formData = new FormData();
  formData.append("file", this.files[0]);
    $.ajax({
      type: "POST",
      url: "/image/1",
      data: formData,
      contentType: false,
      cache: false,
      processData: false,
      async: true,
      success: function () {
      },
  });
});
phaseImageInput.addEventListener("change", function () {
  let reader = new FileReader();
  phaseImage.style.display = `flex`;
  reader.addEventListener("load" ,() => {
  path = reader.result;
  stagePhase=drawStage('canvas-phase');
  layerPhase=drawLayer(stagePhase);
  drawImage(phaseImage,path,layerPhase,stagePhase);
  drawRect(stagePhase,layerPhase,phaseImage);
  upload_image_action(phaseImage,phaseImageBtn);
  });
reader.readAsDataURL(this.files[0]);
let formData = new FormData();
  formData.append("file", this.files[0]);
  $.ajax({
      type: "POST",
      url: "/image/2",
      data: formData,
      contentType: false,
      cache: false,
      processData: false,
      async: true,
      success: function () {
      },
  });
});
