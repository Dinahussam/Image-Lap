let magnitudeImageInput = document.querySelector("#magnitudeImageInput");
let phaseImageInput = document.querySelector("#phaseImageInput");
let magnitudeImage = document.querySelector("#magnitudeImage");
let magnitudeImageBtn = document.querySelector(".magnitudeImageBtn");
let phaseImageBtn = document.querySelector(".phaseImageBtn");
let phaseImage = document.querySelector("#phaseImage");
let phaseGray = document.querySelector(".phaseImageGray");
let magnitudeGray = document.querySelector(".magnitudeImageGray");
let resultIcon = document.getElementById("result-icon");
let resultmag = document.getElementById("result-mag");
let resultphase = document.getElementById("result-phase");
let mag_icon = document.querySelector("#mag-icon");
let phase_icon = document.querySelector("#phase-icon");
let btn1 = document.querySelector(".btn1");
let btn2 = document.querySelector(".btn2");
let btn3 = document.querySelector(".btn3");
let btn4 = document.querySelector(".btn4");
let btn5 = document.querySelector(".btn5");
let iamge;
let cir;
let filterFlag = 0;
let shapeFlag = 0;
let rect;
var path = "";
let rectMag;
let rectPhase;
let rectFlag = 1;
let magStage;
let phaseStage;
let rectArray1 = [];
let rectArray2 = [];
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
    success: function (resultPath) {
      {
        console.log("entered send action");
        let image = document.querySelector(".resultImage");
        image.style.display = "flex";
        phaseGray.style.display = "flex";
        magnitudeGray.style.display = "flex";
        magnitudeGray.src = resultPath.grayMag;
        phaseGray.src = resultPath.grayPhase;
        image.src = resultPath.combined;
        resultIcon.style.display = "none";
        resultmag.style.display = "none";
        resultphase.style.display = "none";
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
    width: 350,
    height: 168,
  });
  return stage;
}

function drawLayer(stage) {
  var layer = new Konva.Layer();
  stage.add(layer);
  stage.draw();
  return layer;
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
    if (stage === magStage) {
      if (rectArray1.length > 0) {
        rectMag.destroy();
        valuesMag = [];
      }
    } else {
      if (rectArray2.length > 0) {
        rectPhase.destroy();
        valuesPhase = [];
      }
    }
    isNowDrawing = true;

    rectDown(stage, layer);
  }
  function mousemoveHandler() {
    if (!isNowDrawing) return false;
    rectMove(stage);
  }
  function mouseupHandler() {
    isNowDrawing = false;
    if (stage === magStage) {
      valuesMag = addData(
        rectMag.x(),
        rectMag.y(),
        rectMag.x() + rectMag.width(),
        rectMag.y() + rectMag.height(),
        shapeFlag,
        filterFlag
      );

      if (valuesMag.length === 6) {
        send(1, valuesMag);
      }
    } else {
      valuesPhase = addData(
        rectPhase.x(),
        rectPhase.y(),
        rectPhase.x() + rectPhase.width(),
        rectPhase.y() + rectPhase.height(),
        shapeFlag,
        filterFlag
      );

      if (valuesPhase.length === 6) {
        send(2, valuesPhase);
        console.log(valuesPhase);
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
      x: 2,
      y: 12,
      width: 350,
      height: 168,
    });
    layer.add(theImg);
    layer.draw();
  };
}

function upload(uploadImage, imageType, container, uploadButton, input) {
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
  formData.append("type", imageType);
  formData.append("file", input.files[0]);

  $.ajax({
    type: "POST",
    url: "/image",
    data: formData,
    contentType: false,
    cache: false,
    processData: false,
    async: true,
    success: function () {},
  });
}

magnitudeImageInput.addEventListener("change", () => {
  upload(
    magnitudeImage,
    "magnitude",
    "canvas-magnitude",
    magnitudeImageBtn,
    magnitudeImageInput
  );
});
phaseImageInput.addEventListener("change", () => {
  upload(phaseImage, "phase", "canvas-phase", phaseImageBtn, phaseImageInput);
});

btn1.addEventListener("click", function () {
  for (i = 0; i < stagArray.length; i++) {
    stagArray[i].destroy();
  }
  console.log("delete action ");
  let result = document.querySelector(".resultImage");
  result.style.display = `none`;
  phaseGray.style.display = "none";
  magnitudeGray.style.display = "none";
  magnitudeImageBtn.style.display = `flex`;
  phaseImageBtn.style.display = `flex`;
  resultIcon.style.display = `flex`;
  resultmag.style.display = `flex`;
  resultphase.style.display = `flex`;
  magnitudeImageInput.addEventListener("change", () => {
    upload(
      magnitudeImage,
      "magnitude",
      "canvas-magnitude",
      magnitudeImageBtn,
      magnitudeImageInput
    );
  });
  phaseImageInput.addEventListener("change", () => {
    upload(phaseImage, "phase", "canvas-phase", phaseImageBtn, phaseImageInput);
  });
});

function addData(x1, y1, x2, y2, shape, place) {
  var value = [];
  value.push(x1);
  value.push(y1);
  value.push(x2);
  value.push(y2);
  value.push(shape);
  value.push(place);
  return value;
}

function myFunction() {
  // Get the checkbox
  var checkBox = document.getElementById("myCheck");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true) {
    filterFlag = 1;
  } else {
    filterFlag = 0;
  }
}
