import numpy as np
import gymnasium as gym
from gymnasium import spaces
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv, VecNormalize
import logging
import os
import torch

logger = logging.getLogger("ai_predict")

# model = PPO.load("app/Ai/model/PPO/model_eur_best_750k_last1")

class DummyInferenceEnv(gym.Env):
    def __init__(self):
        super().__init__()
        self.observation_space = spaces.Dict({
            'technical_features': spaces.Box(
                low=-np.inf, high=np.inf, 
                shape=(3, 13),
                dtype=np.float32
            ),
            'llm_features': spaces.Box(
                low=-np.inf, high=np.inf, 
                shape=(9,),
                dtype=np.float32
            )
        })
        self.action_space = spaces.Discrete(2)
        
    def reset(self, seed=None, options=None):
        pass
    def step(self, action):
        pass

dummy_venv = DummyVecEnv([lambda: DummyInferenceEnv()])

loaded_ppo_models = {}
loaded_vec_envs = {}

def get_loaded_model(model_path):
    if model_path not in loaded_ppo_models:
        logger.info(f"[PPO Register] Loading New Model Version to Memory: {model_path}...")
        
        vec_path = f"{model_path}_vec_normalize.pkl"
        
        if not os.path.exists(f"{model_path}.zip") and not os.path.exists(model_path):
            logger.error(f"[ERROR] PPO Model file not found at {model_path}")
            raise FileNotFoundError(f"PPO Model not found at path: {model_path}")
        if not os.path.exists(vec_path):
             logger.warning(f"[WARNING] vec_normalize file not found at {vec_path} May Cause Bad Predictions!")
             vec_env_cache = VecNormalize(dummy_venv, norm_obs=True, norm_reward=False)
        else:
             vec_env_cache = VecNormalize.load(vec_path, dummy_venv)
             vec_env_cache.training = False 
             vec_env_cache.norm_reward = False
        loaded_ppo_models[model_path] = PPO.load(model_path)
        loaded_vec_envs[model_path] = vec_env_cache
        
    return loaded_ppo_models[model_path], loaded_vec_envs[model_path]

def ppo_predictor(df,position,llm_feature,ppo_model_path):
    if df is None:
        return -1
    model, vec_env = get_loaded_model(ppo_model_path)
    
    pos_arr = np.full((3,1),position)   
    obs_techical = np.hstack((df,pos_arr)).astype(np.float32)

    obs_llm = llm_feature.iloc[0].values.astype(np.float32)

    # === DEBUG: ค่าก่อน normalize ===
    logger.info(f"[DEBUG] obs_technical (raw):\n{obs_techical}")
    logger.info(f"[DEBUG] obs_llm (raw): {obs_llm}")
    logger.info(f"[DEBUG] position: {position}")

    observation = {
        "technical_features": obs_techical,
        "llm_features": obs_llm
    }
    
    # *** 3. เอา observation มา normalize ก่อนส่งให้ model predict ***
    # normalize_obs คาดหวัง batch_size เป็นมิติด้านหน้า เราเติม np.expand_dims
    norm_obs = vec_env.normalize_obs({
        "technical_features": np.expand_dims(obs_techical, axis=0),
        "llm_features": np.expand_dims(obs_llm, axis=0)
    })

    # === DEBUG: ค่าหลัง normalize ===
    logger.info(f"[DEBUG] obs_technical (normalized):\n{norm_obs['technical_features']}")
    logger.info(f"[DEBUG] obs_llm (normalized): {norm_obs['llm_features']}")

    action, _states = model.predict(norm_obs, deterministic=True)
    
    # === DEBUG: ดู action probabilities ===
    try:
        obs_tensor = model.policy.obs_to_tensor(norm_obs)[0]
        dist = model.policy.get_distribution(obs_tensor)
        probs = dist.distribution.probs.detach().cpu().numpy()
        logger.info(f"[DEBUG] action_probs: {probs} -> chosen action: {int(action)}")
    except Exception as e:
        logger.info(f"[DEBUG] could not get action probs: {e}")
    
    return int(action)


    