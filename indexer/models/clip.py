import torch
import torch.nn.functional as F
from config import device, model, preprocess
from PIL import Image
import numpy as np


def process_frame(frame1, frame2=None):
    """Process single frame or composite frames and return features"""
    if frame2 is not None:
        # Create composite frame
        height, width = frame1.shape[:2]
        new_width = width // 2
        frame1_resized = cv2.resize(frame1, (new_width, height))
        frame2_resized = cv2.resize(frame2, (new_width, height))
        frame = np.hstack((frame1_resized, frame2_resized))
    else:
        frame = frame1

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(frame_rgb)
    image_tensor = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad(), torch.amp.autocast(device_type='cuda'):
        image_features = model.encode_image(image_tensor)
        image_features = F.normalize(image_features, dim=-1)

    return image_features.cpu().numpy()


def encode_text(query):
    """Encode text query to features"""
    text = tokenizer([query], context_length=model.context_length).to(device)

    with torch.no_grad(), torch.amp.autocast(device_type='cuda'):
        text_features = model.encode_text(text)
        text_features = F.normalize(text_features, dim=-1)

    return text_features.cpu().numpy()
