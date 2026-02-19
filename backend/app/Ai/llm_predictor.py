import MetaTrader5 as mt5
from app.Ai.model_loader import ai_models
from app.Ai.utils.llm_input import format_market_data, generate_image


# fixxxxx
def llm_predictor(df):
    if df is not None:
        text_input = format_market_data(df.iloc[-1])
        image_input = generate_image(df)
        
        model = ai_models["model"]
        tokenizer = ai_models["tokenizer"]
        token = tokenizer.tokenizer

        if model is None or tokenizer is None:
            return "Model not loaded"

        # Construct prompt
        instruction = "Analyze this chart and market data."
        messages = [
            {
                "role": "system",
                "content": [{"type": "text", "text": instruction}]
            },
            {
                "role": "user", 
                "content": [
                    {"type": "image", "image": image_input},
                    {"type": "text", "text": f"{text_input}"}
                ]
            }
        ]
        stop_words = ["###END_ANALYSIS###"]
        
        input_text = tokenizer.apply_chat_template(messages, add_generation_prompt=True,tokenize=False)
        inputs = tokenizer(
            images=[image_input],
            text=input_text,
            add_special_tokens=False,
            return_tensors="pt",
        ).to("cuda")

        output = model.generate(**inputs, 
            max_new_tokens=100,
            temperature=0.1,
            tokenizer=token,    
            stop_strings=stop_words
        )
        
        input_len = inputs.input_ids.shape[1]
        generated_ids = output[0][input_len:]

        prediction = tokenizer.decode(generated_ids, skip_special_tokens=True)
        print("### Prediction Success")
        
        return prediction

    else:
        print("Failed to prepare data for prediction")
        return None

