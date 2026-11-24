const API_URL = import.meta.env.VITE_API_URL;

async function getCsrf() {
    const response = await fetch(
        `${API_URL}/api/usuarios/csrf`, {
        method: "GET",
        credentials: "include"
    }
    );

    if (!response.ok) {
        throw new Error("No se pudo obtener el token de seguridad.");
    }
    return response.json();
}

export async function updateProfile(profileData) {
    try {
        const csrf = await getCsrf();
        const response = await fetch(
            `${API_URL}/api/usuarios/me`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                [csrf.headerName]: csrf.token
            },
            body: JSON.stringify({
                nombreUsuario: profileData.userName.trim(),
                email: profileData.email.trim(),
                nombre: profileData.name.trim(),
                apellido1: profileData.lastName1.trim(),
                apellido2: profileData.lastName2.trim()
            })
        }
        );
        if (!response.ok) {
            let errorMessage = "No se pudo actualizar el perfil.";

            const data = await response.json().catch(() => null);

            if (typeof data?.message === "string") {
                errorMessage = data.message;
            } else if (typeof data?.mensaje === "string") {
                errorMessage = data.mensaje;
            }

            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "No se puede conectar con el servidor Java.",
                { cause: error }
            );
        }

        throw error;
    }

}


export async function changePassword(passwordData) {
    try {
        const csrf = await getCsrf();

        const response = await fetch(
            `${API_URL}/api/usuarios/me/contrasena`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    [csrf.headerName]: csrf.token
                },
                body: JSON.stringify({
                    contrasenaActual: passwordData.currentPassword,
                    contrasenaNueva: passwordData.newPassword
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);

            let errorMessage = "No se pudo cambiar la contraseña.";

            if (response.status === 401) {
                errorMessage = "Debes iniciar sesión nuevamente.";
            } else if (typeof errorData?.message === "string") {
                errorMessage = errorData.message;
            } else if (typeof errorData?.mensaje === "string") {
                errorMessage = errorData.mensaje;
            } else if (typeof errorData?.detail === "string") {
                errorMessage = errorData.detail;
            } else if (response.status === 403) {
                errorMessage =
                    "No se pudo autorizar el cambio de contraseña.";
            }

            throw new Error(errorMessage);
        }

        return await response.json();

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "No se puede conectar con el servidor Java.",
                { cause: error }
            );
        }

        throw error;
    }
}
