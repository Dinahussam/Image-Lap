
from flask import Flask, jsonify, render_template, request
import os
import sys
from werkzeug.utils import secure_filename
UPLOAD_FOLDER = 'upload/'
app = Flask(__name__, template_folder="templates")
app.config['UPLOAD_FOLDER']=UPLOAD_FOLDER
@app.route('/', methods=['GET'])
def index():
    return render_template('main.html')

# @app.route('/image', methods=['POST'])
# def image():
#     if request.files['file']:
#         # File Saving
#         file = request.files['file']
#         #abspath = os.path.dirname(__file__)
#         file_path = os.path.join(
#             app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
#         file.save(file_path)
#         print( file_path)
        
if __name__ == '__main__':
    app.run(debug=True) 