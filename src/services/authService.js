
const API_URL = import.meta.env.VITE_API_URL;

export async function registrarUsuario(datosUsuario) {
  const respuesta = await fetch(
    `${API_URL}/api/usuarios/registro`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosUsuario),
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
        ? datos || "No se ha podido registrar el usuario"
        : datos?.message ||
          datos?.mensaje ||
          "No se ha podido registrar el usuario"
    );
  }

  return datos;
}
