import { Info, X } from "lucide-react";
import "./FeedBack.css"

function FeedBack({message, onClose}){
    if(!message) return null;

    return(
        <div className="feedback" role="status">
            <Info aria-hidden="true"/>
            <p>{message}</p>
            <button type="button" onClick={onClose} aria-label="Cerrrar mensaje">
                <X aria-hidden="true"/>
            </button>
        </div>
    );

}

export default FeedBack;