from flask import Blueprint, jsonify

errors_bp = Blueprint('errors', __name__)


@errors_bp.app_errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404


@errors_bp.app_errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500
