import numpy as np
from stable_baselines3 import PPO

model = PPO.load("app/Ai/model/model_eur_best_300k_test2")


# TEST need to fix model
def ppo_predictor(df,position,llm_feature):
    if df is None:
        return -1
    
    pos_arr = np.full((48,1),position)
    obs_techical = np.hstack((df,pos_arr)).astype(np.float32)

    obs_llm = llm_feature.iloc[0].values.astype(np.float32)

    observation = {
        "technical_features": obs_techical,
        "llm_features": obs_llm
    }

    action, _states = model.predict(observation, deterministic=True)
    
    return int(action)


    