from flask import Flask, jsonify, render_template, request, redirect
import os
import cv2
from functions import Functions
from werkzeug.utils import secure_filename
from PIL import Image
from IMAGE import ImageClass
from PROCESSING import ProcessingClass

UPLOAD_FOLDER = './upload'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__, template_folder="templates")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

values = {"magnitude": {"x1": None, "y1": None, "x2": None, "y2": None},
          "phase": {"x1": None, "y1": None, "x2": None, "y2": None}}
imagePath = {"magnitude": "", "phase": "", "combined": ""}

# Main Function(connection the functions together):
def Main(img1, img2, x1_amp, x2_amp, y1_amp, y2_amp, x1_phase, x2_phase, y1_phase, y2_phase):  # , cut_flag (for circle)
    print("welcome from the main function for images")
    combined_image = 0
    image1 = img1.read()  # First Object
    image2 = img2.read()  # Second Object

    img1_gray = ImageClass.grayScale(image1)
    img2_gray = ImageClass.grayScale(image2)

    image1_resized = ProcessingClass.Resize(img1_gray)
    image2_resized = ProcessingClass.Resize(img2_gray)

    image1_resized_fft = ImageClass.fourierTransform(image1_resized)
    image2_resized_fft = ImageClass.fourierTransform(image2_resized)

    image1_amplitude, image1_phase = ImageClass.separateMagnitudePhase(image1_resized_fft)
    image2_amplitude, image2_phase = ImageClass.separateMagnitudePhase(image2_resized_fft)


#     if cut_flag == 0:  # Cut in a rectangle shape
    cutted_phase_img = ProcessingClass.crop_2d_img_rect(image2_phase, x1_phase, x2_phase, y1_phase, y2_phase)
    cutted_amplitude_img = ProcessingClass.crop_2d_img_rect(image1_amplitude, x1_amp, x2_amp, y1_amp, y2_amp)

    combined_image = ProcessingClass.combination(cutted_amplitude_img, cutted_phase_img)


#     if cut_flag == 1:  # Cut in a rectangle shape
#         radius_phase = ProcessingClass.distance_between_two_points(x1_phase, x2_phase, y1_phase, y2_phase)
#         radius_magnitude = ProcessingClass.distance_between_two_points(x1_amp, x2_amp, y1_amp, y2_amp)

#         cutted_phase_img = ProcessingClass.crop_2d_img_cir(image2_phase, x1_phase, y1_phase, radius_phase)
#         cutted_amplitude_img = ProcessingClass.crop_2d_img_cir(image1_amplitude, x1_amp, y1_amp, radius_magnitude)

#         combined_image = ProcessingClass.combination(cutted_amplitude_img, cutted_phase_img)

    return combined_image


def save_image(file, type):
    name = type+'.'+file.filename.split('.')[-1]
    imagePath[type] = 'upload/'+name
    file_path_mag = os.path.join(app.config['UPLOAD_FOLDER'], name)
    file.save(file_path_mag)


def restart_values(key):
    for item in values[key].keys():
        values[key][item] = None


def set_values(key, list):
    i = 0
    print("it is the list ")
    print(list)
    for item in values[key]:
        values[key][item] = list[i]
        i = +1


@app.route('/', methods=['GET'])
def index():
    magnitude = values['magnitude']
    phase = values["phase"]
    if (magnitude['x1'] != None) and (phase["x1"] != None):
        combinedImage = Functions.Main(imagePath["magnitude"], imagePath["phase"], magnitude["x1"], magnitude["x2"],
                                       magnitude["y1"], magnitude["y2"], phase["x1"], phase["x2"], phase["y1"], phase["y2"])
        # print("here")
        # im=cv2.imshow("image",combinedImage)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
        # im = Image.fromarray(combinedImage)
        # im.save("upload/combined.jpg")
    return render_template('main.html')


@app.route('/image/<int:id>', methods=['POST'])
def image(id):
    if request.files['file']:
        if id == 1:
            file_mag = request.files['file']
            save_image(file_mag, "magnitude")
            restart_values("magnitude")
        else:
            file_phase = request.files['file']
            save_image(file_phase, "phase")
            restart_values("phase")
    return render_template("main.html")


@app.route('/data/<int:id>', methods=['POST'])
def data(id):
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
        set_values(key, form["values"])
    return redirect('/')


if __name__ == '__main__':
    app.run(debug=True)
