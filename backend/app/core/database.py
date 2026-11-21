import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger("agriverify.database")

Base = declarative_base()

def init_engine():
    db_url = settings.DATABASE_URL
    try:
        if db_url.startswith("postgresql"):
            # PostgreSQL / Supabase connection
            connect_args = {"connect_timeout": 3}
            if "supabase" in db_url or "sslmode=require" in db_url:
                connect_args["sslmode"] = "require"

            test_engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_size=settings.DB_POOL_SIZE,
                max_overflow=settings.DB_MAX_OVERFLOW,
                pool_recycle=settings.DB_POOL_RECYCLE,
                connect_args=connect_args
            )
            with test_engine.connect():
                pass
            logger.info(f"Connected successfully to PostgreSQL / Supabase at {db_url.split('@')[-1]}")
            return test_engine
    except Exception as exc:
        logger.warning(
            f"Notice: PostgreSQL / Supabase connection not established ({exc}). "
            "Falling back to local SQLite database."
        )
        db_url = "sqlite:///./agriverify.db"

    # SQLite / Fallback engine
    return create_engine(
        db_url,
        connect_args={"check_same_thread": False} if db_url.startswith("sqlite") else {}
    )

engine = init_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI database dependency yields a scoped session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes tables in database if not already created."""
    try:
        from app.models.models import Base as ModelsBase
        ModelsBase.metadata.create_all(bind=engine)
        logger.info("Database schema verification and table initialization complete.")
    except Exception as e:
        logger.error(f"Failed to auto-create tables: {e}")
