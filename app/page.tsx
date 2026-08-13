"use client";

import { useState } from "react";
import { song } from "./songs";
import { AudioPlayer } from "./AudioPlayer";

export default function Home() {
  const [showPlayer, setShowPlayer] = useState(true);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#0f0f0f]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/truck-img.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <main className="relative z-10 flex w-full max-w-3xl flex-1 flex-col items-center justify-start gap-4 px-4 pb-40 pt-10 text-center text-white sm:gap-6 sm:px-6 sm:pb-52 sm:pt-16">
        <h1
          className="font-[family-name:var(--font-baloo)] text-3xl font-extrabold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] sm:text-5xl md:text-7xl"
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
        <p className="max-w-md text-base font-bold text-yellow-400 drop-shadow sm:text-lg">
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