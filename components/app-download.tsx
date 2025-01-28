import Image from 'next/image'

export function AppDownload() {
  return (
    <section className="bg-[#FFF5F5] py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D1B69] mb-4">
            Download onze iOS & Android App
          </h2>
          <p className="text-lg mb-8 text-muted-foreground">
            Download onze app en plaats je bestellingen direct via de App Store en Play Store.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[200px] transition-transform hover:scale-105"
            >
              
              <Image
                src="/GetItOnGooglePlay_Badge_Web_color_Dutch.png"
                alt="Get it on Google Play"
                width={200}
                height={59}
                className="w-full h-auto"
              />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[200px] transition-transform hover:scale-105"
            >
              <Image
                src="/app-store-logo.png"
                alt="Download on the App Store"
                width={200}
                height={59}
                className="w-full h-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

