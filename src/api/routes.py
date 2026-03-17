"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/videojuegos", methods=["GET"])
def get_videojuegos():
    juegos = Videojuego.query.order_by(Videojuego.ano.desc()).all()
    return jsonify([j.serialize() for j in juegos]), 200


@api.route("/videojuegos/<int:videojuego_id>", methods=["GET"])
def get_videojuego(videojuego_id):
    juego = Videojuego.query.get(videojuego_id)
    if juego is None:
        raise APIException("Videojuego no encontrado", status_code=404)
    return jsonify(juego.serialize()), 200


@api.route("/videojuegos", methods=["POST"])
def create_videojuego():
    data = request.get_json(silent=True) or {}
    nombre = (data.get("nombre") or "").strip()
    empresa = (data.get("empresa") or "").strip()
    consolas = (data.get("consolas") or "").strip()
    ano = data.get("ano", None)

    if not nombre or ano is None or not empresa:
        raise APIException("Faltan campos: nombre, ano y empresa son requeridos", status_code=400)

    juego = Videojuego(
        nombre=nombre,
        ano=int(ano),
        empresa=empresa,
        consolas=consolas,
    )
    db.session.add(juego)
    db.session.commit()
    return jsonify(juego.serialize()), 201


@api.route("/videojuegos/<int:videojuego_id>", methods=["PUT"])
def update_videojuego(videojuego_id):
    juego = Videojuego.query.get(videojuego_id)
    if juego is None:
        raise APIException("Videojuego no encontrado", status_code=404)

    data = request.get_json(silent=True) or {}

    if "nombre" in data:
        juego.nombre = (data.get("nombre") or "").strip()
    if "ano" in data and data.get("ano") is not None:
        juego.ano = int(data.get("ano"))
    if "empresa" in data:
        juego.empresa = (data.get("empresa") or "").strip()
    if "consolas" in data:
        juego.consolas = (data.get("consolas") or "").strip()

    if not juego.nombre or juego.ano is None or not juego.empresa:
        raise APIException("nombre, ano y empresa no pueden quedar vacíos", status_code=400)

    db.session.commit()
    return jsonify(juego.serialize()), 200


@api.route("/videojuegos/<int:videojuego_id>", methods=["DELETE"])
def delete_videojuego(videojuego_id):
    juego = Videojuego.query.get(videojuego_id)
    if juego is None:
        raise APIException("Videojuego no encontrado", status_code=404)
    db.session.delete(juego)
    db.session.commit()
    return jsonify({"deleted": True}), 200
