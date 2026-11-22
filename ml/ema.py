import copy
import torch
import torch.nn as nn

class ModelEMA:
    """
    Exponential Moving Average (EMA) of model weights for superior validation stability
    and test generalization. Maintains a shadow copy of trained parameters.
    """
    def __init__(self, model: nn.Module, decay: float = 0.9999, device: torch.device = None):
        self.module = copy.deepcopy(model).eval()
        self.decay = decay
        self.device = device
        
        if self.device:
            self.module.to(self.device)
            
        # Ensure shadow parameters do not compute gradients
        for p in self.module.parameters():
            p.requires_grad = False

    def update(self, model: nn.Module):
        """Update shadow parameter weights using exponential decay."""
        with torch.no_grad():
            msd = model.state_dict()
            for k, ema_v in self.module.state_dict().items():
                if k in msd:
                    model_v = msd[k].to(ema_v.device)
                    if ema_v.is_floating_point():
                        ema_v.copy_(ema_v * self.decay + (1.0 - self.decay) * model_v)
                    else:
                        ema_v.copy_(model_v)

    def state_dict(self) -> dict:
        return self.module.state_dict()

    def load_state_dict(self, state_dict: dict):
        self.module.load_state_dict(state_dict)
