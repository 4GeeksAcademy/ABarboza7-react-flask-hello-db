const getBackendUrl = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
  return backendUrl;
};

export async function getVideojuegos() {
  const res = await fetch(getBackendUrl() + "/api/videojuegos");
  if (!res.ok) throw new Error("No se pudo cargar la lista");
  return res.json();
}

export async function createVideojuego(payload) {
  const res = await fetch(getBackendUrl() + "/api/videojuegos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "No se pudo crear");
  return data;
}

export async function updateVideojuego(id, payload) {
  const res = await fetch(getBackendUrl() + `/api/videojuegos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "No se pudo actualizar");
  return data;
}

export async function deleteVideojuego(id) {
  const res = await fetch(getBackendUrl() + `/api/videojuegos/${id}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "No se pudo eliminar");
  return data;
}

