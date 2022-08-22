import AudioLink from "./AudioLink";
import "./styles.css";
import face from "./assets/face.png"

const SitesLinks = () => {
    const links = {spotify: "https://open.spotify.com/artist/69FmfmKQDzQPSGzltAudeh", deezer: "https://www.deezer.com/artist/124422212", applemusic: "https://music.apple.com/fr/artist/eyusd/1555044301?app=music", youtube: "https://www.youtube.com/c/eyusd_", tidal: "https://listen.tidal.com/artist/23650170", amazonmusic: "https://music.amazon.fr/artists/B08X8JFR2L", youtubemusic: "https://music.youtube.com/browse/UChe5rjFxhjYJmaL03YpvA0A", itunes: "https://music.apple.com/fr/artist/eyusd/1555044301?app=itunes", amazon: "https://amazon.fr/dp/B08X8JFR2L"};
    return (
        <div className="audio-stuff">
            <div className="face">
                <img width="300px" height="300px" src={face}></img>
            </div>
            <div className="links-container">
                {Object.entries(links).map( ([key, value]) => <AudioLink site={key} linkto={value} />)}
            </div>
      </div>
    )
}

export default SitesLinks;