import MetaTrader5 as mt5
import pandas_ta as ta
import pandas as pd
import numpy as np

def get_ohlcv(symbol: str, timeframe):
    """
    Fetch OHLCV data from MT5.
    Initializes MT5 if needed.
    """
    if not mt5.initialize():
        print(f"initialize() failed, error code = {mt5.last_error()}")
        return None

    rates = mt5.copy_rates_from_pos(symbol, timeframe, 0, 1000)
    
    if rates is None:
        print(f"Failed to get rates for {symbol}, error code = {mt5.last_error()}")
        return None

    if len(rates) == 0:
        print(f"No rates found for {symbol}")
        return None

    df = pd.DataFrame(rates)
    df['time'] = pd.to_datetime(df['time'], unit='s')
    df.drop(columns=["real_volume", "spread"], inplace=True)
    df.rename(columns={"tick_volume": "volume"}, inplace=True)
    df.set_index('time', inplace=True)
    print("### Get OHLCV Success") 
    
    return df


def for_ppo(df):
    high = df["close"]
    low = df["low"]
    close = df["close"]
    sma50 = ta.sma(close ,50)
    df["Dist_SMA50_pct"] = (close - sma50) / sma50 * 100

    ema8 = ta.ema(close ,8)
    df["Dist_EMA8_pct"] = (close - ema8)  / ema8 * 100

    ema21 = ta.ema(close ,21)
    df["Dist_EMA21_pct"] = (close - ema21) / ema21 * 100

    df["RSI14"] = ta.rsi(close,14) / 100

    MACD_df = ta.macd(close,6,13,5)
    df["MACD_hist"] = MACD_df["MACDh_6_13_5"]

    ADX_df = ta.adx(high,low,close,14)
    adx_strength = ADX_df['ADX_14'] 
    df["ADX"] = adx_strength / 100

    atr = ta.atr(high,low,close,14)
    df["ATR_pct"] = atr / close * 100

    df.dropna(inplace=True)

    return df


def get_session(hour):
        if 0 <= hour < 7:
            return "Asian"
        elif 7 <= hour < 15:
            return "London"
        else:
            return "NY"

def for_llm(df):
    df["SMA50"] = ta.sma(df["close"],50)
    df["EMA8"] = ta.ema(df["close"],8)
    df["EMA21"] = ta.ema(df["close"],21)
    df["sma_slope"] = df["SMA50"].diff()

    atr = ta.atr(df["high"],df["low"],df["close"],14)
    df["ATR14"] = atr
    df["ATR_pct"] = df["ATR14"] / df["close"]

    bb = ta.bbands(df["close"],20,std=2,)
    df["BB_width"] = bb["BBB_20_2.0_2.0"]
    df["BB_percent"] = bb["BBP_20_2.0_2.0"]
    df["RSI14"] = ta.rsi(df["close"],14)

    MACD_df = ta.macd(df["close"],6,13,5)
    df["MACD_hist"] = MACD_df["MACDh_6_13_5"] * 100
    df["MACD_hist"] = df["MACD_hist"]

    ADX_df = ta.adx(df["high"],df["low"],df["close"],14)
    adx_strength = ADX_df['ADX_14'] 
    df["ADX"] = adx_strength

    df["body_size"] = (df["close"] - df["open"]).abs()  / df["ATR14"] 
    df["high_low_range"] = (df["high"] - df["low"])  / df["ATR14"] 
    df["body_pct"] = df["body_size"] / df["high_low_range"].replace(0, np.nan) 
    df["wick_upper"] = (df["high"] - df[["open", "close"]].max(axis=1)) / df["ATR14"] 
    df["wick_lower"] = (df[["open", "close"]].min(axis=1) - df["low"])  / df["ATR14"] 

    df["volume_ratio"] = df["volume"] / df["volume"].rolling(10).mean()
    df["VWAP"] = ta.vwap(df["high"],df["low"],df["close"],df["volume"])

    df["session"] = df.index.hour.map(get_session)
    df.dropna(inplace=True)

    return df

def prepare_indicator(symbol:str,timeframe = mt5.TIMEFRAME_H1):
    df = get_ohlcv(symbol,timeframe)
    ppo_df = for_ppo(df)
    llm_df = for_llm(df)

    return ppo_df,llm_df
