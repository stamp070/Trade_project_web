import numpy as np
import gymnasium as gym
from gymnasium import spaces
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv, VecNormalize
import logging
import torch

logger = logging.getLogger("ai_predict")

model = PPO.load("app/Ai/model/PPO/model_eur_best_750k_last1")

# 1. จำลอง Environment ง่ายๆ ให้ DummyVecEnv ไม่ต้องใช้ของพญาช้าง
class DummyInferenceEnv(gym.Env):
    def __init__(self):
        super().__init__()
        # ข้อมูล shape ให้ตรงกับ env ตอน Train (ตั้งใจเขียนเผื่อแบบ Box ไว้)
        self.observation_space = spaces.Dict({
            'technical_features': spaces.Box(
                low=-np.inf, high=np.inf, 
                shape=(3, 13), # ปรับ shape 13 ให้ตรงกับ self.technical_features จริง!
                dtype=np.float32
            ),
            'llm_features': spaces.Box(
                low=-np.inf, high=np.inf, 
                shape=(9,), # จำนวน LLM features
                dtype=np.float32
            )
        })
        self.action_space = spaces.Discrete(2)
        
    def reset(self, seed=None, options=None):
        pass # จำลองเฉยๆ
    def step(self, action):
        pass

# 2. โหลด VecNormalize โดยครอบ DummyInferenceEnv เข้าไป
dummy_venv = DummyVecEnv([lambda: DummyInferenceEnv()])
vec_env = VecNormalize.load("app/Ai/model/PPO/vec_normalize.pkl", dummy_venv)
vec_env.training = False # ปิดการ train state (สำคัญมาก)
vec_env.norm_reward = False

# TEST need to fix model
def ppo_predictor(df,position,llm_feature):
    if df is None:
        return -1
    
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


    