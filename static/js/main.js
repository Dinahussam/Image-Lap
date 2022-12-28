let magnitudeImageInput = document.querySelector("#magnitudeImageInput");
let phaseImageInput = document.querySelector("#phaseImageInput");
let magnitudeImageBtn = document.querySelector(".magnitudeImageBtn");
let phaseImageBtn = document.querySelector(".phaseImageBtn");
let magnitudeImage = document.querySelector("#magnitudeImage");
let phaseImage = document.querySelector("#phaseImage");
let magFlag=0;
let phaseFlag=0;
var path = "";
function getIndex(image,path){
  image.src = `${path}`;
  cropper = new Cropper( image, {
  });	
  image.addEventListener('crop', (event) => {
  cropper.getCroppedCanvas().toBlob(function (blob){
    console.log(blob);
    var data=cropper.getData();
    var indexs=Object.values(data);
    console.log(data);
    console.log(indexs);
    var formData = new FormData();
    formData.append('croppedImage', blob);
    console.log(formData);
    // $.ajax({
    //   type: "POST",
    //   url: "/image",
    //   data: formData,
    //   contentType: false,
    //   cache: false,
    //   processData: false,
    //   async: true,
    // });
  });
  });
 
}
function upload_image_action(image,button) {
  button.style.display = `none`;
}
magnitudeImageInput.addEventListener("change", function () { 
  let reader = new FileReader();
  magnitudeImage.style.display = `flex`;
  reader.addEventListener("load" ,() => {
  path = reader.result;
  getIndex(magnitudeImage,path);
  upload_image_action(magnitudeImage,magnitudeImageBtn);
  });
  reader.readAsDataURL(this.files[0]);
});
phaseImageInput.addEventListener("change", function () {
  let reader = new FileReader();
  phaseImage.style.display = `flex`;
  reader.addEventListener("load" ,() => {
  path = reader.result;
  getIndex(phaseImage,path);
  upload_image_action(phaseImage,magnitudeImageBtn);
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
