let magnitudeImageInput = document.querySelector("#magnitudeImageInput");
let phaseImageInput = document.querySelector("#phaseImageInput");
let magnitudeImage = document.querySelector("#magnitudeImage");
let magnitudeImageBtn = document.querySelector(".magnitudeImageBtn");
let phaseImageBtn = document.querySelector(".phaseImageBtn");
let phaseImage = document.querySelector("#phaseImage");
let mag_icon = document.querySelector("#mag-icon");
let phase_icon = document.querySelector("#phase-icon");
var iamge;
let rectFlag = 1;
// let phaseFlag = 0;
// let magFlag=0;
var path = "";
let rect;
let cir;
var tr1;
var circleFlag=0;
var containerUsed;
// var stageUsed;
let rectArray = [];
let cirArray=[];
let stagArray=[];
let isNowDrawing = false;
var path = "";
function send(id){
      $.ajax({
        type: "POST",
        url: "/data/"+id,
        data: JSON.stringify({values}),
        contentType: "application/json",
        dataType: 'json'
      });
}
function upload_image_action(image,button) {
  image.style.display = `flex`;
  button.style.display = `none`;
}
function drawStage(contain){
containerUsed=contain;
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
    strokeWidth: 2,
  });
  layer.add(cir);
  cirArray.push(cir);
  layer.draw();
}
function circleMove(stage) {
  const rise = Math.pow(stage.getPointerPosition().y - cir.y(), 2);
  const run = Math.pow(stage.getPointerPosition().x - cir.x(), 2);
  console.log(rise);
  console.log(run);
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
  //layer.draw();
  // tr1 = new Konva.Transformer({
  //   nodes: [rect],
  //   // ignore stroke in size calculations
  //   ignoreStroke: true,
  //   // manually adjust size of transformer
  //   padding: 5,
  // });
  // layer.add(tr1);
  layer.draw();
  
}
function rectMove(stage){
  const newWidth = stage.getPointerPosition().x - rect.x();
  const newHeight = stage.getPointerPosition().y - rect.y();
  rect.width(newWidth);
  rect.height(newHeight);
}
function drawRect(stage,layer){
  stage.on("mousedown ",(e)=> mousedownHandler(e));
  stage.on("mousemove ", mousemoveHandler);
  stage.on("mouseup ", mouseupHandler);
  values=[];
  function mousedownHandler() {
    
    if(rectArray.length>0){
      rect.destroy();
      values=[];
    }
    if(cirArray.length>0){
        cir.destroy();
        values=[];
    }
    if(stage.getpointerPosition===tr1){
      isNowDrawing=false;
    }
      isNowDrawing = true;
      values.push(stage.getPointerPosition().x);
      values.push(stage.getPointerPosition().y);
      if(circleFlag===1){
      circleDown(stage,layer);
      }else{
      rectDown(stage,layer);  
      } 
  }
  function mousemoveHandler() {
      if (!isNowDrawing) return false;
      if(circleFlag===1){
        circleMove(stage);
      }else{
      rectMove(stage);
      }
  }
  function mouseupHandler() {
      isNowDrawing = false;
      values.push(stage.getPointerPosition().x);
      values.push(stage.getPointerPosition().y);
      
      if(containerUsed==="canvas-magnitude"){
        send(1);
        console.log(values);
      }else if(containerUsed==="canvas-phase"){
        send(2);
    }
  }
  stage.add(layer);
}
function drawImage(img,path,layer){
  img.src = `${path}`;
  
  img.onload = function() {
  theImg = new Konva.Image({
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
magnitudeImageInput.addEventListener("change",() => { 
  upload(magnitudeImage,1,"canvas-magnitude",magnitudeImageBtn,magnitudeImageInput)
}
  );
phaseImageInput.addEventListener("change",()=> {
upload(phaseImage,2,"canvas-phase",phaseImageBtn,phaseImageInput)
}
);
function upload(uploadImage,number,container,uploadButton,input){
  reader = new FileReader();
  uploadImage.style.display = `flex`;
  reader.addEventListener("load" ,() => {
  path = reader.result;
  stage=drawStage(container);
  stagArray.push(stage);
  layer=drawLayer(stage);
  image=drawImage(uploadImage,path,layer,stage);
  drawRect(stage,layer,uploadImage);
  upload_image_action(uploadImage,uploadButton);
  });
  reader.readAsDataURL(input.files[0]);
  
  let formData = new FormData();
  formData.append("file", input.files[0]);
    $.ajax({
      type: "POST",
      url: "/image/"+number,
      data: formData,
      contentType: false,
      cache: false,
      processData: false,
      async: true,
      success: function () {
      },
  });
}
function deleteData(){
  for(i=0;i<stagArray.length;i++){
  stagArray[i].destroy();  
  }
  magnitudeImageBtn.style.display = `flex`;
  phaseImageBtn.style.display=`flex`;
  magnitudeImageInput.addEventListener("change",() => { 
    upload(magnitudeImage,1,"canvas-magnitude",magnitudeImageBtn,magnitudeImageInput)
  }
    );
  phaseImageInput.addEventListener("change",()=> {
  upload(phaseImage,2,"canvas-phase",phaseImageBtn,phaseImageInput)
  }
  );
}
function dataCircle(){
  circleFlag=1;
  rectFlag=0;
}
function dataRect(){
  circleFlag=0;
  rectFlag=1;
}