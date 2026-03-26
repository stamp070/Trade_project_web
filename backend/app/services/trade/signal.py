from app.AI.main_predict import run_prediction
from app.core.database import get_supabase_client
from datetime import datetime, timezone, timedelta
from app.schema.mt5 import TransactionItem
from typing import List

BKK_TZ = timezone(timedelta(hours=7))

def sync_transactions(mt5_account: dict, transactions: List[TransactionItem], symbol: str):
    supabase = get_supabase_client()
    mt5_id = mt5_account.get("mt5_id")
    user_id = mt5_account.get("user_id")

    try:
        bot_res = supabase.table("bots").select("bot_id,version_id").eq("mt5_id", mt5_id).eq("currency", symbol).eq("is_active", True).execute()
        if bot_res.data:
            supabase.table("bots").update({"connection": "Connected"}).eq("mt5_id", mt5_id).eq("currency", symbol).execute()
            bot_id = bot_res.data[0]["bot_id"]
            version_id = bot_res.data[0]["version_id"]
        else:
            supabase.table("bots").update({"connection": "Disconnected"}).eq("mt5_id", mt5_id).eq("currency", symbol).execute()
            return {"status":"error","message":"Error no bot existing or bot is not active"}
    except Exception as e:
        print(f"[sync_transactions] Error getting bot_id: {e}")
        return {"status":"error","message":"Error no bot existing"}

    # check no transaction
    if not transactions:
        return version_id

    for tx in transactions:
        existing = supabase.table("transaction").select("ticket_id").eq("ticket_id", tx.ticket_id).execute()
        if existing.data:
            continue

        close_at_str = None
        if tx.close_at:
            close_at_str = datetime.fromtimestamp(tx.close_at, tz=BKK_TZ).isoformat()

        open_at_str = None
        if tx.open_at:
            open_at_str = datetime.fromtimestamp(tx.open_at, tz=BKK_TZ).isoformat()

        row = {
            "ticket_id": tx.ticket_id,
            "tradetype": tx.tradetype,
            "lotsize": tx.lotsize,
            "profit_loss": tx.profit_loss,
            "open_at": open_at_str,
            "close_at": close_at_str,
            "mt5_id": mt5_id,
            "user_id": user_id,
            "bot_id": bot_id,
            "version_id": version_id,
        }
    
        try:
            supabase.table("transaction").insert(row).execute()
        except Exception as e:
            print(f"[sync_transactions] Error inserting ticket {tx.ticket_id}: {e}")
    
    return version_id

def process_trade_signal(symbol: str, position: str, version_id: str):
    # if symbol != "EURUSD":
    #     raise ValueError(f"Symbol '{symbol}' not supported")

    supabase = get_supabase_client()

    try:
        response = supabase.table("bots_version").select("ppo_model(modelpath)").eq("version_id", version_id).execute()
        if response.data:
            ppo_model_path = response.data[0]["ppo_model"]["modelpath"]
        else:
            return {"status":"error","message":"Error no bot version existing"}
    except Exception as e:
        print(f"[process_trade_signal] Error getting ppo_model_id: {e}")
        return {"status":"error","message":"Error no bot version existing"}

    pos_map = {"SELL": 0, "BUY": 1}
    print("last position : ",position)
    position_int = pos_map.get(position.upper(), 0)

    ppo_prediction = run_prediction(symbol,position_int,ppo_model_path)
    action_code = int(ppo_prediction)

    print("ppo action : ",action_code)

    return {
        "status": "success",
        "command": action_code,
    }
