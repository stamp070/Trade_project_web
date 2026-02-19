from app.Ai.llm_predictor import llm_predictor
from app.Ai.utils.indicator_gen import get_ohlcv,for_llm
import MetaTrader5 as mt5


def main():
    df = get_ohlcv("EURUSD", mt5.TIMEFRAME_H1)
    df = for_llm(df)
    prediction = llm_predictor(df)
    return prediction
