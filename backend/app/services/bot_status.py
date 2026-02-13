from app.core.database import get_supabase_client


def update_bot_status(bot_id: str, connection: str):
    supabase = get_supabase_client()
    response = supabase.table('bots').update({'connection': connection }).eq('bot_id', bot_id).execute()
    print(response.data)
    return response.data
