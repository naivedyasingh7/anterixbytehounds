import os
import torch
import torch.nn as nn

def export_torchscript(model: nn.Module, example_input: torch.Tensor, output_path: str) -> str:
    """
    Exports ConvNeXt-Tiny model to TorchScript format.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    model.eval()
    traced_model = torch.jit.trace(model, example_input)
    traced_model.save(output_path)
    print(f"Exported TorchScript model to '{output_path}'.")
    return output_path

def export_onnx(model: nn.Module, example_input: torch.Tensor, output_path: str) -> str:
    """
    Exports ConvNeXt-Tiny model to ONNX format.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    model.eval()
    torch.onnx.export(
        model,
        example_input,
        output_path,
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch_size'},
            'output': {0: 'batch_size'}
        }
    )
    print(f"Exported ONNX model to '{output_path}'.")
    return output_path
