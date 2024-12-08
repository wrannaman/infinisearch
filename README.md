# 🔍 InfiniSearch

A blazing-fast video search engine powered by CLIP embeddings and Milvus vector database. Search through video content using natural language queries and find exact moments in your video library.

## ✨ Features

- 🧠 Advanced AI-powered video understanding using CLIP embeddings
- ⚡️ Lightning-fast vector search with Milvus
- 🎯 Precise timestamp matching for instant scene location
- 🗂 Folder organization for video collections
- 🎬 Frame-by-frame analysis for detailed scene understanding
- 🔄 Real-time indexing of new video content

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- CUDA-capable GPU (recommended)
- Docker for Milvus

### Setup

1. Create and activate conda environment:
```bash
conda create -n infinisearch python=3.11
conda activate infinisearch
conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia
pip install open-clip-torch opencv-python pymilvus flask flask-cors python-dotenv
```

2. Start Milvus:
```bash
curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh -o standalone_embed.sh
bash standalone_embed.sh start
```

3. Create a `.env` file:
```plaintext
MILVUS_HOST=localhost
MILVUS_PORT=19530
```

## 🎥 Indexing Videos

Index your videos using the REST API:

```bash
curl -X POST http://localhost:5555/index \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://example.com/video.mp4",
    "name": "my_video.mp4",
    "folder_id": "my_folder",
    "frame_interval": 60
  }'
```

Parameters:
- `url`: Video file URL
- `name`: Identifier for the video
- `folder_id`: Group videos into collections
- `frame_interval`: Frames to skip between indexing (higher = faster but less precise)

## 🔎 Searching Videos

Search through indexed videos using natural language:

```bash
curl -X POST http://localhost:5555/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "person walking on beach at sunset",
    "limit": 5,
    "folder_id": "my_folder"
  }'
```

## 🏗 Architecture

- Frontend: Next.js with Tailwind CSS
- Backend: Flask REST API
- Vector DB: Milvus
- ML Model: CLIP (ViT-H-14-384)
- Video Processing: OpenCV

## 🧪 Development

Run the development server with auto-reload:
```bash
nodemon --exec python3 -m api --ext py,json
```

## 📚 Model Details

Using Apple's DFN5B-CLIP-ViT-H-14-384 for superior video understanding:
https://huggingface.co/apple/DFN5B-CLIP-ViT-H-14-384

## 📄 License

MIT License - Feel free to use in your own projects!

