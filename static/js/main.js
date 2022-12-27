let magnitudeImageInput = document.querySelector("#magnitudeImageInput");
let phaseImageInput = document.querySelector("#phaseImageInput");
let magnitudeImageBtn = document.querySelector(".magnitudeImageBtn");
let phaseImageBtn = document.querySelector(".phaseImageBtn");
let rectArray = [];
let magPoints = [];
let phasePoints = [];
var path = "";
let isNowDrawing = false;
function drawStage(contain){
var stage = new Konva.Stage({
  container: contain,
  width: 800,
  height: 300
});
return stage;
}
function drawLayer(stage){
var layer = new Konva.Layer();
stage.add(layer);
stage.draw();
return layer;
}
function zoom(stage){
  
  var scaleBy = 1.01;
  stage.on('wheel', (e) => {
    // stop default scrolling
    e.evt.preventDefault();

    var oldScale = stage.scaleX();
    var pointer = stage.getPointerPosition();

    var mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
});
}
function rectDown(stage,layer){
  rect = new Konva.Rect({
    x: stage.getPointerPosition().x,
    y: stage.getPointerPosition().y,
    width: 0,
    height: 0,
    fill: "transparent",
    stroke: "#14d4ed",
    strokeWidth: 2,
  });
  layer.add(rect);
  layer.draw();
}
function rectMove(stage){
  const newWidth = stage.getPointerPosition().x - rect.x();
  const newHeight = stage.getPointerPosition().y - rect.y();
  rect.width(newWidth);
  rect.height(newHeight);
  return stage.getPointerPosition().x,stage.getPointerPosition().y
}
function drawRect(stage,layer){
  rectArray=[];
  stage.on("mousedown ", mousedownHandler);
  stage.on("mousemove ", mousemoveHandler);
  stage.on("mouseup ", mouseupHandler);
  function mousedownHandler() {
      // console.log(stage.getPointerPosition().x);
      // console.log(stage.getPointerPosition().y);
      rectArray.push(stage.getPointerPosition().x);
      rectArray.push(stage.getPointerPosition().y);
      isNowDrawing = true;
      
      rectDown(stage,layer);
  }
  function mousemoveHandler() {
      
      if (!isNowDrawing) return false;
      rectMove(stage);
  }
  function mouseupHandler() {
    
      isNowDrawing = false;
  }
  
  // rectArray.push(stage.getPointerPosition().y);
  stage.add(layer);
  return rectArray;
}
function drawImage(img,path,layer,stage){
  img.src = `${path}`;
  img.onload = function() {
  var theImg = new Konva.Image({
    image: img,
    x: 0,
    y: 0,
    width: 800,
    height: 300,
  });
  layer.add(theImg);
  layer.draw();
  zoom(stage);
}
}
magnitudeImageInput.addEventListener("change", function () { 
  let reader = new FileReader();
  reader.addEventListener("load" ,() => {
  path = reader.result;
  var magnitudeImage = new Image();  
  stageMagnitude=drawStage('canvas-magnitude');
  layerMagnitude=drawLayer(stageMagnitude);
  drawImage(magnitudeImage,path,layerMagnitude,stageMagnitude);
  magPoints=drawRect(stageMagnitude,layerMagnitude);
  console.log(magPoints);
     // var formData = new FormData();
    //   $.ajax({
    //     type: "POST",
    //     url: "/predict",
    //     data: formData,
    //     contentType: false,
    //     cache: false,
    //     processData: false,
    //     async: true,
    //   });
   // });
  });
  reader.readAsDataURL(this.files[0]);
});
phaseImageInput.addEventListener("change", function () {
  let reader = new FileReader();
  reader.addEventListener("load" ,() => {
  path = reader.result;
  var phaseImage = new Image();  
  stagePhase=drawStage('canvas-phase');
  layerPhase=drawLayer(stagePhase);
  drawImage(phaseImage,path,layerPhase,stagePhase);
  points=drawRect(stagePhase,layerPhase);
  console.log(phasePoints);
      // var formData = new FormData();
    //   $.ajax({
    //     type: "POST",
    //     url: "/predict",
    //     data: formData,
    //     contentType: false,
    //     cache: false,
    //     processData: false,
    //     async: true,
    //   });
   // });
  });
reader.readAsDataURL(this.files[0]);
});
// function  resultImage( returned_data){

//     returned_data = JSON.parse(returned_data)
//     if (returned_data['success'] > 0){ // generation is done
//         const byteCharacters = atob(returned_data['image']);
//         const byteNumbers = new Array(byteCharacters.length);
//         for (let i = 0; i < byteCharacters.length; i++) {
//             byteNumbers[i] = byteCharacters.charCodeAt(i);
//         }
//         const byteArray = new Uint8Array(byteNumbers);
//         document.getElementById("phaseImage-result").src = URL.createObjectURL(new Blob([byteArray], { type: 'image/png' }));
//     }
// }

