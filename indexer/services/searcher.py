from datetime import timedelta
from config import client
from models.clip import encode_text


def search_video(query, limit=5, folder_id=None):
    """Search for video frames"""
    text_features = encode_text(query)

    # If folder_id is provided, add it to the search filter
    search_params = {
        "metric_type": "IP",
        "params": {"nprobe": 10}
    }
    if folder_id:
        search_params["expr"] = f'folder_id == "{folder_id}"'

    results = client.search(
        collection_name="video_features",
        data=text_features.tolist(),
        limit=limit,
        output_fields=["timestamp_ms", "frame_number",
                       "video_name", "folder_id"],
        **search_params
    )

    # Format results
    formatted_results = []
    for hit in results[0]:
        entity = hit.get('entity', {})
        formatted_results.append({
            'timestamp_ms': entity.get('timestamp_ms', 0),
            'frame_number': entity.get('frame_number', 0),
            'video_name': entity.get('video_name', ''),
            'folder_id': entity.get('folder_id', ''),
            'score': float(hit.get('distance', 0)),
            'timestamp_str': str(timedelta(milliseconds=entity.get('timestamp_ms', 0)))
        })

    return formatted_results
