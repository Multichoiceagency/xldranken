"use client";

import Image from "next/image";

export function LovkaInfoSection() {
  return (
    <section className="bg-white text-black py-12 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Linkerkant: Afbeelding(en) */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/winkel/lovkadrinks.webp" // Vervang door jouw eigen pad/afbeelding
            alt="Lovka Vodka Energy Drink"
            width={300}
            height={300}
            className="object-cover"
          />
        </div>

        {/* Rechterkant: Titel, tekst en knop */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4">Informatie</h2>
          <p className="text-lg mb-6">
            Lovka bevat hoogwaardige Energy dankzi...
            <br />
            Lovka 1 inhoud 250ml blik met 10% pure Vodka.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
            Verkooppunten
          </button>
        </div>
      </div>
    </section>
  );
}
