from config import client
from models.clip import process_frame
from services.video import url_to_video
import cv2


def setup_collection():
    """Setup the collection if it doesn't exist"""
    if "video_features" not in client.list_collections():
        client.create_collection(
            collection_name="video_features",
            dimension=1024,
            primary_field="id",
            auto_id=True,
            field_types=[
                {"name": "timestamp_ms", "dtype": "INT64"},
                {"name": "frame_number", "dtype": "INT64"},
                {"name": "video_name", "dtype": "VARCHAR", "max_length": 256},
                {"name": "folder_id", "dtype": "VARCHAR", "max_length": 256},
                {"name": "vector", "dtype": "FLOAT_VECTOR", "dim": 1024}
            ]
        )


def index_video(video_url, video_name, folder_id='default', frame_interval=60):
    """Index a video from URL"""
    setup_collection()

    # Delete existing entries for this video name in this folder
    client.delete(
        collection_name="video_features",
        expr=f'video_name == "{video_name}" and folder_id == "{folder_id}"'
    )

    cap = url_to_video(video_url)

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0
    batch_data = []
    prev_frame = None

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_interval == 0:
            if prev_frame is not None:
                features = process_frame(prev_frame, frame)
                timestamp_ms = int((frame_count / fps) * 1000)

                batch_data.append({
                    "vector": features.tolist()[0],
                    "timestamp_ms": timestamp_ms,
                    "frame_number": frame_count,
                    "video_name": video_name,
                    "folder_id": folder_id
                })

                if len(batch_data) >= 100:
                    client.insert(
                        collection_name="video_features",
                        data=batch_data
                    )
                    batch_data = []

            prev_frame = frame.copy()

        frame_count += 1

    # Handle last batch
    if batch_data:
        client.insert(
            collection_name="video_features",
            data=batch_data
        )

    cap.release()
    return frame_count
