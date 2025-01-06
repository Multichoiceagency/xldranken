import Image from "next/image"
import { Button } from "@/components/ui/button"

export function AboutUsSection() {
  return (
    <section className="py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-3xl font-bold">Over XL Dranken</h2>
              <span className="text-sm font-medium text-muted-foreground">
                900+ DRANKEN & PRODUCTEN
              </span>
            </div>
            <div className="space-y-6 text-muted-foreground">
              <p>
                Welkom bij XL Dranken, dé specialist in alcoholische en non-alcoholische dranken. 
                Met trots bieden wij een assortiment van meer dan 900 verschillende dranken aan, 
                zorgvuldig geselecteerd om aan al uw wensen te voldoen.
              </p>
              <p>
                Van ambachtelijke bieren en exclusieve wijnen tot premium sterke drank en 
                verfrissende frisdranken - ons uitgebreide aanbod biedt voor ieder moment 
                de perfecte drank. Ontdek nieuwe smaken of vind uw vertrouwde favorieten 
                in ons constant vernieuwende assortiment.
              </p>
              <p>
                Kwaliteit staat bij ons voorop. We werken nauw samen met toonaangevende 
                leveranciers en producenten om u alleen het beste te kunnen bieden. Ons 
                deskundige team staat altijd klaar om u te adviseren, of u nu op zoek bent 
                naar het perfecte cadeau of de ideale drank voor een speciale gelegenheid.
              </p>
              <p>
                Naast ons uitgebreide drankenassortiment bieden we ook een selectie van food en non-food producten aan. 
                XL Dranken is niet alleen uw partner voor particuliere aankopen, maar levert ook aan avondwinkels, 
                supermarkten, cafés en bars. Onze flexibele service en brede productaanbod maken ons de ideale leverancier 
                voor zowel particulieren als bedrijven in de horeca- en retailsector.
              </p>
            </div>
            <Button className="mt-6 bg-[#FF6B35] hover:bg-[#E85A24] text-white">
              Ontdek ons assortiment
            </Button>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="XL Dranken Store"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

