
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

import "./ThemeToggle.css";

function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "dark";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "dark" ? "light" : "dark"
        );
    };

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
                theme === "dark"
                    ? "Activar modo claro"
                    : "Activar modo oscuro"
            }
            title={
                theme === "dark"
                    ? "Activar modo claro"
                    : "Activar modo oscuro"
            }
        >
            {theme === "dark" ? (
                <Sun aria-hidden="true" />
            ) : (
                <Moon aria-hidden="true" />
            )}
        </button>
    );
}

export default ThemeToggle;
