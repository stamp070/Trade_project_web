from unsloth import FastVisionModel
import torch

ai_models = {
    "model": None,
    "tokenizer": None
}

def load_ai_model():
    print("⏳ กำลังโหลด AI Model 10GB เข้า RAM/VRAM...")
    
    CACHE_DIR = "./app/Ai/model_cache"
    BASE_MODEL_NAME = "./app/Ai/model/llava_trading_v5"
    
    model,tokenizer = FastVisionModel.from_pretrained(
        model_name=BASE_MODEL_NAME,
        load_in_4bit=True,
        cache_dir=CACHE_DIR,
    )
    FastVisionModel.for_inference(model)

    ai_models["model"] = model
    ai_models["tokenizer"] = tokenizer
    
    print("✅ โหลด AI Model เสร็จสิ้น!")

def unload_ai_model():
    ai_models["model"] = None
    ai_models["tokenizer"] = None
    if torch.cuda.is_available():
        torch.cuda.empty_cache()