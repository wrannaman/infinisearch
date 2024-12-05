import torch
import torch.nn.functional as F
from open_clip import create_model_from_pretrained, get_tokenizer
from pymilvus import MilvusClient
from datetime import timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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

    # Debug print to verify search parameters
    print("Searching with parameters:", {
        "limit": limit,
        "output_fields": ["timestamp_ms", "frame_number", "video_name"]
    })

    results = client.search(
        collection_name="video_features",
        data=text_features.cpu().numpy().tolist(),
        limit=limit,
        output_fields=["timestamp_ms", "frame_number", "video_name"],
        metric_type="IP",
        params={"nprobe": 10}
    )

    # Debug print raw results
    print("Raw search results:", results[0])

    # Format results for JSON response
    formatted_results = []
    for hit in results[0]:
        entity = hit.get('entity', {})
        print("Processing hit:", entity)  # Debug print each hit
        formatted_results.append({
            'timestamp_ms': entity.get('timestamp_ms', 0),
            'frame_number': entity.get('frame_number', 0),
            'video_name': entity.get('video_name', 'unknown'),
            'score': float(hit.get('distance', 0)),
            'timestamp_str': str(timedelta(milliseconds=entity.get('timestamp_ms', 0)))
        })

    return formatted_results


@app.route('/search', methods=['POST'])
def api_search():
    data = request.json
    query = data.get('query', '')
    limit = data.get('limit', 5)

    try:
        results = search_video(query, limit)
        return jsonify({'results': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5555)
