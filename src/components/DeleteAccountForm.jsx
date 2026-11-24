import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Eye, EyeOff, Trash2, X } from "lucide-react";

import { deleteAccount } from "../services/profileService";

import "./DeleteAccountForm.css";

function DeleteAccountForm() {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCancel = () => {
        setIsOpen(false);
        setPassword("");
        setShowPassword(false);
        setConfirmed(false);
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!password) {
            setError("Introduce tu contraseña para continuar.");
            return;
        }

        if (!confirmed) {
            setError(
                "Debes confirmar que comprendes que esta acción es irreversible."
            );
            return;
        }

        try {
            setLoading(true);

            await deleteAccount(password);

            navigate("/", {
                replace: true,
                state: {
                    message: "Tu cuenta se ha eliminado correctamente."
                }
            });
        } catch (err) {
            setError(
                err.message || "No se pudo eliminar la cuenta."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="delete-account-section"
            aria-labelledby="delete-account-title"
        >
            <div className="delete-account-heading">
                <AlertTriangle aria-hidden="true" />
                <h2 id="delete-account-title">
                    Eliminar cuenta
                </h2>
            </div>

            <p className="delete-account-description">
                Si eliminas tu cuenta, perderás el acceso a ella.
                Esta acción no se puede deshacer.
            </p>

            {!isOpen ? (
                <button
                    type="button"
                    className="delete-account-open"
                    onClick={() => setIsOpen(true)}
                >
                    <Trash2 aria-hidden="true" />
                    Eliminar mi cuenta
                </button>
            ) : (
                <form
                    className="delete-account-form"
                    onSubmit={handleSubmit}
                    aria-labelledby="delete-account-confirm-title"
                >
                    <h3 id="delete-account-confirm-title">
                        Confirmar eliminación
                    </h3>

                    <p className="delete-account-warning">
                        Estás a punto de eliminar tu cuenta de ThePower.
                        Confirma tu contraseña antes de continuar.
                    </p>

                    {error && (
                        <p
                            className="delete-account-error"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <div className="delete-account-field">
                        <label htmlFor="delete-account-password">
                            Contraseña actual
                        </label>

                        <div className="delete-account-password">
                            <input
                                id="delete-account-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setError("");
                                }}
                                autoComplete="current-password"
                                required
                                disabled={loading}
                            />

                            <button
                                type="button"
                                className="delete-account-toggle"
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                                aria-label={
                                    showPassword
                                        ? "Ocultar contraseña"
                                        : "Mostrar contraseña"
                                }
                                disabled={loading}
                            >
                                {showPassword
                                    ? <EyeOff aria-hidden="true" />
                                    : <Eye aria-hidden="true" />}
                            </button>
                        </div>
                    </div>

                    <label className="delete-account-checkbox">
                        <input
                            type="checkbox"
                            checked={confirmed}
                            onChange={(event) =>
                                setConfirmed(event.target.checked)
                            }
                            disabled={loading}
                        />

                        <span>
                            Entiendo que la eliminación de mi cuenta es
                            irreversible y deseo continuar.
                        </span>
                    </label>

                    <div className="delete-account-actions">
                        <button
                            type="button"
                            className="delete-account-cancel"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            <X aria-hidden="true" />
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="delete-account-submit"
                            disabled={loading || !confirmed}
                        >
                            <Trash2 aria-hidden="true" />
                            {loading
                                ? "Eliminando cuenta..."
                                : "Eliminar cuenta definitivamente"}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}

export default DeleteAccountForm;
