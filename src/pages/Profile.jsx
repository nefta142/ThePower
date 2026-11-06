import { Link, useOutletContext } from "react-router-dom";

function Profile() {
  const { user } = useOutletContext();

  return (
    <main>
      <h1>Mi perfil</h1>

      <p>Bienvenido, {user.nombreUsuario}.</p>
      <p>Correo electrónico: {user.email}</p>

      <Link to="/">Volver al inicio</Link>
    </main>
  );
}

export default Profile;
