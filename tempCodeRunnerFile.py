utted_phase_img = 0
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