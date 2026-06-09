from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    
    Config = Settings()
