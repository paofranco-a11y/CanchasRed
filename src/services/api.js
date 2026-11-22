const API_URL = "http://127.0.0.1:8000/api/v1";

function getHeaders(isJson = true) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export const authService = {
  async registro(datos) {
    const res = await fetch(`${API_URL}/auth/registro`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(datos),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al registrar usuario");
    return data;
  },

  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Correo o contraseña incorrectos");

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("rol", data.rol);
    localStorage.setItem("nombre", data.nombre);
    return data;
  },

  async listarUsuarios() {
    const res = await fetch(`${API_URL}/auth/usuarios`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("No autorizado");
    return res.json();
  },

  async actualizarUsuario(id, datos) {
    const res = await fetch(`${API_URL}/auth/usuarios/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(datos),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al actualizar usuario");
    return data;
  },

  async eliminarUsuario(id) {
    const res = await fetch(`${API_URL}/auth/usuarios/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al eliminar usuario");
    return data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");
  },

  getUsuarioActual() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return {
      token,
      rol: localStorage.getItem("rol"),
      nombre: localStorage.getItem("nombre"),
    };
  },
};

export const canchasService = {
  async listar(deporte = "") {
    const query = deporte && deporte !== "todos" ? `?deporte=${encodeURIComponent(deporte)}` : "";
    const res = await fetch(`${API_URL}/canchas/${query}`);
    if (!res.ok) throw new Error("Error al cargar canchas");
    return res.json();
  },

  async crear(cancha) {
    const res = await fetch(`${API_URL}/canchas/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(cancha),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "No autorizado para crear canchas");
    return data;
  },

  async actualizar(id, datos) {
    const res = await fetch(`${API_URL}/canchas/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(datos),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al actualizar cancha");
    return data;
  },

  async eliminar(id) {
    const res = await fetch(`${API_URL}/canchas/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al eliminar cancha");
    return data;
  },
};

export const reservasService = {
  async crear(reserva) {
    const res = await fetch(`${API_URL}/reservas/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(reserva),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al crear reserva");
    return data;
  },

  async misReservas() {
    const res = await fetch(`${API_URL}/reservas/mis-reservas`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener reservas");
    return res.json();
  },

  async cancelar(id) {
    const res = await fetch(`${API_URL}/reservas/${id}/cancelar`, {
      method: "PUT",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Error al cancelar reserva");
    return res.json();
  },
};