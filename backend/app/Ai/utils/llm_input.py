import pandas as pd
import io
import mplfinance as mpf
from PIL import Image


def evaluate_trend(row):
    score = 0

    # 1. Big Trend
    if row['close'] > row['SMA50']: score += 40
    else: score -= 40

    # 2. Structure (EMA Alignment) 
    if row['EMA8'] > row['EMA21']: score += 30
    elif row['EMA8'] < row['EMA21']: score -= 30

    # 3. Aggression (Price vs EMA8)
    if score > 0 and row['close'] > row['EMA8']: score += 10
    elif score < 0 and row['close'] < row['EMA8']: score -= 10

    # ถ้า ADX ต่ำกว่า 20 (Sideway) 
    if row["ADX"] < 20: score *= 0.5

    print("### Generate Trend Score Success")
    
    return max(min(score, 100), -100)

def trending(features):
    trend_score = evaluate_trend(features)
    trend = ""

    if trend_score >= 80:
        trend = "Strong Bullish"
    elif trend_score >= 50:
        trend = "Moderate Bullish"
    elif trend_score >= 20:
        trend = "Weak Bullish"
    elif trend_score < 20 and trend_score > -20:
        trend = "Range"
    elif trend_score <= -80:
        trend = "Strong Bearish"
    elif trend_score <= -50:
        trend = "Moderate Bearish"
    elif trend_score <= -20:
        trend = "Weak Bearish"
    print("### Generate Trending Success")
    
    return trend


def format_market_data(features):
    """
    Convert raw technical indicators into an interpreted text summary for LLM.
    """
    state = {}
    trend = trending(features)
    # 1. ANALYZE TREND (SMA50 & EMAs)
    dist_pct = (features["close"] - features["SMA50"]) / features["SMA50"] * 100
    
    sma_thresold = 0.08 
    if abs(dist_pct) < sma_thresold: 
        state["big_trend"] = f"Price is interacting with SMA50 (Distance: {dist_pct:.2f}%). Potential Breakout or Rejection."
    elif dist_pct > 0:
        state["big_trend"] = f"Price is trading {dist_pct:.2f}% ABOVE SMA50."
    else:
        state["big_trend"] = f"Price is trading {abs(dist_pct):.2f}% BELOW SMA50."
    
    # ดูระยะสั้นเทียบ EMA
    if (features["close"] > features["EMA8"]) and (features["close"] > features["EMA21"]):
        state["short_trend"] = "Price is holding above short-term EMAs (Strong Support)."
    elif (features["close"] < features["EMA8"]) and (features["close"] < features["EMA21"]):
        state["short_trend"] = "Price is suppressed below short-term EMAs (Resistance)."
    else:
        state["short_trend"] = "Price is chopping between EMAs (Consolidation)."

    # 2. ANALYZE MOMENTUM (RSI, MACD, ADX)
    state["rsi"] = f"Neutral ({features['RSI14']:.1f})"
    if features["RSI14"] > 70:
        state["rsi"] = f"Overbought ({features['RSI14']:.1f}) - Caution: Potential Pullback."
    elif features["RSI14"] < 30:
        state["rsi"] = f"Oversold ({features['RSI14']:.1f}) - Potential Bounce area."
    
    macd_thresold = 0.0003 # กันช่วง sideway
    if features["MACD_hist"] > macd_thresold:
        state["macd"] = "Positive Momentum"
    elif features["MACD_hist"] < -macd_thresold:
        state["macd"] = "Negative Momentum"
    else:
        state["macd"] = "Neutral Momentum"

    state["adx"] = "Weak/Ranging Market"
    if features["ADX"] > 25:
        state["adx"] = "Strong Trending Market"
    elif features["ADX"] > 40:
        state["adx"] = "Very Strong Trend (Possible Exhaustion)"

    # 3. ANALYZE CANDLESTICK STRUCTURE (Wicks & Body)
    state["candle"] = "Green Candle" if features["close"] > features["open"] else "Red Candle"
    
    # Check for Rejection (ไส้เทียนยาว)
    state["candle_structure"] = "Normal body structure."
    if features["wick_lower"] > features["wick_upper"] * 2 and features["wick_lower"] > features["body_size"]:
        state["candle_structure"] = "Long Lower Wick detected (Strong Rejection of lower prices)."
    elif features["wick_upper"] > features["wick_lower"] * 2 and features["wick_upper"] > features["body_size"]:
        state["candle_structure"] = "Long Upper Wick detected (Strong Rejection of higher prices)."
    
    # 4. ANALYZE VOLATILITY & VOLUME
    state["volume"] = "High Buying Pressure" if features["volume_ratio"] > 1.2 else "Normal Volume"
    if features["volume_ratio"] < 0.8: state["volume"] = "Low Volume"
    
    atr_thresold = 0.0015
    state["atr"] = "High Volatility" if features["ATR_pct"] > atr_thresold else "Normal/Low Volatility" 

    # --- ASSEMBLE THE PROMPT ---
    prompt = (
        "### MARKET DATA ANALYSIS\n\n"
        f"1. TREND CONTEXT:\n"
        f"   - Technical Bias : {trend}\n"
        f"   - Position Big trend: {state["big_trend"]}\n"
        f"   - Short Term: {state["short_trend"]}\n"
        f"   - Strength: {state["adx"]} (ADX: {features['ADX']:.1f})\n\n"
        
        f"2. MOMENTUM & VOLATILITY:\n"
        f"   - RSI: {state["rsi"]}\n"
        f"   - MACD: {state["macd"]} (Histogram: {features['MACD_hist']:.4f})\n"
        f"   - Volatility: {state["atr"]}\n\n"
        
        f"3. PRICE ACTION & STRUCTURE:\n"
        f"   - Candle: {state["candle"]}\n"
        f"   - Structure: {state["candle_structure"]}\n"
        f"   - Intraday Bias: {'Bullish' if features['close'] > features['VWAP'] else 'Bearish'} (Price vs VWAP)\n\n"
        
        f"4. MARKET PARTICIPATION:\n"
        f"   - Volume Status: {state["volume"]} (Ratio: {features['volume_ratio']:.2f}x)\n"
    )
    print("### Generate Prompt Success")
    
    return prompt



# fixxxxx
def generate_image(df: pd.DataFrame):
    """
    Generate candlestick chart image using mplfinance.
    Returns a PIL Image object.
    """
    plot_df = df.tail(48)
    
    buf = io.BytesIO()
    
    mpf.plot(
        plot_df,
        type='candle',
        volume=False,
        style='yahoo',
        axisoff=False,
        savefig=dict(fname=buf, dpi=90, pad_inches=0.1),
    )
    
    buf.seek(0)
    
    image = Image.open(buf)
    print("### Generate Image Success")
    
    return image   

