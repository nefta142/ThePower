import { Link } from "react-router-dom";

function NoEncontrada(){
    return(
        <main>
            <h1>Error 404</h1>
            <p>La página que buscas no existe</p>
            <Link to="/">Volver al inicio</Link>
        </main>
    );
}

export default NoEncontrada