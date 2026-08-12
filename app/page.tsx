export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/truck-img.png')" }}
      />
      <main className="relative z-10 flex flex-col items-center gap-4 px-6 text-center text-white">
        <h1 className="text-4xl font-bold drop-shadow-lg sm:text-6xl">
          धीरे धीरे चलो, घर की याद
        </h1>
        <p className="max-w-md text-lg drop-shadow">
          Nostalgic gaane for the road — play it loud, driver.
        </p>
      </main>
    </div>
  );
}