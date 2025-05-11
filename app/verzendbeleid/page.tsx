import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verzendbeleid | XL Groothandel",
  description: "Informatie over verzending, levertijden en bezorgopties bij XL Groothandel BV.",
}

export default function VerzendbeleidPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-[#0F3059] mb-6">Verzendbeleid</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="text-sm text-gray-500 mb-4">Laatst bijgewerkt: 11 mei 2025</div>

        <div className="prose max-w-none">
          <p className="mb-4">
            Bij XL Groothandel BV streven wij ernaar om uw bestelling zo snel en efficiënt mogelijk bij u te bezorgen.
            In dit verzendbeleid vindt u alle informatie over onze verzendmethoden, levertijden en bezorgopties.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">1. Verzendmethoden</h2>
          <p className="mb-4">
            XL Groothandel BV werkt samen met verschillende logistieke partners om uw bestelling op de meest efficiënte
            manier te bezorgen. Afhankelijk van het type product, de bestemming en de grootte van uw bestelling,
            gebruiken wij de volgende verzendmethoden:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Standaard pakketbezorging (voor kleinere bestellingen)</li>
            <li>Palletverzending (voor grotere bestellingen)</li>
            <li>Eigen bezorgdienst (voor lokale leveringen in de regio Den Haag/Rotterdam)</li>
            <li>Express verzending (voor spoedbestellingen)</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">2. Levertijden</h2>
          <p className="mb-4">
            De levertijd is afhankelijk van de beschikbaarheid van de producten en de gekozen verzendmethode:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>
              <strong>Standaard bezorging:</strong> 1-3 werkdagen na verwerking van uw bestelling
            </li>
            <li>
              <strong>Palletverzending:</strong> 2-5 werkdagen na verwerking van uw bestelling
            </li>
            <li>
              <strong>Eigen bezorgdienst:</strong> In overleg, meestal binnen 1-2 werkdagen
            </li>
            <li>
              <strong>Express verzending:</strong> Volgende werkdag (bij bestellingen geplaatst vóór 14:00 uur)
            </li>
          </ul>
          <p className="mb-4">
            Let op: De genoemde levertijden zijn indicatief. In periodes van drukte, zoals feestdagen, kunnen de
            levertijden langer zijn.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">3. Verzendkosten</h2>
          <p className="mb-4">
            De verzendkosten worden berekend op basis van het gewicht, volume en de bestemming van uw bestelling. De
            exacte verzendkosten worden tijdens het bestelproces weergegeven voordat u de bestelling afrondt.
          </p>
          <p className="mb-4">
            Voor bestellingen boven €750,- (exclusief BTW) binnen Nederland bieden wij gratis verzending aan.
                      Voor bestellingen boven €900,- (exclusief BTW) buiten Belgie bieden wij gratis verzending aan.

          </p>
          <p className="mb-4">
            Voor spoedbestellingen en express leveringen gelden aanvullende kosten. Deze worden tijdens het bestelproces
            weergegeven.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">4. Bezorggebied</h2>
          <p className="mb-4">
            XL Groothandel BV levert primair in Nederland. Voor leveringen naar België en Duitsland gelden aangepaste
            tarieven en levertijden. Voor andere internationale leveringen kunt u contact opnemen met onze
            klantenservice voor een offerte op maat.
          </p>
          <p className="mb-4">Onze eigen bezorgdienst is beschikbaar in de volgende regio's:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Den Haag en omgeving</li>
            <li>Rotterdam en omgeving</li>
            <li>Delft</li>
            <li>Zoetermeer</li>
            <li>Westland</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">5. Track & Trace</h2>
          <p className="mb-4">
            Na verzending van uw bestelling ontvangt u een e-mail met een Track & Trace code waarmee u de status van uw
            zending kunt volgen. Voor bestellingen die met onze eigen bezorgdienst worden geleverd, ontvangt u een
            e-mail met de geplande bezorgdatum en een geschat tijdvak.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">6. Bezorging en ontvangst</h2>
          <p className="mb-4">Bij bezorging van uw bestelling vragen wij u om het volgende:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Controleer of de verpakking intact is</li>
            <li>Controleer of het aantal colli overeenkomt met wat op de vrachtbrief staat</li>
            <li>Controleer de inhoud van de zending op eventuele beschadigingen of ontbrekende items</li>
            <li>
              Meld eventuele schade of onregelmatigheden direct aan de bezorger en maak hier indien mogelijk foto's van
            </li>
          </ul>
          <p className="mb-4">
            Indien u niet aanwezig bent op het moment van bezorging, zal de bezorger een bericht achterlaten met
            instructies voor een nieuwe bezorgpoging of afhaling.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">7. Retourzendingen</h2>
          <p className="mb-4">
            Voor informatie over retourzendingen verwijzen wij u naar onze{" "}
            <a href="/algemene-voorwaarden" className="text-[#0F3059] hover:underline">
              Algemene Voorwaarden
            </a>{" "}
            of neem contact op met onze klantenservice.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">8. Vragen over uw bestelling</h2>
          <p className="mb-4">
            Heeft u vragen over de verzending of levering van uw bestelling? Neem dan contact op met onze
            klantenservice:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Telefoon: +31 6 154 725 74</li>
            <li>E-mail: info@xlgroothandelbv.nl</li>
            <li>Bereikbaar op werkdagen van 08:30 tot 17:00 uur</li>
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              XL Groothandel BV
              <br />
              Turfschipper 116
              <br />
              2292 JB Wateringen
              <br />
              KvK-nummer: 91231906
              <br />
              BTW-nummer: [BTW-nummer]
              <br />
              Klantenservice: +31 6 154 725 74
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
