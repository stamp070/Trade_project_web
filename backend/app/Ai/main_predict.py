from app.Ai.llm_predictor import llm_predictor
from app.Ai.utils.indicator_gen import get_ohlcv,for_llm,for_ppo
from app.Ai.ppo_predictor import ppo_predictor
from app.Ai.utils.llm_formatter import format_llm_response
import MetaTrader5 as mt5
import numpy as np

def main():
    df = get_ohlcv("EURUSD", mt5.TIMEFRAME_H1)
    
    llm_df = for_llm(df.copy())
    llm_prediction = llm_predictor(llm_df)
    df_formatted = format_llm_response(llm_prediction)
    print(llm_prediction)
    print(df_formatted)

    # TEST need to fix model
    df_ppo = for_ppo(df.copy())
    ppo_prediction = ppo_predictor(df_ppo.iloc[-48:],0,df_formatted)
    print(ppo_prediction)

    return llm_prediction,ppo_prediction
