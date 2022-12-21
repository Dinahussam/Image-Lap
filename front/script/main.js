let magnitudeImageInput = document.querySelector("#magnitudeImageInput");
let phaseImageInput = document.querySelector("#phaseImageInput");
let magnitudeImage = document.querySelector(".magnitudeImage");
let magnitudeImageBtn = document.querySelector(".magnitudeImageBtn");
let phaseImageBtn = document.querySelector(".phaseImageBtn");
let phaseImage = document.querySelector(".phaseImage");
var path = "";

function upload_image_action(image,button) {
  image.style.display = `flex`;
  button.style.display = `none`;
}

magnitudeImageInput.addEventListener("change", function () {
  let reader = new FileReader();
  magnitudeImage.style.display = `flex`;
  reader.addEventListener("load", () => {
    path = reader.result;
    magnitudeImage.src = `${path}`;
    upload_image_action(magnitudeImage,magnitudeImageBtn);
  });
  reader.readAsDataURL(this.files[0]);
});

phaseImageInput.addEventListener("change", function () {
  let reader = new FileReader();
  phaseImage.style.display = `flex`;
  reader.addEventListener("load", () => {
    path = reader.result;
    phaseImage.src = `${path}`;
    upload_image_action(phaseImage,phaseImageBtn);
  });
  reader.readAsDataURL(this.files[0]);
});
