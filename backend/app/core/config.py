import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriVerify AI API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:agriverify_password@localhost:5432/agriverify"
    )

    JWT_SECRET: str = os.getenv("JWT_SECRET", "agriverify_super_secret_jwt_key_2026_change_in_production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    CORS_ORIGINS: List[str] = ["*"]
    MOCK_SATELLITE_SERVICE: bool = True

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
