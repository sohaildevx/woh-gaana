export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/truck-img.png')" }}
      />
      <main className="relative z-10 flex flex-col items-center gap-4 px-6 py-24 text-center text-white">
        <h1
          className="font-[family-name:var(--font-baloo)] text-5xl font-extrabold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] sm:text-7xl"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, #fff7cc, #ffd75e 45%, #f59e0b 70%, #b45309)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          धीरे धीरे चलो, घर की याद
        </h1>
        <p className="max-w-md text-lg drop-shadow text-yellow-400 font-bold">
          Nostalgic gaane for the road — play it loud, driver.
        </p>
      </main>
    </div>
  );
}