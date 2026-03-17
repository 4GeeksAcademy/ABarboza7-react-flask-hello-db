from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class Videojuego(db.Model):
    __tablename__ = "videojuego"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)
    ano: Mapped[int] = mapped_column(nullable=False)
    empresa: Mapped[str] = mapped_column(String(150), nullable=False)
    consolas: Mapped[str] = mapped_column(String(300), nullable=False, default="")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "ano": self.ano,
            "empresa": self.empresa,
            "consolas": self.consolas,
        }