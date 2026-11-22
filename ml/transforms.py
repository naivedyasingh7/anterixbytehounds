import torchvision.transforms as T

def get_train_transforms(img_size=224):
    return T.Compose([
        T.RandomResizedCrop(img_size, scale=(0.8, 1.0)), # Keep it realistic for crops
        T.RandomHorizontalFlip(),
        T.RandomRotation(15),
        T.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

def get_val_transforms(img_size=224):
    return T.Compose([
        T.Resize(int(img_size * 1.14)),
        T.CenterCrop(img_size),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
def get_test_transforms(img_size=224):
    # Same as validation transforms, but separated for conceptual clarity
    # and future Test Time Augmentation (TTA) setups.
    return get_val_transforms(img_size)
