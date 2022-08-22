import "./home.css"
import face from "./assets/face.png"
import cross from "./assets/cross.png"

const Home = () => {
    return (
        <div className="container">
            <img src={face} className="face" alt="face"></img>
            <div className="aboutext">
                <p>Music as a gate to what lies beyond our senses. Soundwaves filling the space, twisting existing art to reveal its darker side. <p2>eyusd.</p2> is all about this. It is dark electro, navigating between Dark House, Bass Music, Dubstep, inspired by artists like <i>Rezz</i>, <i>Astroglitch</i> or <i>TriS</i>.</p>
                <p>As all possibilities exist within the boundless <i>Chaos</i>, among them also is the possibility for the birth of cosmic existence. But the <i>Chaos</i> that surrounds cosmos is Anti-cosmic, because its pandimensional and formless power acts as the antithesis to the formed, limiting and causal structures of the finite order of cosmos. <i>Chaos</i>, that pervades the barriers of cosmic space-time, is therefore experienced, from the cosmic perspective, as destructive, dissolving and consuming. This is because it dissolves the limiting structures and forms and, instead, reinstates the formless and unbound state of acausality which is the origin and end of all.</p>
                <p>For that acknowledgment, we bear the crosses on our eyes.</p>
            </div>
            <img src={cross} className="cross" alt="cross"></img>
        </div>
    )
}

export default Home;