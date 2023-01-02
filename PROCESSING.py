import cv2
import numpy as np


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
    def crop_2d_img_rect(img, x1, x2, y1, y2):
        max_height = img.shape[0] - 1
        cutted_img = np.zeros_like(img)

        for x in range(x1, x2):
            for y in range(y1, y2):
                cutted_img[max_height - y, x] = img[max_height - y, x]

        return cutted_img

    # Cut circle shape in fourier:
    @staticmethod
    def crop_2d_img_cir(img, x1, y1, r):
        h, w = img.shape
        mask = np.zeros((h, w), np.uint8)

        cv2.circle(mask, (x1, y1), r, 255, -1)

        image = cv2.bitwise_and(img, img, mask=mask)

        return image
    
    # High Pass Filter For Rectangle:
    @staticmethod
    def highPassFilterRect(img, x1, x2, y1, y2):
        print(img)
        print(x1)
        print(x2)
        print(y1)
        print(y2)
        image = cv2.rectangle(np.log(img.tolist()), (x1, y1), (x2, y2), (0, 0, 0), -1)
        return np.asarray(image)
    
    # High Pass Filter For Circle:
    @staticmethod
    def highPassFilterCir(img, x1, y1, radius):
        image = cv2.circle(np.log(img.tolist()), (x1, y1), radius, (0, 0, 0), -1)
        return np.asarray(image)

    # Distance between two points:
    @staticmethod
    def distance_between_two_points(x1, x2, y1, y2):
        distance = round(np.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2))
        return distance

    # Get image (Image Reconstruction) by computing --> [amplitude * exp(j * phase)]:
    @staticmethod
    def combination(img_amplitude, img_phase):
        # amplitude_phase
        combination = np.multiply(img_amplitude, np.exp(1j * img_phase))
        combination_real = np.real(np.fft.ifft2(combination))  # drop imaginary as they are around 1e-14
        return combination_real
