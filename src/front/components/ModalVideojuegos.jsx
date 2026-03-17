import React, { useEffect, useMemo, useState } from "react";

const emptyForm = { nombre: "", ano: "", empresa: "", consolas: "" };

export const ModalVideojuego = ({ isOpen, onClose, onSubmit, initialValue }) => {
  const isEdit = useMemo(() => Boolean(initialValue?.id), [initialValue]);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) return;
    if (initialValue) {
      setForm({
        nombre: initialValue.nombre ?? "",
        ano: initialValue.ano ?? "",
        empresa: initialValue.empresa ?? "",
        consolas: initialValue.consolas ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      nombre: form.nombre.trim(),
      ano: form.ano === "" ? null : parseInt(form.ano, 10),
      empresa: form.empresa.trim(),
      consolas: form.consolas.trim(),
    };
    if (!payload.nombre || payload.ano == null || !payload.empresa) return;
    onSubmit(payload);
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEdit ? "Editar videojuego" : "Añadir videojuego"}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre del juego</label>
                <input
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Año</label>
                <input
                  className="form-control"
                  name="ano"
                  type="number"
                  min="1970"
                  max="2035"
                  value={form.ano}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Empresa</label>
                <input
                  className="form-control"
                  name="empresa"
                  value={form.empresa}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Consolas</label>
                <input
                  className="form-control"
                  name="consolas"
                  value={form.consolas}
                  onChange={handleChange}
                  placeholder="Ej: PS5, Xbox Series X, PC"
                />
              </div>
              <small className="text-muted">Consolas separadas por comas.</small>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? "Guardar" : "Añadir"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalVideojuego;