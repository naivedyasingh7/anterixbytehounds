import torch
import json
import os
import cv2
import numpy as np
from PIL import Image

from ml.config import Config
from ml.model import get_model
from ml.utils import load_checkpoint
from ml.transforms import get_test_transforms

class ConvNeXtInference:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ConvNeXtInference, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
        
    def _initialize(self):
        self.config = Config()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        if not os.path.exists(self.config.DEPLOYED_WEIGHTS_PATH) or not os.path.exists(self.config.DEPLOYED_CLASS_MAPPING_PATH):
            raise RuntimeError(
                f"Model weights or class mapping not found at {self.config.DEPLOYED_WEIGHTS_PATH}. "
                "The ConvNeXt-Tiny model has not yet been trained. "
                "Please run the training pipeline before inference."
            )
            
        with open(self.config.DEPLOYED_CLASS_MAPPING_PATH, 'r') as f:
            self.idx_to_class = {int(k): v for k, v in json.load(f).items()}
            
        num_classes = len(self.idx_to_class)
        # Dropout doesn't matter during inference since we call eval(), but pass it anyway
        self.model = get_model(num_classes, pretrained=False, dropout=self.config.DROPOUT).to(self.device)
        load_checkpoint(self.model, self.config.DEPLOYED_WEIGHTS_PATH, device=self.device)
        self.model.eval()
        self.transforms = get_test_transforms(self.config.IMG_SIZE)
        
    def predict(self, img_mat, use_tta=False):
        """
        Expects an OpenCV BGR matrix (numpy array).
        Returns a dictionary with 'disease' and 'confidence'.
        Extensible for Test Time Augmentation (TTA).
        """
        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(img_mat, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(img_rgb)
        
        # Prepare for TorchScript or ONNX by keeping this pipeline clean
        tensor = self.transforms(pil_img).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            if use_tta:
                # Stub for Test Time Augmentation (e.g. flipping, multiple crops)
                pass
                
            outputs = self.model(tensor)
            probs = torch.nn.functional.softmax(outputs, dim=1)
            conf, pred_idx = torch.max(probs, dim=1)
            
        pred_idx_val = pred_idx.item()
        confidence_val = conf.item()
        class_name = self.idx_to_class[pred_idx_val]
        
        # Replace underscores for readability if needed, matching old behavior
        readable_label = class_name.replace("___", " - ").replace("_", " ")
        
        return {
            "disease": readable_label,
            "confidence": round(confidence_val * 100, 2)
        }

def get_prediction(img_mat):
    infer = ConvNeXtInference()
    return infer.predict(img_mat)
