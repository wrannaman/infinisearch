from urllib.request import urlopen
import numpy as np
import cv2


def url_to_video(url):
    """Open a video from URL using cv2"""
    try:
        stream = urlopen(url)
        bytes = bytes()
        while True:
            chunk = stream.read(1024*1024)
            if not chunk:
                break
            bytes += chunk

        array = np.asarray(bytearray(bytes), dtype=np.uint8)
        temp_file = "temp_video.mp4"
        with open(temp_file, "wb") as f:
            f.write(array)

        return cv2.VideoCapture(temp_file)
    except Exception as e:
        raise ValueError(f"Could not open video URL: {str(e)}")
