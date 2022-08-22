import AudioPlayer from "./AudioPlayer";
import tracks from "./tracks";

const TitlePlayer = () => {
    return (<AudioPlayer tracks={tracks} />)
}

export default TitlePlayer;