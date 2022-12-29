
from flask import Flask, jsonify, render_template, request
import os
import sys
from werkzeug.utils import secure_filename
UPLOAD_FOLDER = './upload'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__, template_folder="templates")
app.config['UPLOAD_FOLDER']=UPLOAD_FOLDER

@app.route('/', methods=['GET'])
def index():
    return render_template('main.html')

@app.route('/image/<int:id>', methods=['POST'])
def image(id):
    if request.files['file']:
        if id==1:
        # File Saving
            file_mag = request.files['file']
            filename=secure_filename( file_mag .filename)
            file_path_mag = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file_mag .save(file_path_mag)
        else:
            file_phase = request.files['file']
            filename=secure_filename( file_phase .filename)
            file_path_phase= os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file_phase .save(file_path_phase)
    return []
@app.route('/data/', methods=['POST'])
# def data():
#     if request.method == 'POST':
#             form=request.get_json()
#             values = form['values']
#             print(values)
        
            
#     return []

    
if __name__ == '__main__':
    app.run(debug=True) 