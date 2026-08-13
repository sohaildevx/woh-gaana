"use client";

import { useState } from "react";
import { song } from "./songs";
import { AudioPlayer } from "./AudioPlayer";

export default function Home() {
  const [showPlayer, setShowPlayer] = useState(true);

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/truck-img.png')" }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <main className="relative z-10 flex w-full max-w-3xl flex-1 flex-col items-center justify-start gap-8 px-6 py-16 text-center text-white">
        <h1
          className="font-[family-name:var(--font-baloo)] text-5xl font-extrabold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] sm:text-7xl"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, #fff7cc, #ffd75e 45%, #f59e0b 70%, #b45309)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <span className="block">धीरे धीरे चलो,</span>
          <span className="block">घर की याद</span>
        </h1>
        <p className="max-w-md text-lg font-bold text-yellow-400 drop-shadow">
          Nostalgic gaane for the road — play it loud, driver.
        </p>
      </main>

      {showPlayer && (
        <AudioPlayer
          songs={song}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
}