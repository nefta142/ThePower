
const API_URL = import.meta.env.VITE_API_URL;

async function obtenerCsrf() {
  const respuesta = await fetch(
    `${API_URL}/api/usuarios/csrf`,
    {
      method: "GET",
      credentials: "include"
    }
  );

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el token CSRF");
  }

  return respuesta.json();
}

export async function registrarUsuario(datosUsuario) {
  try {
    const csrf = await obtenerCsrf();

    const respuesta = await fetch(
      `${API_URL}/api/usuarios/registro`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          [csrf.headerName]: csrf.token
        },
        body: JSON.stringify(datosUsuario)
      }
    );

    const texto = await respuesta.text();

    let datos;
    try {
      datos = texto ? JSON.parse(texto) : null;
    } catch {
      datos = texto;
    }

    if (!respuesta.ok) {
      throw new Error(
        typeof datos === "string"
          ? datos || "Error al registrar el usuario"
          : datos?.mensaje ||
            datos?.message ||
            "Error al registrar el usuario"
      );
    }

    return datos;

  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "No se puede conectar con el servidor Java.", { cause: error }
      );
    }

    throw error;
  }
}
