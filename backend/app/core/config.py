import os
import json
from typing import List, Literal, Optional, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriVerify AI API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Database Configuration (PostgreSQL / Supabase with SQLite fallback)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:agriverify_password@localhost:5432/agriverify"
    )
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_RECYCLE: int = 3600
    DB_POOL_TIMEOUT: int = 30

    # Authentication & Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "agriverify_super_secret_jwt_key_2026_change_in_production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS Configuration
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://localhost:3000", "*"]

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]

    # Earth Observation & Sentinel-2 Satellite Service
    MOCK_SATELLITE_SERVICE: bool = False
    SENTINEL_STAC_URL: str = os.getenv("SENTINEL_STAC_URL", "https://earth-search.aws.element84.com/v1")
    COPERNICUS_CDSE_CLIENT_ID: Optional[str] = os.getenv("COPERNICUS_CDSE_CLIENT_ID", None)
    COPERNICUS_CDSE_CLIENT_SECRET: Optional[str] = os.getenv("COPERNICUS_CDSE_CLIENT_SECRET", None)

    # External Government & Remote Sensing APIs
    AGRO_API_KEY: str = os.getenv("AGRO_API_KEY", "86c96becf6cf837d60001702890dc88a")
    BHULEKH_API_KEY: str = os.getenv("BHULEKH_API_KEY", "ipr_WZqidJ-lUKHzwZ_jP5uEMVnZu8fqydZQ")
    SENTINEL_API_KEY: str = os.getenv("SENTINEL_API_KEY", "fU2ZJHe0QTKcefsHJhDhmLQzb8GAbqFsIEfAQTlgUKSOLEeG2W2MUhkXhCN7RjM7zd6FELGIeo4vcbbORaQUVY")
    EARTH_ENGINE_CREDENTIALS: str = os.getenv("EARTH_ENGINE_CREDENTIALS", "")

    # OpenAPI Docs Configuration
    @property
    def docs_url(self) -> Optional[str]:
        return "/docs"

    @property
    def redoc_url(self) -> Optional[str]:
        return "/redoc"

    @property
    def openapi_url(self) -> Optional[str]:
        return "/openapi.json"

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"

settings = Settings()
