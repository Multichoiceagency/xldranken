import React from "react"

export default function BetaalmethodenPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-[#0F3059] mb-6">Betaalmethoden</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="text-sm text-gray-500 mb-4">Laatst bijgewerkt: 11 mei 2025</div>

        <div className="prose max-w-none">
          <p className="mb-4">
            XL Groothandel BV biedt verschillende betaalmethoden aan om het bestelproces zo gemakkelijk mogelijk te
            maken voor onze zakelijke klanten. Hieronder vindt u een overzicht van de beschikbare betaalmethoden en de
            bijbehorende voorwaarden.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">1. Beschikbare betaalmethoden</h2>
          <p className="mb-4">Bij XL Groothandel BV kunt u gebruik maken van de volgende betaalmethoden:</p>

          <h3 className="text-lg font-medium text-[#0F3059] mt-4 mb-2">1.1 Betaling op factuur (zakelijke klanten)</h3>
          <p className="mb-4">
            Als zakelijke klant kunt u bij ons op factuur bestellen. Na goedkeuring van uw zakelijke account ontvangt u
            een factuur met een betalingstermijn van 14 dagen, tenzij anders overeengekomen. Voor nieuwe klanten geldt
            mogelijk een kortere betalingstermijn of een aanbetaling voor de eerste bestellingen.
          </p>

          <h3 className="text-lg font-medium text-[#0F3059] mt-4 mb-2">1.2 Bankoverschrijving</h3>
          <p className="mb-4">
            U kunt het verschuldigde bedrag overmaken naar onze bankrekening. Uw bestelling wordt verwerkt zodra de
            betaling is ontvangen. Vermeld bij uw betaling altijd het factuurnummer of bestelnummer.
          </p>

          <h3 className="text-lg font-medium text-[#0F3059] mt-4 mb-2">1.3 iDEAL</h3>
          <p className="mb-4">
            Voor directe online betalingen bieden wij iDEAL aan. Met iDEAL kunt u veilig en snel betalen via uw eigen
            bank. Na betaling wordt uw bestelling direct verwerkt.
          </p>

          <h3 className="text-lg font-medium text-[#0F3059] mt-4 mb-2">1.4 Creditcard</h3>
          <p className="mb-4">
            Wij accepteren betalingen met Mastercard en Visa. Uw betaling wordt veilig verwerkt via onze betaalprovider.
          </p>

          <h3 className="text-lg font-medium text-[#0F3059] mt-4 mb-2">1.5 Automatische incasso</h3>
          <p className="mb-4">
            Voor vaste klanten met regelmatige bestellingen bieden wij de mogelijkheid tot automatische incasso.
            Hiervoor dient u een machtigingsformulier in te vullen. Neem contact op met onze financiële administratie
            voor meer informatie.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">2. Betalingsvoorwaarden</h2>

          <h3 className="text-lg font-medium text-[#0F3059] mt-4 mb-2">2.1 Betalingstermijn</h3>
          <p className="mb-4">
            Voor betalingen op factuur geldt een standaard betalingstermijn van 14 dagen na factuurdatum, tenzij
            schriftelijk anders overeengekomen. Bij overschrijding van de betalingstermijn bent u zonder nadere
            ingebrekestelling de wettelijke handelsrente verschuldigd.
          </p>

          <h3 className="text-lg font-medium text-[#0F3059] mt-4 mb-2">2.2 Kredietlimiet</h3>
          <p className="mb-4">
            Voor zakelijke klanten kan een kredietlimiet worden vastgesteld. Deze limiet bepaalt het maximale
            openstaande bedrag aan facturen. Bij overschrijding van deze limiet kunnen wij vragen om een (deel)betaling
            voordat nieuwe bestellingen worden uitgeleverd.
          </p>

          <h3 className="text-lg font-medium text-[#0F3059] mt-4 mb-2">2.3 Eigendomsvoorbehoud</h3>
          <p className="mb-4">
            Alle geleverde producten blijven eigendom van XL Groothandel BV totdat alle facturen volledig zijn voldaan.
            Voor meer informatie verwijzen wij u naar onze{" "}
            <a href="/algemene-voorwaarden" className="text-[#0F3059] hover:underline">
              Algemene Voorwaarden
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">3. Facturatie</h2>
          <p className="mb-4">
            Na het plaatsen van uw bestelling ontvangt u een orderbevestiging per e-mail. De factuur wordt digitaal
            verzonden naar het door u opgegeven e-mailadres. Op verzoek kunnen wij de factuur ook per post versturen.
          </p>
          <p className="mb-4">
            Alle prijzen op onze website en in onze catalogus zijn exclusief BTW, tenzij anders vermeld.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">4. Betalingsproblemen</h2>
          <p className="mb-4">
            Indien u problemen ondervindt met het voldoen van uw factuur, neem dan tijdig contact op met onze financiële
            administratie. In overleg kunnen wij mogelijk een betalingsregeling treffen.
          </p>
          <p className="mb-4">
            Bij niet-tijdige betaling zijn wij genoodzaakt incassomaatregelen te nemen. De daaruit voortvloeiende kosten
            komen voor uw rekening.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">5. Vragen over facturatie en betaling</h2>
          <p className="mb-4">
            Voor vragen over uw factuur, betalingen of het aanvragen van een zakelijk account kunt u contact opnemen met
            onze financiële administratie:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>E-mail: administratie@xlgroothandelbv.nl (of info@xlgroothandelbv.nl)</li>
            <li>Telefoon: +31 6 154 725 74</li>
            <li>Bereikbaar op werkdagen van 09:00 tot 16:30 uur</li>
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
