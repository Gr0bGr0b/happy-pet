from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/happy_pet_db"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
