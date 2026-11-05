import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registrarUsuario } from "../services/authService";

import "./Register.css"
import "./Login.css"

function registro() {

    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [lastName1, setLastName1] = useState("");
    const [lastName2, setLastName2] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !userName.trim() ||
            !name.trim() ||
            !lastName1.trim() ||
            !email.trim() ||
            !pass ||
            !confirmPass
        ) {
            setError("Todos los campos obligatorios deben rellenarse.");
            return;
        }

        if (userName.trim().length > 25) {
            setError("El nombre de usuario no puede superar 25 caracteres.");
            return;
        }

        if ([name, lastName1, lastName2].some(
            (value) => value.trim().length > 50
        )) {
            setError("Los nombres y apellidos no pueden superar 50 caracteres.");
            return;
        }

        if (email.trim().length > 50 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError("Introduce un correo electrónico válido de hasta 50 caracteres.");
            return;
        }

        if (pass.length < 8 || pass.length > 72) {
            setError("La contraseña debe tener entre 8 y 72 caracteres.");
            return;
        }

        if (pass !== confirmPass) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        const userData = {
            nombreUsuario: userName.trim(),
            nombre: name.trim(),
            apellido1: lastName1.trim(),
            apellido2: lastName2.trim(),
            email: email.trim(),
            contrasena: pass
        };

        try {
            setLoading(true);

            const response = await registrarUsuario(userData);

            setSuccess(response?.mensaje || "Usuario registrado correctamente.");

            setUserName("");
            setName("");
            setLastName1("");
            setLastName2("");
            setEmail("");
            setPass("");
            setConfirmPass("");

        } catch (err) {
            setError(err.message || "No se pudo completar el registro.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <main className="register">
            <div className="login-container">
                <div className="login-header">
                    <img
                        src="/images/Logo.png"
                        alt=""
                        className="login-logo"
                    />

                    <h1>Crear cuenta</h1>
                    <p>
                        Regístrate para disfrutar de toda tu música.
                    </p>
                </div>


                <form className="login-form" onSubmit={handleSubmit} noValidate>


                    <div className="form-group">
                        <label htmlFor="userName">Nombre de usuario</label>
                        <input
                            id="userName"
                            type="text"
                            placeholder="Introduce tu nombre de usuario"
                            autoComplete="username"
                            maxLength={25}
                            value={userName}
                            onChange={(e) => {
                                setUserName(e.target.value);
                                setError("");
                                setSuccess("");
                            }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Tu nombre"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError("");
                            }}
                            required
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="lastName1">Primer apellido</label>
                        <input
                            id="lastName1"
                            type="text"
                            placeholder="Introduce tu primer apellido"
                            autoComplete="family-name"
                            maxLength={50}
                            value={lastName1}
                            onChange={(e) => {
                                setLastName1(e.target.value);
                                setError("");
                                setSuccess("");
                            }}
                            required
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="lastName2">
                            Segundo apellido (opcional)
                        </label>
                        <input
                            id="lastName2"
                            type="text"
                            placeholder="Introduce tu segundo apellido"
                            maxLength={50}
                            value={lastName2}
                            onChange={(e) => {
                                setLastName2(e.target.value);
                                setError("");
                                setSuccess("");
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-email">Correo electrónico</label>
                        <input
                            id="register-email"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            required
                            maxLength={50}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-pass">Contraseña</label>

                        <div className="pass-container">
                            <input
                                id="register-pass"
                                type={showPass ? "text" : "password"}
                                placeholder="Crea una contraseña"
                                autoComplete="new-password"
                                value={pass}
                                onChange={(e) => {
                                    setPass(e.target.value);
                                    setError("");
                                }}
                                required
                                minLength={8}
                                maxLength={72}
                            />

                            <button
                                type="button"
                                className="pass-toggle"
                                onClick={() => setShowPass(!showPass)}
                                aria-label={
                                    showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                                }
                                aria-pressed={showPass}
                            >
                                {showPass
                                    ? <EyeOff aria-hidden="true" />
                                    : <Eye aria-hidden="true" />}
                            </button>
                        </div>

                        <small className="register-hint">
                            Mínimo 8 caracteres.
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-pass">Confirmar contraseña</label>

                        <div className="pass-container">
                            <input
                                id="confirm-pass"
                                type={showPass ? "text" : "password"}
                                placeholder="Repite tu contraseña"
                                autoComplete="new-password"
                                value={confirmPass}
                                onChange={(e) => {
                                    setConfirmPass(e.target.value);
                                    setError("");
                                }}
                                required
                                maxLength={72}
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="register-success" role="status">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Registrando..." : "Crear cuenta"}
                    </button>

                </form>


                <p className="login-register">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </main>
    );
}

export default registro