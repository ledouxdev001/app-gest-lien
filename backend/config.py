from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 8000
    DB_HOST: str = "db"
    DB_PORT: int = 3306
    DB_USER: str = "linkshub"
    DB_PASSWORD: str = "linkshub_pass"
    DB_NAME: str = "linkshub"
    JWT_SECRET: str = "change_me"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 8
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"

    class Config:
        env_file = ".env"

settings = Settings()
