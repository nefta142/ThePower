import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import "./Register.css"
import "./Login.css"

function registro() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();
    const [confirmPass, setConfirmPass] = useState();

    const [showPass, setShowPass] = useState();
    const [error, setError] = useState();



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


                <p className="login-register">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </main>
    );
}

export default registro