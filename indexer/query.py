import torch
import torch.nn.functional as F
from open_clip import create_model_from_pretrained, get_tokenizer
from pymilvus import MilvusClient
from datetime import timedelta

# Initialize CLIP model and tokenizer
device = "cuda" if torch.cuda.is_available() else "cpu"
model, _ = create_model_from_pretrained('hf-hub:apple/DFN5B-CLIP-ViT-H-14-384')
model = model.to(device)
tokenizer = get_tokenizer('ViT-H-14')

# Initialize Milvus client
client = MilvusClient("video_search.db")


def search_video(query_text, limit=5):
    """Search for video frames using text query"""
    text = tokenizer(
        [query_text], context_length=model.context_length).to(device)

    with torch.no_grad(), torch.amp.autocast(device_type='cuda'):
        text_features = model.encode_text(text)
        text_features = F.normalize(text_features, dim=-1)

    results = client.search(
        collection_name="video_features",
        data=text_features.cpu().numpy().tolist(),
        limit=limit,
        output_fields=["timestamp_ms", "frame_number"]
    )

    return results


if __name__ == "__main__":
    # Example search
    results = search_video("gun", limit=5)
    for hit in results[0]:
        timestamp = timedelta(milliseconds=hit.get(
            'entity', {}).get('timestamp_ms', 0))
        frame_number = hit.get('entity', {}).get('frame_number', 0)
        score = hit.get('score', 0)

        print(f"Found match at {timestamp} (frame {frame_number}) with score {score}")  # noqa
