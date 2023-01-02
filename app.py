from flask import Flask, jsonify, render_template, request, redirect
import os
import cv2
from functions import Functions
from werkzeug.utils import secure_filename
from PIL import Image
from IMAGE import ImageClass
from PROCESSING import ProcessingClass
import numpy as np
import matplotlib.pyplot as plt
UPLOAD_FOLDER = 'static/imgs'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__, template_folder="templates")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

values = {"magnitude": {"x1": None, "y1": None, "x2": None, "y2": None},
          "phase": {"x1": None, "y1": None, "x2": None, "y2": None}}
filter = None  # >> 0 for low pass filter and 1 for high pass filter
shape = None  # >> 0 for rectangle and 1  for the circle
imagePath = {"magnitude": "", "phase": "", "combined": ""}
imageNumber = 0
# Main Function(connection the functions together):


def Main(img1, img2, x1_amp, x2_amp, y1_amp, y2_amp, x1_phase, x2_phase, y1_phase, y2_phase, cut_flag, filter_flag):
    print("welcome from the main function here is the images")
    print(x1_amp)
    print(x2_amp)
    print(y1_amp)
    print(y2_amp)
    print(x1_phase)
    print(x2_phase)
    print(y1_phase)
    print(y2_phase)
    combined_image = 0
    cutted_amplitude_img = 0
    cutted_phase_img = 0
    img1_path = ImageClass(path=img1)  # First Object
    img2_path = ImageClass(path=img2)  # Second Object
    image1 = img1_path.read()
    image2 = img2_path.read()

    img1_gray = ImageClass.grayScale(image1)
    img2_gray = ImageClass.grayScale(image2)
    cv2.imwrite('din.png', img1_gray)
    cv2.imwrite('di.png', img2_gray)
    image1_resized = ProcessingClass.Resize(img1_gray)
    image2_resized = ProcessingClass.Resize(img2_gray)

    image1_resized_fft = ImageClass.fourierTransform(image1_resized)
    image2_resized_fft = ImageClass.fourierTransform(image2_resized)

    image1_amplitude, image1_phase = ImageClass.separateMagnitudePhase(
        image1_resized_fft)
    image2_amplitude, image2_phase = ImageClass.separateMagnitudePhase(
        image2_resized_fft)
    image1_amplitude_log=np.log(image1_amplitude+1e-10)
    plt.imsave('image1_amplitude_saved.png', np.log(image1_amplitude+1e-10), cmap='gray')
    plt.imsave('image2_phase_saved.png', image2_phase, cmap='gray')
    if cut_flag == 0:  # Cut in a rectangle shape
        if filter_flag == 0:  # Low Pass Filter

            cutted_phase_img = ProcessingClass.crop_2d_img_rect(
                image2_phase, round(x1_phase), round(x2_phase), round(y1_phase), round(y2_phase))
            cutted_amplitude_img = ProcessingClass.crop_2d_img_rect(
                image1_amplitude, round(x1_amp), round(x2_amp), round(y1_amp), round(y2_amp))
        if filter_flag == 1:  # High Pass Filter
            cutted_phase_img = ProcessingClass.highPassFilterRect(
                image2_phase, round(x1_phase), round(x2_phase), round(y1_phase), round(y2_phase))
            cutted_amplitude_img = ProcessingClass.highPassFilterRect(
                image1_amplitude, round(x1_amp), round(x2_amp), round(y1_amp), round(y2_amp))

    if cut_flag == 1:  # Cut in a circle shape
        radius_phase = ProcessingClass.distance_between_two_points(
            x1_phase, x2_phase, y1_phase, y2_phase)
        radius_magnitude = ProcessingClass.distance_between_two_points(
            x1_amp, x2_amp, y1_amp, y2_amp)
        if filter_flag == 0:  # Low Pass Filter
            cutted_phase_img = ProcessingClass.crop_2d_img_cir(
                image2_phase, x1_phase, y1_phase, radius_phase)
            cutted_amplitude_img = ProcessingClass.crop_2d_img_cir(
                image1_amplitude, x1_amp, y1_amp, radius_magnitude)
        if filter_flag == 1:  # High Pass Filter
            cutted_phase_img = ProcessingClass.highPassFilterCir(
                image2_phase, x1_phase, y1_phase, radius_phase)
            cutted_amplitude_img = ProcessingClass.highPassFilterCir(
                image1_amplitude, x1_amp, y1_amp, radius_magnitude)
    print("hello combined")
    combined_image = ProcessingClass.combination(
        cutted_amplitude_img, cutted_phase_img)
    im = ((combined_image - combined_image.min()) *
          (1/(combined_image.max() - combined_image.min()) * 255)).astype('uint8')
    cv2.imwrite('comb.png', combined_image)

    return combined_image,image2_phase,image1_amplitude_log


def new_image_path(name, imageArray):
    global imageNumber
    imageExtension = name+str(imageNumber)+".png"
    path="static/imgs/"+imageExtension
    if os.path.exists(path):
        os.remove(path)
    imageNumber += 1
    imageExtension = name+str(imageNumber)+".png"
    path="static/imgs/"+imageExtension
    return path

def save_image(file, type):  # the type is choose between magnitude or phase
    name = type+'.'+file.filename.split('.')[-1]
    imagePath[type] = 'static/imgs/'+name
    file_path_mag = os.path.join(app.config['UPLOAD_FOLDER'], name)
    file.save(file_path_mag)
    return file_path_mag


def restart_values(key):
    for item in values[key].keys():
        values[key][item] = None


def set_values(key, list):
    i = 0
    print("it is the list ")
    print(list)
    for item in values[key]:
        values[key][item] = round(list[i])
        i += 1


@app.route('/', methods=['GET'])
def index():
    # print("here")
    # im=cv2.imread(imagePath["magnitude"])/////
    # im = cv2.imshow("image", imagePath["magnitude"])
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    # im = Image.fromarray(combinedImage)
    # cv2.imwrite("static/imgs/combined.png",im)/////
    # get_image_extension(imagePath["magnitude"]),im)
    # global changeOutput/////
    # if changeOutput:
    #     result={"path":"static/imgs/combined.png","valid":True}
    #     return jsonify(result)
    #     changeOutput=False
    return render_template('main.html')


@app.route('/image/<int:id>', methods=['POST'])
def image(id):
    if request.files['file']:
        if id == 1:
            file_mag = request.files['file']
            path=save_image(file_mag, "magnitude")
            restart_values("magnitude")
        else:
            file_phase = request.files['file']
            path=save_image(file_phase, "phase")
            restart_values("phase")
    # image=ImageClass.read(path)
    # image=ImageClass.grayScale(image)


    # result={"id":id,"path":path}
    # return jsonify({})
    return render_template("main.html")


@app.route('/data/<int:id>', methods=['POST'])
def data(id):
    print("here is the function ")
    if request.method == 'POST':
        key = ""
        form = request.get_json()
        print(id)
        print(form)
        if (id == 1):
            key = "magnitude"
        else:
            key = "phase"
        print(form["values"])
        # 0 for rectangle and 1 for circle for index 4 and for index 5 >> 0 for low pass filter and 1 for high pass filter
        global shape, filter
        shape = form["values"][4]
        filter = form["values"][5]
        set_values(key, form["values"])
        magnitude = values['magnitude']
        phase = values["phase"]
        if (magnitude['y2'] != None) and (phase["y2"] != None):
            combinedImage,grayPhase,grayMag = Main(imagePath["magnitude"], imagePath["phase"], magnitude["x1"], magnitude["x2"],
                                 magnitude["y1"], magnitude["y2"], phase["x1"], phase["x2"], phase["y1"], phase["y2"], shape, filter)
            global imageNumber
            # im = cv2.imread(combinedImage)
            result={}
            path=new_image_path("combined", combinedImage)
            cv2.imwrite(path,combinedImage)
            result["combinedPath"]="../"+path

            path=new_image_path("greyMag",grayMag)
            plt.imsave(path,grayMag,cmap="gray")
            result["grayMag"]="../"+path

            path=new_image_path("greyphase",grayPhase)
            plt.imsave(path,grayPhase,cmap="gray")
            result["grayPhase"]="../"+path

            # result = {"compinedPath": "../" +path,"grayPath":}
            # plt.imsave("static/imgs/combined"+imageExtension,greyImage1,cmap="gray")
            # result = {"path": "../static/imgs/combined" +imageExtension}
            return jsonify(result)
    return redirect('/')


if __name__ == '__main__':
    app.run(debug=True)

