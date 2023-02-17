from flask import Flask, jsonify, render_template, request, redirect
import os
import cv2
# from functions import Functions
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
    combined_image = 0
    img_arr = [img1, img2]
    output_amplitude_phase = []
    # output_phase = []
    for i in img_arr:
        img_path = ImageClass(path=i)
        # img1_path = ImageClass(path=img1)  # First Object
        # img2_path = ImageClass(path=img2)  # Second Object
        image = img_path.read()
        # image1 = img1_path.read()
        # image2 = img2_path.read()

        img_gray = ImageClass.grayScale(image)
        # img1_gray = ImageClass.grayScale(image1)
        # img2_gray = ImageClass.grayScale(image2)

        image_resized = ProcessingClass.Resize(img_gray)
        # image1_resized = ProcessingClass.Resize(img1_gray)
        # image2_resized = ProcessingClass.Resize(img2_gray)

        image_resized_fft = ImageClass.fourierTransform(image_resized)
        # image1_resized_fft = ImageClass.fourierTransform(image1_resized)
        # image2_resized_fft = ImageClass.fourierTransform(image2_resized)

        image_amplitude, image_phase = ImageClass.separateMagnitudePhase(image_resized_fft)
        output_amplitude_phase.append(image_amplitude)
        output_amplitude_phase.append(image_phase)
        # image1_amplitude, image1_phase = ImageClass.separateMagnitudePhase(image1_resized_fft)
        # image2_amplitude, image2_phase = ImageClass.separateMagnitudePhase(image2_resized_fft)

        image1_amplitude_log = np.log(output_amplitude_phase[0] + 1e-10)


    phase = ProcessingClass.rect(output_amplitude_phase[3], x1_phase, x2_phase, y1_phase, y2_phase, filter_flag)
    magnitude = ProcessingClass.rect(output_amplitude_phase[0], x1_amp, x2_amp, y1_amp, y2_amp, filter_flag)

    combined_image = ProcessingClass.combination(magnitude, phase)
    

    return combined_image, output_amplitude_phase[3], image1_amplitude_log


def crete_delete_image(name, number, delete=False):
    imageName = name+str(number)+".png"
    path = "static/imgs/"+imageName
    if(delete):
        if (os.path.exists(path)):
            os.remove(path)
    else:
        return path


def new_image_path(names):
    paths = {}
    global imageNumber
    for name in names:
        crete_delete_image(name, imageNumber, delete=True)
        paths[name] = "../" +crete_delete_image(name, imageNumber+1, delete=False)
    imageNumber+=1
    return paths

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


def upload_process(file, type):
    save_image(file, type)
    restart_values(type)


@app.route('/', methods=['GET'])
def index():

    return render_template('main.html')


@app.route('/image', methods=['POST'])
def image():
    file = request.files['file']
    type = request.form["type"]
    upload_process(file, type)
    return render_template("main.html")

@app.route('/data/<int:id>', methods=['POST'])
def data(id):
    print("here is the function ")
    if request.method == 'POST':
        key = ""
        form = request.get_json()
        if (id == 1):
            key = "magnitude"
        else:
            key = "phase"
        # 0 for rectangle and 1 for circle for index 4 and for index 5 >> 0 for low pass filter and 1 for high pass filter
        global shape, filter
        shape = form["values"][4]
        filter = form["values"][5]
        set_values(key, form["values"])

        magnitude = values['magnitude']
        phase = values["phase"]
        if (magnitude['y2'] != None) and (phase["y2"] != None):
            combinedImage, grayPhase, grayMag = Main(imagePath["magnitude"], imagePath["phase"], magnitude["x1"], magnitude["x2"],
                                                    magnitude["y1"], magnitude["y2"], phase["x1"], phase["x2"], phase["y1"], phase["y2"], shape, filter)
            # im = cv2.imread(combinedImage)
            imagesName = ["combined", "grayMag", "grayPhase"]
            # imagesValues = [combinedImage, grayMag, grayPhase]
            paths = new_image_path(imagesName)
            cv2.imwrite(paths["combined"][3:],combinedImage)
            plt.imsave(paths["grayMag"][3:],grayMag,cmap="gray")
            plt.imsave(paths["grayPhase"][3:],grayPhase,cmap="gray")

            return jsonify(paths)
    return redirect('/')


if __name__ == '__main__':
    app.run(debug=True)
