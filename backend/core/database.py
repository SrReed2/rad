import os
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://raduser:1234@db:5432/rad_db")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def ensure_user_profile_columns():
    required_columns = {
        "grade": "FLOAT NOT NULL DEFAULT 0",
        "attendance": "FLOAT NOT NULL DEFAULT 0",
        "subject": "VARCHAR",
        "period": "VARCHAR",
    }
    with engine.begin() as connection:
        existing_columns = {
            column["name"] for column in inspect(connection).get_columns("users")
        }
        for name, definition in required_columns.items():
            if name not in existing_columns:
                connection.execute(text(f"ALTER TABLE users ADD COLUMN {name} {definition}"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()