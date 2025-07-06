import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Artist Avatar */}
        <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-red-500/50 shadow-2xl">
          <Image
            src="/face.0bbc397b4beb74eb3267.png"
            alt="eyusd artist portrait"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Artist Name */}
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold text-white">
            eyusd.
          </h1>
          <p className="text-xl text-red-300 font-light">
            Electronic Music Producer & Sound Designer
          </p>
        </div>

        {/* Artist Description */}
        <div className="max-w-2xl mx-auto space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Crafting ethereal soundscapes and experimental electronic compositions, 
            eyusd explores the intersection of ambient textures, glitchy beats, and 
            nostalgic melodies.
          </p>
          
          <p className="text-base leading-relaxed">
            Drawing inspiration from occult aesthetics, EDM energy, and experimental 
            sound design, eyusd creates immersive audio experiences that transport 
            listeners through digital realms and emotional landscapes.
          </p>
        </div>
      </div>
    </div>
  );
}
