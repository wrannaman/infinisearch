import torch
import torch.nn.functional as F
from PIL import Image
from open_clip import create_model_from_pretrained, get_tokenizer
from pymilvus import MilvusClient
import cv2
from datetime import timedelta

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
            {"name": "vector", "dtype": "FLOAT_VECTOR", "dim": 1024}
        ]
    )


def process_frame(frame):
    """Process a single frame and return its features"""
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(frame_rgb)
    image_tensor = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad(), torch.amp.autocast(device_type='cuda'):
        image_features = model.encode_image(image_tensor)
        image_features = F.normalize(image_features, dim=-1)

    return image_features.cpu().numpy()


def index_video(video_path, frame_skip=30):
    """Index video frames into Milvus"""
    setup_collection()

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Could not open video file: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0
    batch_data = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_skip == 0:
            features = process_frame(frame)
            timestamp_ms = int((frame_count / fps) * 1000)

            batch_data.append({
                "vector": features.tolist()[0],
                "timestamp_ms": timestamp_ms,
                "frame_number": frame_count
            })

            if len(batch_data) >= 100:
                client.insert(
                    collection_name="video_features",
                    data=batch_data
                )
                batch_data = []

            print(f"Processed frame {frame_count} at {
                  timedelta(milliseconds=timestamp_ms)}")

        frame_count += 1

    if batch_data:
        client.insert(
            collection_name="video_features",
            data=batch_data
        )

    cap.release()
    print(f"Indexed {frame_count//frame_skip} frames from video")


if __name__ == "__main__":
    video_path = "./test_videos/demo1.mp4"
    index_video(video_path, frame_skip=30)
