import torch
from open_clip import create_model_from_pretrained, get_tokenizer
from pymilvus import MilvusClient

# Device configuration
device = "cuda" if torch.cuda.is_available() else "cpu"

# Initialize CLIP model and tokenizer
model, preprocess = create_model_from_pretrained(
    'hf-hub:apple/DFN5B-CLIP-ViT-H-14-384')
model = model.to(device)
tokenizer = get_tokenizer('ViT-H-14')

# Initialize Milvus client
client = MilvusClient("video_search.db")
