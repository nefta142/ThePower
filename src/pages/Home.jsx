import Header from "../components/Header"

function home(){
return(
<main className="home">
    <Header />
    <section aria-labelledby="home-title">
        <h1 id="home-title">Descubre tu musica</h1>
        <p>Escucha tus canciones favoritas en The Power.</p>
    </section>

    <section  aria-labelledby="recommended-title">
        <h2 id="recommended-title">Recomendado para ti</h2>
    </section>

    <section aria-labelledby="popular-title">
        <h2 id="popular-title">Lo más escuchado</h2>
    </section>
</main>
);
}

export  default home