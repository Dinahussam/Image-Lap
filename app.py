
from flask import Flask, jsonify, render_template, request

app = Flask(__name__, template_folder="templates")


@app.route('/')
def home():
    return render_template('main.html')
if __name__ == '__main__':
    app.run(debug=True) 