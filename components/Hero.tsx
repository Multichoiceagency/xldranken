"use client";

interface HeroProps {
  title: string;
  description: string;
}

export default function Hero({ title, description }: HeroProps) {
  return (
    <section
      className="relative w-full h-[300px] flex items-center justify-center text-white bg-cover bg-center"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg')",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-lg md:text-xl">{description}</p>
      </div>
    </section>
  );
}
