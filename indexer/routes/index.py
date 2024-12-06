from flask import Blueprint, request, jsonify
from services.indexer import index_video

index_bp = Blueprint('index', __name__)


@index_bp.route('/index', methods=['POST'])
def handle_index():
    """Index a video from URL"""
    data = request.json
    video_url = data.get('url')
    video_name = data.get('name', 'unknown')
    folder_id = data.get('folder_id', 'default')
    frame_interval = data.get('frame_interval', 60)

    if not video_url:
        return jsonify({'error': 'No video URL provided'}), 400

    try:
        frame_count = index_video(
            video_url, video_name, folder_id, frame_interval)
        return jsonify({
            'success': True,
            'message': f'Indexed {frame_count} frames from video',
            'video_name': video_name,
            'folder_id': folder_id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
