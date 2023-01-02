let magnitudeImageInput = document.querySelector("#magnitudeImageInput");
let phaseImageInput = document.querySelector("#phaseImageInput");
let magnitudeImage = document.querySelector("#magnitudeImage");
let magnitudeImageBtn = document.querySelector(".magnitudeImageBtn");
let phaseImageBtn = document.querySelector(".phaseImageBtn");
let phaseImage = document.querySelector("#phaseImage");
let mag_icon = document.querySelector("#mag-icon");
let phase_icon = document.querySelector("#phase-icon");
let b1 = document.querySelector(".b1");
let b2 = document.querySelector(".b2");
let b3 = document.querySelector(".b3");
let b4 = document.querySelector(".b4");
let b5 = document.querySelector(".b5");
let iamge;
let cir;
let filterFlag = 0;
let shapeFlag = 0;
let rect;
var path = "";
let rectMag;
let rectPhase;
let cirMag;
let cirPhase;
let rectFlag = 1;
let circleFlag = 0;
let magStage;
let phaseStage;
let rectArray1 = [];
let rectArray2 = [];
let cirArray1 = [];
let cirArray2 = [];
let stagArray = [];
let isNowDrawing = false;
var path = "";

function send(id, values) {
  console.log(id);
  $.ajax({
    type: "POST",
    url: "/data/" + id,
    data: JSON.stringify({ values }),
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      { console.log("entered send action")
        let image = document.querySelector(".resultImage");
        image.style.display="flex"
        console.log("path is ");
        console.log(response["path"]);
        image.src = response["path"];
        resultIcon=document.getElementById("result-icon")
        resultIcon.style.display="none"
      }
    },
  });
}

function upload_image_action(image, button) {
  image.style.display = `flex`;
  button.style.display = `none`;
}

function drawStage(contain) {
  containerUsed = contain;
  var stage = new Konva.Stage({
    container: contain,
    width: 3700,
    height: 180,
  });
  return stage;
}

function drawLayer(stage) {
  var layer = new Konva.Layer();
  stage.add(layer);
  stage.draw();
  return layer;
}

function circleDown(stage, layer) {
  cir = new Konva.Circle({
    x: stage.getPointerPosition().x,
    y: stage.getPointerPosition().y,
    radius: 0,
    fill: "transparent",
    stroke: "##1d27b6",
    strokeWidth: 2,
  });
  if (stage === magStage) {
    cirMag = cir;
    layer.add(cirMag);
    cirArray1.push(cirMag);
  } else {
    cirPhase = cir;
    layer.add(cirPhase);
    cirArray2.push(cirPhase);
  }
  // if(containerUsed==="canvas-magnitude"){
  //   cirArray1.push(cir);
  //   }else{
  //     cirArray2.push(cir);
  //   }
  layer.draw();
  // tr1 = new Konva.Transformer({
  //   nodes: [cir],
  //   // ignore stroke in size calculations
  //   ignoreStroke: true,
  //   // manually adjust size of transformer
  //   padding: 5,
  // });
  // layer.add(tr1);
  // layer.draw();
}
function circleMove(stage) {
  const rise = Math.pow(stage.getPointerPosition().y - cir.y(), 2);
  const run = Math.pow(stage.getPointerPosition().x - cir.x(), 2);
  const newRadius = Math.sqrt(rise + run);
  cir.radius(newRadius);
}
function rectDown(stage, layer) {
  rect = new Konva.Rect({
    x: stage.getPointerPosition().x,
    y: stage.getPointerPosition().y,
    width: 0,
    height: 0,
    fill: "transparent",
    stroke: "#1d27b6",
    strokeWidth: 2,
  });
  if (stage === magStage) {
    rectMag = rect;
    layer.add(rectMag);
    rectArray1.push(rectMag);
  } else {
    rectPhase = rect;
    layer.add(rectPhase);
    rectArray2.push(rectPhase);
  }
  // if(containerUsed==="canvas-magnitude"){
  // rectArray1.push(rect);
  // }else{
  //   rectArray2.push(rect);
  // }
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
function rectMove(stage) {
  const newWidth = stage.getPointerPosition().x - rect.x();
  const newHeight = stage.getPointerPosition().y - rect.y();
  rect.width(newWidth);
  rect.height(newHeight);
}
function drawRect(stage, layer) {
  stage.on("mousedown ", (e) => mousedownHandler(e));
  stage.on("mousemove ", mousemoveHandler);
  stage.on("mouseup ", mouseupHandler);
  let valuesMag = [];
  let valuesPhase = [];
  function mousedownHandler() {
    //   if(containerUsed==="canvas-magnitude"){
    //   if(rectArray1.length>0 ){
    //     isNowDrawing=false;
    //     values=[];
    //   }else{
    //     isNowDrawing = true;
    //     if(circleFlag===1){
    //     circleDown(stage,layer);
    //     }else{
    //     rectDown(stage,layer);
    //     }
    //   }
    // }else{
    //   if(rectArray2.length>0){
    //     isNowDrawing=false;
    //     values=[];
    //   }else{
    //     isNowDrawing = true;
    //     if(circleFlag===1){
    //     circleDown(stage,layer);
    //     }else{
    //     rectDown(stage,layer);
    //     }
    //   }
    // }
    if (stage === magStage) {
      if (rectArray1.length > 0) {
        rectMag.destroy();
        valuesMag = [];
      }
      if (cirArray1.length > 0) {
        cirMag.destroy();
        valuesMag = [];
      }
      // valuesMag.push(stage.getPointerPosition().x);
      // valuesMag.push(stage.getPointerPosition().y);
    } else {
      if (rectArray2.length > 0) {
        rectPhase.destroy();
        valuesPhase = [];
      }
      if (cirArray2.length > 0) {
        cirPhase.destroy();
        valuesPhase = [];
      }
      // valuesPhase.push(stage.getPointerPosition().x);
      // valuesPhase.push(stage.getPointerPosition().y);
    }
    isNowDrawing = true;
    if (circleFlag === 1) {
      circleDown(stage, layer);
    } else {
      rectDown(stage, layer);
    }
  }
  function mousemoveHandler() {
    if (!isNowDrawing) return false;
    if (circleFlag === 1) {
      circleMove(stage);
    } else {
      rectMove(stage);
    }
  }
  function mouseupHandler() {
    isNowDrawing = false;
    if (stage === magStage) {
      if(circleFlag===1){
        console.log(stage.getPointerPosition().x)
        valuesMag.push(cirMag.x());
        valuesMag.push(cirMag.y());
        valuesMag.push(stage.getPointerPosition().x);
        valuesMag.push(stage.getPointerPosition().y);
      } else{
      valuesMag.push(rectMag.x());
      valuesMag.push(rectMag.y());
      valuesMag.push(rectMag.x()+rectMag.width());
      valuesMag.push(rectMag.y()+rectMag.height());
      }
      valuesMag.push(shapeFlag);
      valuesMag.push(filterFlag);
      if (valuesMag.length === 6) {
        send(1, valuesMag);
        console.log(valuesMag);
      }
    } else {
      if(circleFlag===1){
        console.log(stage.getPointerPosition().x)
        valuesPhase.push(cirPhase.x());
        valuesPhase.push(cirPhase.y());
        valuesPhase.push(stage.getPointerPosition().x);
        valuesPhase.push(stage.getPointerPosition().y);
      } else{
      valuesPhase.push(rectPhase.x());
      valuesPhase.push(rectPhase.y());
      valuesPhase.push(rectPhase.x()+rectPhase.width());
      valuesPhase.push(rectPhase.y()+rectPhase.height());
      }
      valuesPhase.push(shapeFlag);
      valuesPhase.push(filterFlag);
      if(valuesPhase.length===6){
      send(2, valuesPhase);
      }
    }
  }
  stage.add(layer);
}
function drawImage(img, path, layer) {
  img.src = `${path}`;
  img.onload = function () {
    theImg = new Konva.Image({
      image: img,
      x: 0,
      y: 0,
      width: 380,
      height: 200,
    });
    layer.add(theImg);
    layer.draw();
  };
}
magnitudeImageInput.addEventListener("change", () => {
  upload(
    magnitudeImage,
    1,
    "canvas-magnitude",
    magnitudeImageBtn,
    magnitudeImageInput
  );
});
phaseImageInput.addEventListener("change", () => {
  upload(phaseImage, 2, "canvas-phase", phaseImageBtn, phaseImageInput);
});

function upload(uploadImage, number, container, uploadButton, input) {
  reader = new FileReader();
  uploadImage.style.display = `flex`;
  reader.addEventListener("load", () => {
    path = reader.result;
    stage = drawStage(container);
    if (container == "canvas-magnitude") {
      magStage = stage;
    } else {
      phaseStage = stage;
    }
    stagArray.push(stage);
    layer = drawLayer(stage);
    image = drawImage(uploadImage, path, layer, stage);
    drawRect(stage, layer, uploadImage);
    upload_image_action(uploadImage, uploadButton);
  });
  reader.readAsDataURL(input.files[0]);

  let formData = new FormData();
  formData.append("file", input.files[0]);
  $.ajax({
    type: "POST",
    url: "/image/" + number,
    data: formData,
    contentType: false,
    cache: false,
    processData: false,
    async: true,
    success: function () {},
  });
}
// function deleteData() {
//   for (i = 0; i < stagArray.length; i++) {
//     stagArray[i].destroy();
//   }
//   magnitudeImageBtn.style.display = `flex`;
//   phaseImageBtn.style.display = `flex`;
//   magnitudeImageInput.addEventListener("change", () => {
//     upload(
//       magnitudeImage,
//       1,
//       "canvas-magnitude",
//       magnitudeImageBtn,
//       magnitudeImageInput
//     );
//   });
//   phaseImageInput.addEventListener("change", () => {
//     upload(phaseImage, 2, "canvas-phase", phaseImageBtn, phaseImageInput);
//   });
// }
// function dataCircle() {
//   circleFlag = 1;
//   rectFlag = 0;
//   shapeFlag = 1;
//   rectMag.destroy();
//   rectPhase.destroy();
// }
// function dataRect() {
//   circleFlag = 0;
//   rectFlag = 1;
//   shapeFlag = 0;
//   cirMag.destroy();
//   cirPhase.destroy();
// }
// function highFilter() {
//   filterFlag = 1;
// }
// function lowFilter() {
//   filterFlag = 0;
// }

b1.addEventListener("click", function () {
  for (i = 0; i < stagArray.length; i++) {
    stagArray[i].destroy();
  }
  console.log("delete action ")
  let result= document.querySelector(".resultImage");
  result.style.display = `none`;
  magnitudeImageBtn.style.display = `flex`;
  phaseImageBtn.style.display = `flex`;
  magnitudeImageInput.addEventListener("change", () => {
    upload(
      magnitudeImage,
      1,
      "canvas-magnitude",
      magnitudeImageBtn,
      magnitudeImageInput
    );
  });
  phaseImageInput.addEventListener("change", () => {
    upload(phaseImage, 2, "canvas-phase", phaseImageBtn, phaseImageInput);
  });
});

b2.addEventListener("click", function () {
  circleFlag = 1;
  rectFlag = 0;
  shapeFlag = 1;
  if(rectArray1.length>0){
  rectMag.destroy();
  }
  if(rectArray2.length>0){
  rectPhase.destroy();
}
});


b3.addEventListener("click", function () {
  circleFlag = 0;
  rectFlag = 1;
  shapeFlag = 0;
  cirMag.destroy();
  cirPhase.destroy();
});

b4.addEventListener("click", function () {
  filterFlag = 1;
});

b5.addEventListener("click", function () {
  filterFlag = 0;
});
