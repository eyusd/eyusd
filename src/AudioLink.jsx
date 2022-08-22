import "./audiolink.css"
import spotify_logo from "./assets/logos/spotify.svg";
import amazon_logo from "./assets/logos/amazon-music.svg";
import deezer_logo from "./assets/logos/deezer.svg";
import tidal_logo from "./assets/logos/tidal.svg";
import youtube_music_logo from "./assets/logos/youtube-music.svg";
import youtube_logo from "./assets/logos/youtube.svg";
import apple_logo from "./assets/logos/apple.svg";

const AudioLink = ({ site, linkto }) => {
    switch (site) {
        case "spotify":         return (<a href={linkto} className="noselect spotify link"><div className='text'>SPOTIFY</div><div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><image x="0" y="0" height="24" width="24"  href={spotify_logo} /></svg></div></a>);
        case "deezer":          return (<a href={linkto} className="noselect deezer link"><div className='text'>DEEZER</div><div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><image x="0" y="0" height="24" width="24"  href={deezer_logo} /></svg></div></a>);
        case "youtube":         return (<a href={linkto} className="noselect youtube link"><div className='text'>YOUTUBE</div><div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><image x="0" y="0" height="24" width="24"  href={youtube_logo} /></svg></div></a>);
        case "youtubemusic":    return (<a href={linkto} className="noselect youtube-music link"><div className='text'>YOUTUBE MUSIC</div><div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><image x="0" y="0" height="24" width="24"  href={youtube_music_logo} /></svg></div></a>);
        case "tidal":           return (<a href={linkto} className="noselect tidal link"><div className='text'>TIDAL</div><div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><image x="0" y="0" height="24" width="24"  href={tidal_logo} /></svg></div></a>);
        case "amazon":          return (<a href={linkto} className="noselect amazon-music link"><div className='text'>AMAZON</div><div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><image x="0" y="0" height="24" width="24"  href={amazon_logo} /></svg></div></a>);
        case "applemusic":      return (<a href={linkto} className="noselect apple-music link"><div className='text'>APPLE MUSIC</div><div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><image x="0" y="0" height="24" width="24"  href={apple_logo} /></svg></div></a>);
        case "itunes":          return (<a href={linkto} className="noselect apple-music link"><div className='text'>iTUNES</div><div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><image x="0" y="0" height="24" width="24"  href={apple_logo} /></svg></div></a>);
        case "amazonmusic":     return (<a href={linkto} className="noselect amazon-music link"><div className='text'>AMAZON MUSIC</div><div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><image x="0" y="0" height="24" width="24"  href={amazon_logo} /></svg></div></a>);
        case "unreleased":       return (<div className="noselect link"><div className='text'>UNRELEASED</div></div>);
        default: return (<div></div>);
    }
}

export default AudioLink;