import torch
import torch.nn.functional as F
from PIL import Image
from open_clip import create_model_from_pretrained, get_tokenizer
from pymilvus import MilvusClient
import cv2
from datetime import timedelta
import numpy as np
import os

# Initialize CLIP model and tokenizer
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = create_model_from_pretrained(
    'hf-hub:apple/DFN5B-CLIP-ViT-H-14-384')
model = model.to(device)
tokenizer = get_tokenizer('ViT-H-14')

# Initialize Milvus client
client = MilvusClient("video_search.db")


def setup_collection():
    """Setup or reset the collection"""
    if client.list_collections() and "video_features" in client.list_collections():
        client.drop_collection("video_features")

    client.create_collection(
        collection_name="video_features",
        dimension=1024,
        primary_field="id",
        auto_id=True,
        field_types=[
            {"name": "timestamp_ms", "dtype": "INT64"},
            {"name": "frame_number", "dtype": "INT64"},
            {"name": "video_name", "dtype": "VARCHAR", "max_length": 256},
            {"name": "vector", "dtype": "FLOAT_VECTOR", "dim": 1024}
        ]
    )


def create_composite_frame(frame1, frame2):
    """Create a side-by-side composite image from two frames"""
    height, width = frame1.shape[:2]
    new_width = width // 2
    frame1_resized = cv2.resize(frame1, (new_width, height))
    frame2_resized = cv2.resize(frame2, (new_width, height))
    return np.hstack((frame1_resized, frame2_resized))


def save_debug_images(original_composite, clip_input_tensor, frame_count):
    """Save both the original composite and CLIP's view for debugging"""
    # Save original composite (already in BGR for cv2)
    cv2.imwrite(f'debug_composite_{frame_count}.jpg', original_composite)

    # Print debug info
    print(f"\nDebug info for frame {frame_count}:")
    print(f"Original tensor shape: {clip_input_tensor.shape}")
    print(f"Original tensor range: [{clip_input_tensor.min():.2f}, {clip_input_tensor.max():.2f}]")  # noqa

    # Convert the tensor to numpy
    clip_input = clip_input_tensor.squeeze(0).permute(1, 2, 0).cpu().numpy()
    print(f"After permute shape: {clip_input.shape}")
    print(f"After permute range: [{clip_input.min():.2f}, {clip_input.max():.2f}]")  # noqa

    # Denormalize
    clip_input = ((clip_input * 0.5 + 0.5) * 255).clip(0, 255).astype(np.uint8)
    print(f"Final range: [{clip_input.min()}, {clip_input.max()}]")

    # Save using both methods to compare
    Image.fromarray(clip_input, 'RGB').save(f'debug_clip_input_pil_{frame_count}.jpg')  # noqa
    cv2.imwrite(f'debug_clip_input_cv2_{frame_count}.jpg', cv2.cvtColor(
        clip_input, cv2.COLOR_RGB2BGR))


def process_frame(frame1, frame2=None, frame_count=None, debug=False):
    """Process single frame or composite frames and return features"""
    if frame2 is not None:
        frame = create_composite_frame(frame1, frame2)
    else:
        frame = frame1

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(frame_rgb)
    image_tensor = preprocess(image).unsqueeze(0).to(device)

    # if debug and frame_count is not None and frame_count < 5:  # Save first 5 frames
    #     save_debug_images(frame, image_tensor, frame_count)

    with torch.no_grad(), torch.amp.autocast(device_type='cuda'):
        image_features = model.encode_image(image_tensor)
        image_features = F.normalize(image_features, dim=-1)

    return image_features.cpu().numpy()


def index_video(video_path, frame_interval=60):
    """Index video frames into Milvus using composite images"""
    video_name = os.path.basename(video_path)  # Get just the filename
    print(f"Indexing video: {video_name}")  # Debug print

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Could not open video file: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0
    debug_count = 0
    batch_data = []
    prev_frame = None

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_interval == 0:
            if prev_frame is not None:
                features = process_frame(
                    prev_frame, frame, debug_count, debug=True)
                timestamp_ms = int((frame_count / fps) * 1000)

                # Debug print the data we're about to insert
                print(f"Adding frame with video_name: {video_name}")

                batch_data.append({
                    "vector": features.tolist()[0],
                    "timestamp_ms": timestamp_ms,
                    "frame_number": frame_count,
                    "video_name": video_name  # Make sure this is being included
                })

                if len(batch_data) >= 100:
                    print(f"Inserting batch with video_name: {video_name}")  # noqa
                    client.insert(
                        collection_name="video_features",
                        data=batch_data
                    )
                    batch_data = []

                print(f"Processed composite frame at {timedelta(milliseconds=timestamp_ms)}")  # noqa
                debug_count += 1

            prev_frame = frame.copy()

        frame_count += 1

    # Handle last batch
    if batch_data:
        print(f"Inserting last batch with video_name: {video_name}")  # noqa
        client.insert(
            collection_name="video_features",
            data=batch_data
        )

    cap.release()
    print(f"Indexed {len(batch_data)} composite frames from video")


if __name__ == "__main__":
    video_files = [
        "./test_videos/demo1.mp4",
        "./test_videos/demo2.mp4",
        "./test_videos/demo3.mp4"
    ]

    # Reset collection once before indexing all videos
    setup_collection()

    for video_path in video_files:
        print(f"\nStarting to index {video_path}...")
        index_video(video_path, frame_interval=60)
        print(f"Finished indexing {video_path}\n")
