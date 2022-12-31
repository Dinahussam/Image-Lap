import cv2
import numpy as np


class ImageClass:
    def __init__(self, image=None, path=None, index=0):
        self.image = image  # image read by cv2
        self.image_path = path
        if path is not None:
            self.read()

    # Read and load images:
    def read(self):
        self.image = cv2.imread(self.image_path)
        return self.image

    # # Write
    # @staticmethod
    # def write(pathName, img):
    #     save_img = cv2.imwrite(pathName, img)
    #     return save_img

    # Transform tha image from RGB Scale to Gray Scale:
    @staticmethod
    def grayScale(img):
        gray_img = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        return gray_img

    # Transform to frequency domain using Fourier:
    @staticmethod
    def fourierTransform(img):
        fft_img = np.fft.fftshift(np.fft.fft2(img))
        return fft_img

    # Separate Magnitude and phase of images:
    @staticmethod
    def separateMagnitudePhase(img):
        img_amplitude = np.sqrt(np.real(img) ** 2 + np.imag(img) ** 2)
        img_phase = np.arctan2(np.imag(img), np.real(img))
        return img_amplitude, img_phase