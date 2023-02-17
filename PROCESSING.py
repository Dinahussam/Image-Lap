import cv2
import numpy as np

from math import sqrt
from math import exp


class ProcessingClass:
    # Resize images:
    @staticmethod
    def Resize(img):
        # set a new width and height in pixels
        new_width = 350
        new_height = 168

        # size
        size = (new_width, new_height)

        # resize image
        resized_img = cv2.resize(img, size, interpolation=cv2.INTER_AREA)

        return resized_img
# Cut rectangle shape in fourier:
    @staticmethod
    def rect(img, x1, x2, y1, y2, filter_flag):
        zero_2d_array = np.zeros_like(img)
        img_copy = img
        zeros_copy = zero_2d_array
        max_height = img.shape[0] - 1
        for x in range(x1, x2):
            for y in range(y1, y2):
                zero_2d_array[max_height - y, x] = img_copy[max_height - y, x]
                img[max_height - y, x] = zeros_copy[max_height - y, x]

        if filter_flag == 0:
            return zero_2d_array
        if filter_flag == 1:
            return img

    @staticmethod
    def combination(img_amplitude, img_phase):
        # amplitude_phase
        combination = np.multiply(img_amplitude, np.exp(1j * img_phase))
        ifft_combination = ProcessingClass.fourier_inverse(combination)
        return ifft_combination

    @staticmethod
    def fourier_inverse(img):
        ifft_img_real = np.real(np.fft.ifft2(img))  # drop imaginary as they are around 1e-14
        return ifft_img_real