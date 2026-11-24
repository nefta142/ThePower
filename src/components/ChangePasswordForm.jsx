import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Save } from "lucide-react";

import { changePassword } from "../services/profileService";

import "./ChangePasswordForm.css";

function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Completa todos los campos de contraseña.");
            return;
        }

        if (newPassword.length < 8 || newPassword.length > 72) {
            setError(
                "La nueva contraseña debe tener entre 8 y 72 caracteres."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas nuevas no coinciden.");
            return;
        }

        if (currentPassword === newPassword) {
            setError(
                "La nueva contraseña debe ser diferente de la actual."
            );
            return;
        }

        try {
            setLoading(true);

            await changePassword({
                currentPassword,
                newPassword
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);

            setSuccess("Tu contraseña se ha actualizado correctamente.");
        } catch (err) {
            setError(
                err.message || "No se pudo cambiar la contraseña."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="change-password-section"
            aria-labelledby="change-password-title"
        >
            <div className="change-password-heading">
                <LockKeyhole aria-hidden="true" />
                <h2 id="change-password-title">
                    Cambiar contraseña
                </h2>
            </div>

            <p className="change-password-description">
                Introduce tu contraseña actual y establece una nueva.
            </p>

            {error && (
                <p className="change-password-error" role="alert">
                    {error}
                </p>
            )}

            {success && (
                <p className="change-password-success" role="status">
                    {success}
                </p>
            )}

            <form
                className="change-password-form"
                onSubmit={handleSubmit}
            >
                <div className="change-password-field">
                    <label htmlFor="current-password">
                        Contraseña actual
                    </label>

                    <div className="change-password-input">
                        <input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(event) => {
                                setCurrentPassword(event.target.value);
                                setError("");
                            }}
                            autoComplete="current-password"
                            required
                            disabled={loading}
                        />

                        <button
                            type="button"
                            className="change-password-toggle"
                            onClick={() =>
                                setShowCurrentPassword((previous) => !previous)
                            }
                            aria-label={
                                showCurrentPassword
                                    ? "Ocultar contraseña actual"
                                    : "Mostrar contraseña actual"
                            }
                            aria-pressed={showCurrentPassword}
                            disabled={loading}
                        >
                            {showCurrentPassword
                                ? <EyeOff aria-hidden="true" />
                                : <Eye aria-hidden="true" />}
                        </button>
                    </div>
                </div>

                <div className="change-password-field">
                    <label htmlFor="new-password">
                        Nueva contraseña
                    </label>

                    <div className="change-password-input">
                        <input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(event) => {
                                setNewPassword(event.target.value);
                                setError("");
                            }}
                            minLength={8}
                            maxLength={72}
                            autoComplete="new-password"
                            required
                            disabled={loading}
                        />

                        <button
                            type="button"
                            className="change-password-toggle"
                            onClick={() =>
                                setShowNewPassword((previous) => !previous)
                            }
                            aria-label={
                                showNewPassword
                                    ? "Ocultar contraseña nueva"
                                    : "Mostrar contraseña nueva"
                            }
                            aria-pressed={showNewPassword}
                            disabled={loading}
                        >
                            {showNewPassword
                                ? <EyeOff aria-hidden="true" />
                                : <Eye aria-hidden="true" />}
                        </button>
                    </div>
                </div>

                <div className="change-password-field">
                    <label htmlFor="confirm-new-password">
                        Confirmar nueva contraseña
                    </label>

                    <div className="change-password-input">
                        <input
                            id="confirm-new-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(event) => {
                                setConfirmPassword(event.target.value);
                                setError("");
                            }}
                            autoComplete="new-password"
                            required
                            disabled={loading}
                        />

                        <button
                            type="button"
                            className="change-password-toggle"
                            onClick={() =>
                                setShowConfirmPassword((previous) => !previous)
                            }
                            aria-label={
                                showConfirmPassword
                                    ? "Ocultar confirmación de contraseña"
                                    : "Mostrar confirmación de contraseña"
                            }
                            aria-pressed={showConfirmPassword}
                            disabled={loading}
                        >
                            {showConfirmPassword
                                ? <EyeOff aria-hidden="true" />
                                : <Eye aria-hidden="true" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="change-password-submit"
                    disabled={loading}
                >
                    <Save aria-hidden="true" />
                    {loading
                        ? "Actualizando contraseña..."
                        : "Guardar nueva contraseña"}
                </button>
            </form>
        </section>
    );
}

export default ChangePasswordForm;
