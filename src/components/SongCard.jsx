import { Heart, Music2 } from "lucide-react";
import { useState } from "react";

import "./SongCard.css";


const API_URL = import.meta.env.VITE_API_URL;

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${API_URL}/${image.replace(/^\/+/, "")}`;
}


function SongCard({ title, genre, image }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getImageUrl(image);

  return (
    <article className="song-card">
      {image && !imageError ? (
        <img
          src={imageUrl}
          alt={`Portada de ${title}`}
          className="song-card-image"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className="song-card-image song-card-placeholder"
          role="img"
          aria-label={`Portada no disponible para ${title}`}
        >
          <Music2 aria-hidden="true" />
        </div>
      )}

      <div className="song-card-info">
        <div className="song-card-text">
          <h3>{title}</h3>
          <p>{genre}</p>
        </div>

        <button
          type="button"
          className="song-card-favorite"
          aria-label={`Añadir ${title} a favoritos`}
          title="Favoritos disponibles próximamente"
          disabled
        >
          <Heart aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default SongCard;
