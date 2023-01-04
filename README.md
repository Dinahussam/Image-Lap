
# IMAGE LAP

## Table of contents:

- [Introduction](#introduction)
- [Project Features](#project-features)
- [Project Structure](#project-structure)
- [How to Run The Project](#run-the-project)
- [Team]()

### Introduction
This website provide the user to understand more about frequency components of images and how strong each component effects the images  
*First: The components*
>
    1. Magnitude
    2. Phase
>
*Second: The Functionality*
>
    1. Low Pass Filter: It provides the image components of frequencies lower than the user select
    2. High Pass filter: It provides the image components of frequencies higher than the user select
>
*Third: The Website Options:*
>
    * Circle selector
    * Rectangle selector
    * Delete to upload new Images
    * Choose Selected
    * choose outer part of the selected region
>

### Project Features
1. INTERFACE
![INTERFACE](images/Inter.png)
2. Rectangle LPF Option
![Rectangle LPF Option](images/RLPF.png)
3. Rectangle LHF Option
![Rectangle LHF Option](images/RHPF.png)
4. Circle LPF Option
![Circle LPF Option](images/CLPF.png)
5. Circle HPF Option
![Circle HPF Option](images/CHPF.png)

### Project Structure
The Web Application is built using:

- Frontend:
  - HTML
  - CSS
  - JavaScript
  - Ajax
- Backend framework:
  - Flask (Python)
  
The Frontend main function to set the structure of the page and determine the indices of cropper and mange
the user interface while the backend function is to do on images operations like resizing,
, apply Fourier transform,  cutting, combining & reconstructing images.

```
main
├─ Notebooks
├─ static (JS & CSS files)
│  ├─  css
│  ├─  imgs
│  └─  js
├─ templates (HTML files)
├─ IMAGE.py (Back-End Class)
├─ PROCESSING.py (Back-End Class)
├─ app.py (Back-End Server)
└─ README.md
```

### Run the Project

1. Install Python3 in your computer

```
Download it from www.python.org/downloads/
```

2. Install the following packages
```
pip install numpy
```
```
pip install Flask
```
```
pip install os
```
```
pip install jsonify
```
```
pip install opencv-python
```


- Open Project Terminal & Run

```
pip install -r requirments.txt
```

3. Start Server by Running

```
python app.py
```

4. Visit http://127.0.0.1:5000

### Team

First Semester - Biomedical Digital Signal Processing (SBE3110) class project created by:

| Team Members' Names                                  | Section | B.N. |
| ---------------------------------------------------- | :-----: | :--: |
| [Dina Hussam](https://github.com/Dinahussam)         |    1    |  28  |
| [Sama Mostafa](https://github.com/SamaMostafa1)       |    1    |  44  |
| [Mohamed Salah](https://github.com/Ms850446) |    2    |  19  |
| [Yousr Ashraf](https://github.com/YousrHejy)       |    2    |  54  |

### Submitted to:

- Dr. Tamer Basha & Eng. Abdullah Darwish
  All rights reserved © 2023 to Team 2 - Systems & Biomedical Engineering, Cairo University (Class 2024)

    
