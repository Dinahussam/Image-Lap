let magnitudeImageInput = document.querySelector("#magnitudeImageInput");
let phaseImageInput = document.querySelector("#phaseImageInput");
let magnitudeImage = document.querySelector("#magnitudeImage");
let magnitudeImageBtn = document.querySelector(".magnitudeImageBtn");
let phaseImageBtn = document.querySelector(".phaseImageBtn");
let phaseImage = document.querySelector("#phaseImage");
let imageCrop=document.getElementById('image-box');
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
    cropper = new Cropper( magnitudeImage, {
		});	
    magnitudeImage.addEventListener('cropend', (event) => {
    cropper.getCroppedCanvas().toBlob(function (blob){
      console.log(blob);
      // var formData = new FormData();
      // formData.append('croppedImage', blob);
      // console.log(formData);
      // $.ajax({
      //   type: "POST",
      //   url: "/predict",
      //   data: formData,
      //   contentType: false,
      //   cache: false,
      //   processData: false,
      //   async: true,
      // });
    });
    upload_image_action(magnitudeImage,magnitudeImageBtn);
    });
  });
reader.readAsDataURL(this.files[0]);
});
phaseImageInput.addEventListener("change", function () {
  let reader = new FileReader();
  phaseImage.style.display = `flex`;
  reader.addEventListener("load" ,() => {
    
    path = reader.result;
    phaseImage.src = `${path}`;
    cropper = new Cropper(phaseImage, {
		});	
    phaseImage.addEventListener('cropend', (event) => {
    cropper.getCroppedCanvas().toBlob(function (blob){
      console.log(blob);
      // var formData = new FormData();
    //   formData.append(blob);
    //   $.ajax({
    //     type: "POST",
    //     url: "/predict",
    //     data: formData,
    //     contentType: false,
    //     cache: false,
    //     processData: false,
    //     async: true,
    //   });
    });
    upload_image_action(phaseImage,phaseImageBtn);
    });
  });
reader.readAsDataURL(this.files[0]);
});
