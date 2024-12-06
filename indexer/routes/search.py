from flask import Blueprint, request, jsonify
from services.searcher import search_video

search_bp = Blueprint('search', __name__)


@search_bp.route('/search', methods=['POST'])
def handle_search():
    """Search for video frames"""
    data = request.json
    query = data.get('query', '')
    limit = data.get('limit', 5)
    folder_id = data.get('folder_id')

    try:
        results = search_video(query, limit, folder_id)
        return jsonify({'results': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
