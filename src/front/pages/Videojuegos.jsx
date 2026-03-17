import React, { useCallback, useEffect, useState } from "react";
import { ModalVideojuego } from "../components/ModalVideojuego.jsx";
import {
  createVideojuego,
  deleteVideojuego,
  getVideojuegos,
  updateVideojuego,
} from "../services/videojuegosApi.js";

export const Videojuegos = () => {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVideojuegos();
      setLista(data);
    } catch (e) {
      setError(e.message || "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (payload) => {
    try {
      if (editing?.id) {
        await updateVideojuego(editing.id, payload);
      } else {
        await createVideojuego(payload);
      }
      closeModal();
      await load();
    } catch (e) {
      setError(e.message || "Error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este videojuego?")) return;
    try {
      await deleteVideojuego(id);
      await load();
    } catch (e) {
      setError(e.message || "Error al eliminar");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
        <h2 className="m-0">Mejores videojuegos del mercado</h2>
        <button className="btn btn-success" onClick={openCreate}>
          Añadir videojuego
        </button>
      </div>

      {loading && <div className="alert alert-info">Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          {lista.length === 0 ? (
            <div className="alert alert-secondary">No hay videojuegos todavía.</div>
          ) : (
            <ul className="list-group">
              {lista.map((j) => (
                <li key={j.id} className="list-group-item d-flex justify-content-between gap-3">
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{j.nombre}</div>
                    <div className="text-muted small">
                      {j.ano} · {j.empresa}
                    </div>
                    {j.consolas ? (
                      <div className="small mt-1">
                        <span className="text-muted">Consolas:</span> {j.consolas}
                      </div>
                    ) : null}
                  </div>

                  <div className="d-flex align-items-start gap-2">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => openEdit(j)}>
                      Editar
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(j.id)}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <ModalVideojuego
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialValue={editing}
      />
    </div>
  );
};

export default Videojuegos;