import joblib
import pandas as pd
from sentence_transformers import SentenceTransformer
import ast

local_embedder = SentenceTransformer('app/Ai/model/sentence_transformer')
pca = joblib.load("app/Ai/model/embeded_model.joblib")

def to_dataframe(res):
    data = res.replace("###END_ANALYSIS###","").strip()
    data = ast.literal_eval(data)
    return data

def embeded_data(df):
    df["Bias"] = 1 if df["Bias"] == "Buy" else -1
    df["Trend"] = 1 if df["Trend"] == "Bullish" else -1

    vec = local_embedder.encode([df["Reasoning"]])
    transform = pca.transform(vec)
    
    # Flatten embedding vector into separate columns
    embedding_list = transform[0].tolist()
    for i, val in enumerate(embedding_list):
        df[f"Reasoning_{i}"] = val
        
    # Remove the original text/list column
    del df["Reasoning"]

    return df


def format_llm_response(response):
    data = to_dataframe(response)
    res = embeded_data(data)
    res = pd.DataFrame([res])
    return res