from flask import Flask
from flask_cors import CORS
from routes.index import index_bp
from routes.search import search_bp
from routes.errors import errors_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    app.register_blueprint(index_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(errors_bp)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5555)
