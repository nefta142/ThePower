import Header from "../components/Header"
import SongCard from "../components/SongCard";
import "./Home.css"

function home(){
return(
<main className="home">
    <Header />
    <section aria-labelledby="home-title">
        <h1 id="home-title">Descubre tu música</h1>
        <p>Escucha tus canciones favoritas en The Power.</p>
    </section>

    <section  aria-labelledby="recommended-title">
        <h2 id="recommended-title">Recomendado para ti</h2>
        <div className="songs-grid">
            <SongCard title="God ends here" artist ="Blake" image=""/>
        </div>
    </section>

    <section aria-labelledby="popular-title">
        <h2 id="popular-title">Lo más escuchado</h2>
    </section>
</main>
);
}

export  default home