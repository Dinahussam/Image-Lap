import cv2
import numpy as np


class Functions:
    @staticmethod
    # Load two different grayscale images:
    def Load(image1, image2):
        img1 = cv2.imread(image1)
        img2 = cv2.imread(image2)
        img1_gray = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
        img2_gray = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
        return img1_gray, img2_gray

    @staticmethod
    # Resize images:
    def Resize(img1, img2, image1_path, image2_path):
        # set a new width and height in pixels
        new_width = 1500
        new_height = 1500

        # size
        size = (new_width, new_height)

        # resize image
        output_size_change_img1 = cv2.resize(img1, size, interpolation=cv2.INTER_AREA)
        output_size_change_img2 = cv2.resize(img2, size, interpolation=cv2.INTER_AREA)

        new_name_change = 'After_Changed_Size_'

        image1_new_name = new_name_change + image1_path
        image2_new_name = new_name_change + image2_path

        img1_size_after = cv2.imwrite(image1_new_name, output_size_change_img1)
        img1_changed_size = cv2.imread(image1_new_name, 0)

        img2_size_after = cv2.imwrite(image2_new_name, output_size_change_img2)
        img2_changed_size = cv2.imread(image2_new_name, 0)
        return img1_changed_size, img2_changed_size

    @staticmethod
    # Transform to frequency domain using Fourier:
    def FourierTransform(img1_changed_size, img2_changed_size):
        img1_fft = np.fft.fftshift(np.fft.fft2(img1_changed_size))
        img2_fft = np.fft.fftshift(np.fft.fft2(img2_changed_size))
        return img1_fft, img2_fft

    img1_amplitude = 0
    img1_phase = 0
    img2_amplitude = 0
    img2_phase = 0

    @staticmethod
    # Separate Magnitude and phase of images:
    def SeparateMagnitudePhase(img1_fft, img2_fft):
        global img1_amplitude
        global img1_phase
        global img2_amplitude
        global img2_phase
        img1_amplitude = np.sqrt(np.real(img1_fft) ** 2 + np.imag(img1_fft) ** 2)
        img1_phase = np.arctan2(np.imag(img1_fft), np.real(img1_fft))
        img2_amplitude = np.sqrt(np.real(img2_fft) ** 2 + np.imag(img2_fft) ** 2)
        img2_phase = np.arctan2(np.imag(img2_fft), np.real(img2_fft))
        return img1_amplitude, img1_phase, img2_amplitude, img2_phase

    @staticmethod
    # Get image (Image Reconstruction) by computing --> [amplitude * exp(j * phase)]:
    def combination(img_amplitude, img_phase):
        # amplitude_phase
        combination = np.multiply(img_amplitude, np.exp(1j * img_phase))
        combination_real = np.real(np.fft.ifft2(combination))  # drop imagniary as they are around 1e-14
        return combination_real

    @staticmethod
    # Cut in fourier:
    def crop_2d_img(image, x1, x2, y1, y2):
        max_height = image.shape[0] - 1
        cutted_img = np.zeros_like(image)

        for x in range(x1, x2):
            for y in range(y1, y2):
                cutted_img[max_height - y, x] = image[max_height - y, x]

        return cutted_img

    @staticmethod
    # Main Function(connection the functions together):
    def Main(img1, img2, x1_amp, x2_amp, y1_amp, y2_amp, x1_phase, x2_phase, y1_phase, y2_phase):
        combined_image = 0
        image1, image2 = Functions.Load(img1, img2)
        image1_resized, image2_resized = Functions.Resize(image1, image2, img1, img2)
        image1_resized_fft, image2_resized_fft = Functions.FourierTransform(image1_resized, image2_resized)
        image1_amplitude, image1_phase, image2_amplitude, image2_phase = Functions.SeparateMagnitudePhase(
                                                                         image1_resized_fft, image2_resized_fft)

        cutted_phase_img = Functions.crop_2d_img(image2_phase, x1_phase, x2_phase, y1_phase, y2_phase)
        cutted_amplitude_img = Functions.crop_2d_img(image1_amplitude, x1_amp, x2_amp, y1_amp, y2_amp)
        combined_image = Functions.combination(cutted_amplitude_img, cutted_phase_img)

        return combined_image