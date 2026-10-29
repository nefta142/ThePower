import { Heart } from "lucide-react";
import './SongCard.css'

function SongCard({title, image, artist}){
    return(
        <article className="song-card">
            <img src={image} alt={`Portrada de ${title}`} className="song-card-image"/>
            <div className="song-card-info">
                <div className="song-card-text">
                    <h3>{title}</h3>
                    <p>{artist}</p>
                </div>

                <button type="button" className="song-card-favorite" aria-label={`Añadir ${title} a favoritos`} title="Favoritos disponibles próximamente" disabled>
                    <Heart aria-hidden="true"/>
                </button>
            </div>
        </article>
    );
}

export default SongCard;