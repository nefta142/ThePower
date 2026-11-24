import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { UserRound, Pencil, Save, X, LogOut } from "lucide-react";

import { logoutUsuario } from "../services/authService";
import { updateProfile } from "../services/profileService";

import SongUploadForm from "../components/SongUploadForm";
import MySongs from "../components/MySongs";
import ChangePasswordForm from "../components/ChangePasswordForm";

import "./Profile.css";

function Profile() {
    const { user } = useOutletContext();
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(user);

    const [formData, setFormData] = useState({
        userName: user.nombreUsuario || "",
        name: user.nombre || "",
        lastName1: user.apellido1 || "",
        lastName2: user.apellido2 || "",
        email: user.email || ""
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [songsRefresh, setSongsRefresh] = useState(0);

    const resetForm = (userData) => {
        setFormData({
            userName: userData.nombreUsuario || "",
            name: userData.nombre || "",
            lastName1: userData.apellido1 || "",
            lastName2: userData.apellido2 || "",
            email: userData.email || ""
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
    };

    const handleEdit = () => {
        setEditing(true);
        setError("");
        setSuccess("");
    };

    const handleCancel = () => {
        resetForm(currentUser);
        setEditing(false);
        setError("");
    };

    const handleSave = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.userName.trim() ||
            !formData.name.trim() ||
            !formData.lastName1.trim() ||
            !formData.email.trim()
        ) {
            setError("Completa todos los campos obligatorios.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            setError("Introduce un correo electrónico válido.");
            return;
        }

        try {
            setLoading(true);

            const updatedUser = await updateProfile(formData);

            setCurrentUser(updatedUser);
            resetForm(updatedUser);

            setEditing(false);
            setSuccess("Tus datos se han actualizado correctamente.");

        } catch (err) {
            setError(
                err.message || "No se pudieron actualizar tus datos."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await logoutUsuario();

            navigate("/", {
                replace: true,
                state: {
                    message: "Has cerrado sesión correctamente."
                }
            });

        } catch (err) {
            setError(err.message || "No se pudo cerrar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="profile">
            <header className="profile-header">
                <div className="profile-avatar">
                    <UserRound aria-hidden="true" />
                </div>

                <div className="profile-heading">
                    <h1>Mi perfil</h1>
                    <p>@{currentUser.nombreUsuario}</p>
                    <p>{currentUser.email}</p>
                </div>
            </header>

            {error && (
                <p className="profile-error" role="alert">
                    {error}
                </p>
            )}

            {success && (
                <p className="profile-success" role="status">
                    {success}
                </p>
            )}

            <section
                className="profile-section"
                aria-labelledby="profile-data-title"
            >
                <div className="profile-section-header">
                    <h2 id="profile-data-title">
                        Mis datos personales
                    </h2>

                    {!editing && (
                        <button
                            type="button"
                            className="profile-edit-button"
                            onClick={handleEdit}
                        >
                            <Pencil aria-hidden="true" />
                            Editar
                        </button>
                    )}
                </div>

                <form onSubmit={handleSave} className="profile-form">
                    <div className="profile-form-group">
                        <label htmlFor="profile-userName">
                            Nombre de usuario
                        </label>

                        <input
                            id="profile-userName"
                            name="userName"
                            type="text"
                            value={formData.userName}
                            onChange={handleChange}
                            maxLength={25}
                            required
                            disabled={!editing || loading}
                        />
                    </div>

                    <div className="profile-form-group">
                        <label htmlFor="profile-name">
                            Nombre
                        </label>

                        <input
                            id="profile-name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            maxLength={50}
                            required
                            disabled={!editing || loading}
                        />
                    </div>

                    <div className="profile-form-group">
                        <label htmlFor="profile-lastName1">
                            Primer apellido
                        </label>

                        <input
                            id="profile-lastName1"
                            name="lastName1"
                            type="text"
                            value={formData.lastName1}
                            onChange={handleChange}
                            maxLength={50}
                            required
                            disabled={!editing || loading}
                        />
                    </div>

                    <div className="profile-form-group">
                        <label htmlFor="profile-lastName2">
                            Segundo apellido (opcional)
                        </label>

                        <input
                            id="profile-lastName2"
                            name="lastName2"
                            type="text"
                            value={formData.lastName2}
                            onChange={handleChange}
                            maxLength={50}
                            disabled={!editing || loading}
                        />
                    </div>

                    <div className="profile-form-group">
                        <label htmlFor="profile-email">
                            Correo electrónico
                        </label>

                        <input
                            id="profile-email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            maxLength={50}
                            required
                            disabled={!editing || loading}
                        />
                    </div>

                    {editing && (
                        <div className="profile-form-actions">
                            <button
                                type="button"
                                className="profile-cancel-button"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                <X aria-hidden="true" />
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="profile-save-button"
                                disabled={loading}
                            >
                                <Save aria-hidden="true" />
                                {loading ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>
                    )}
                </form>
            </section>
            
            <SongUploadForm
                onUploadSuccess={() => {
                    setSongsRefresh((previous) => previous + 1);
                }}
            />

            <MySongs
                userId={currentUser.idUsuario}
                refreshKey={songsRefresh}
            />
            <section
                className="profile-section"
                aria-labelledby="profile-account-title"
            >
                <ChangePasswordForm/>
                <h2 id="profile-account-title">
                    Mi cuenta
                </h2>

                <button
                    type="button"
                    className="profile-logout-button"
                    onClick={handleLogout}
                    disabled={loading}
                >
                    <LogOut aria-hidden="true" />
                    {loading ? "Procesando..." : "Cerrar sesión"}
                </button>
            </section>

            <Link to="/" className="profile-back-link">
                Volver al inicio
            </Link>
        </main>
    );
}

export default Profile;