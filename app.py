# # Python program to read image using OpenCV

# # importing OpenCV(cv2) module
# import cv2

# # Save image in set directory
# # Read RGB image
# img = cv2.imread('upload/phase.jpeg')

# # Output img with window name as 'image'
# cv2.imshow('image', img)

# # Maintain output window utill
# # user presses a key
# cv2.waitKey(0)

# # Destroying present windows on screen
# cv2.destroyAllWindows()




from flask import Flask, jsonify, render_template, request, redirect
import os
import cv2
from functions import Functions
from werkzeug.utils import secure_filename
from PIL import Image

UPLOAD_FOLDER = './upload'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__, template_folder="templates")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

values = {"magnitude": {"x1": None, "y1": None, "x2": None, "y2": None},
          "phase": {"x1": None, "y1": None, "x2": None, "y2": None}}
imagePath = {"magnitude": "", "phase": "", "combined": ""}


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
        if (id == 1):
            key = "magnitude"
        else:
            key = "phase"
        set_values(key, form)
    return redirect('/')


if __name__ == '__main__':
    app.run(debug=True)
