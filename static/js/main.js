let magnitudeImageInput = document.querySelector("#magnitudeImageInput");
let phaseImageInput = document.querySelector("#phaseImageInput");
let magnitudeImageBtn = document.querySelector(".magnitudeImageBtn");
let phaseImageBtn = document.querySelector(".phaseImageBtn");
let magnitudeImage = document.querySelector("#magnitudeImage");
let phaseImage = document.querySelector("#phaseImage");
let mag_icon = document.querySelector("#mag-icon");
let phase_icon = document.querySelector("#phase-icon");
let magFlag = 0;
let phaseFlag = 0;
var path = "";
function getIndex(cropped, image) {
  image.addEventListener("cropend", (event) => {
    var data = cropped.getData();
    values = Object.values(data);
    console.log(values);
    //   if(image===magnitudeImage){
    //   $.ajax({
    //     type: "POST",
    //     url: "/data/1",
    //     data: JSON.stringify({values}),
    //     contentType: "application/json",
    //     dataType: 'json'
    //   });
    // }else{
    //   $.ajax({
    //     type: "POST",
    //     url: "/data/2",
    //     data: JSON.stringify({values}),
    //     contentType: "application/json",
    //     dataType: 'json'
    //   });
    // }
  });
}
function upload_image_action(image, button, icon) {
  button.style.display = `none`;
  icon.style.display = `none`;
}
magnitudeImageInput.addEventListener("change", function () {
  let reader = new FileReader();
  magnitudeImage.style.display = `flex`;
  reader.addEventListener("load", () => {
    path = reader.result;
    magnitudeImage.src = `${path}`;
    cropper1 = new Cropper(magnitudeImage, {});
    getIndex(cropper1, magnitudeImage);
    upload_image_action(magnitudeImage, magnitudeImageBtn, mag_icon);
  });
  reader.readAsDataURL(this.files[0]);
  let formData = new FormData();
  formData.append("file", this.files[0]);
  console.log(formData);
  //   $.ajax({
  //     type: "POST",
  //     url: "/image/1",
  //     data: formData,
  //     contentType: false,
  //     cache: false,
  //     processData: false,
  //     async: true,
  //     success: function () {
  //     },
  // });
});
phaseImageInput.addEventListener("change", function () {
  let reader = new FileReader();
  phaseImage.style.display = `flex`;
  reader.addEventListener("load", () => {
    path = reader.result;
    path = reader.result;
    phaseImage.src = `${path}`;
    cropper2 = new Cropper(phaseImage, {});
    getIndex(cropper2, phaseImage);
    upload_image_action(phaseImage, phaseImageBtn, phase_icon);
  });
  reader.readAsDataURL(this.files[0]);
  let formData = new FormData();
  formData.append("file", this.files[0]);
  console.log(formData);
  // $.ajax({
  //   type: "POST",
  //   url: "/image/2",
  //   data: formData,
  //   contentType: false,
  //   cache: false,
  //   processData: false,
  //   async: true,
  //   success: function () {
  //   },
  // });
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
