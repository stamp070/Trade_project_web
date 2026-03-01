import logging
from app.Ai.llm_predictor import llm_predictor
from app.Ai.utils.indicator_gen import get_ohlcv, for_llm, for_ppo
from app.Ai.ppo_predictor import ppo_predictor
from app.Ai.utils.llm_formatter import format_llm_response
import MetaTrader5 as mt5
import pandas as pd
import numpy as np
from datetime import datetime, timezone, timedelta

BKK_TZ = timezone(timedelta(hours=7))

# สร้าง Logger เฉพาะตัว (ไม่ใช้ basicConfig เพราะ Uvicorn ตั้งค่า root logger ไปแล้ว)
logger = logging.getLogger("ai_predict")
logger.setLevel(logging.INFO)
file_handler = logging.FileHandler("log/ai_predict.log", encoding="utf-8")
file_handler.setFormatter(logging.Formatter("%(asctime)s | %(levelname)s | %(message)s", datefmt="%Y-%m-%d %H:%M:%S"))
logger.addHandler(file_handler)

# Global Cache สำหรับเก็บผลลัพธ์จาก LLM ที่รันไว้ล่วงหน้าโดย Cronjob
ai_cache = {
    "Time": None,
    "EURUSD": None
}

def run_llm_cronjob():
    print("[Cronjob] กำลังประมวลผล LLM สำหรับ EURUSD...")
    try:
        df = get_ohlcv("EURUSD", mt5.TIMEFRAME_H1)
        llm_df = for_llm(df.copy())
        llm_prediction = llm_predictor(llm_df)
        df_formatted = format_llm_response(llm_prediction)
        
        # บันทึกลงตัวแปร Global
        ai_cache["Time"] = datetime.now(BKK_TZ).strftime("%Y-%m-%d %H:%M:%S")
        ai_cache["EURUSD"] = df_formatted

        print("✅ [Cronjob] อัปเดต State LLM ลง Cache สำเร็จ!")
    except Exception as e:
        print(f"❌ [Cronjob] Error running LLM: {e}")

def run_eurusd(position: int = 0):
    df = get_ohlcv("EURUSD", mt5.TIMEFRAME_H1)
    df_ppo = for_ppo(df.copy())

    # ดึงผล LLM จาก Cache (ถ้ายังไม่มี หรือเพิ่งเปิดเซิร์ฟเวอร์ ให้แอบรันสดๆ ไปเลย 1 รอบ)
    cached_llm = ai_cache.get("EURUSD")
    if cached_llm is None:
        print("⚠️ [Cache Miss] ไม่เจอผล LLM ใน Cache กำลังรันสด...")
        llm_df = for_llm(df.copy())
        llm_prediction = llm_predictor(llm_df)
        cached_llm = format_llm_response(llm_prediction)
        ai_cache["EURUSD"] = cached_llm

    # โยนให้ PPO ตัดสินใจ (PPO เร็วมาก อยู่ระดับ Milliseconds)
    # position: 0 = short, 1 = long
    ppo_prediction = ppo_predictor(df_ppo.iloc[-3:], position, cached_llm) 

    logger.info(f"[LLM] llm_prediction: {llm_prediction}")
    logger.info(f"[PPO] ppo_prediction: {ppo_prediction}")

    return ppo_prediction

