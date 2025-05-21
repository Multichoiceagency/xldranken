import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Klachtenregeling | XL Groothandel",
  description:
    "Informatie over onze klachtenprocedure en hoe wij omgaan met klachten en geschillen bij XL Groothandel BV.",
}

export default function KlachtenregelingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-[#0F3059] mb-6">Klachtenregeling</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="text-sm text-gray-500 mb-4">Laatst bijgewerkt: 11 mei 2025</div>

        <div className="prose max-w-none">
          <p className="mb-4">
            Bij XL Groothandel BV streven wij naar een optimale dienstverlening en klanttevredenheid. Toch kan het
            voorkomen dat u niet tevreden bent over een product of dienst. In dat geval horen wij dat graag van u, zodat
            we samen naar een passende oplossing kunnen zoeken. In deze klachtenregeling leest u hoe u een klacht kunt
            indienen en hoe wij deze behandelen.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">1. Wanneer kunt u een klacht indienen?</h2>
          <p className="mb-4">U kunt een klacht indienen als u ontevreden bent over:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>De kwaliteit van onze producten</li>
            <li>De levering van uw bestelling</li>
            <li>Onze dienstverlening</li>
            <li>De behandeling door onze medewerkers</li>
            <li>Facturatie en betalingen</li>
            <li>Andere aspecten van onze dienstverlening</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">2. Hoe kunt u een klacht indienen?</h2>
          <p className="mb-4">U kunt uw klacht op verschillende manieren bij ons indienen:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>
              <strong>E-mail:</strong> Stuur een e-mail naar klachten@xlgroothandelbv.nl of info@xlgroothandelbv.nl
            </li>
            <li>
              <strong>Telefoon:</strong> Bel onze klantenservice op +31 6 154 725 74 (bereikbaar op werkdagen van 08:30
              tot 17:00 uur)
            </li>
            <li>
              <strong>Post:</strong> Stuur een brief naar XL Groothandel BV, t.a.v. Klachtenafhandeling, Turfschipper
              116, 2292 JB Wateringen
            </li>
            <li>
              <strong>Contactformulier:</strong> Vul het contactformulier in op onze website
            </li>
          </ul>

          <h3 className="text-lg font-medium text-[#0F3059] mt-4 mb-2">2.1 Wat hebben wij nodig bij uw klacht?</h3>
          <p className="mb-4">
            Om uw klacht zo goed mogelijk te kunnen behandelen, vragen wij u om de volgende informatie te vermelden:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Uw naam, bedrijfsnaam en contactgegevens</li>
            <li>Uw klantnummer of bestelnummer (indien van toepassing)</li>
            <li>Een duidelijke omschrijving van uw klacht</li>
            <li>Eventuele bewijsstukken (foto's, e-mails, etc.)</li>
            <li>Uw voorstel voor een oplossing (indien u die heeft)</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">3. Hoe behandelen wij uw klacht?</h2>
          <p className="mb-4">
            Wij nemen elke klacht serieus en behandelen deze vertrouwelijk. Onze klachtenprocedure verloopt als volgt:
          </p>

          <h3 className="text-lg font-medium text-[#0F3059] mt-4 mb-2">3.1 Ontvangstbevestiging</h3>
          <p className="mb-4">
            Na ontvangst van uw klacht sturen wij u binnen 2 werkdagen een bevestiging. Hierin vermelden wij:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Dat wij uw klacht hebben ontvangen</li>
            <li>Wie uw klacht in behandeling neemt</li>
            <li>Wanneer u een inhoudelijke reactie kunt verwachten</li>
          </ul>

          <h3 className="text-lg font-medium text-[#0F3059] mt-4 mb-2">3.2 Behandeling van uw klacht</h3>
          <p className="mb-4">
            Uw klacht wordt behandeld door een medewerker die niet direct betrokken is geweest bij het onderwerp van uw
            klacht. Deze medewerker onderzoekt uw klacht grondig en objectief. Indien nodig nemen wij contact met u op
            voor aanvullende informatie.
          </p>

          <h3 className="text-lg font-medium text-[#0F3059] mt-4 mb-2">3.3 Oplossing en reactie</h3>
          <p className="mb-4">
            Wij streven ernaar om binnen 10 werkdagen een inhoudelijke reactie op uw klacht te geven. In deze reactie:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Geven wij een duidelijke uitleg over onze bevindingen</li>
            <li>Bieden wij een passende oplossing aan</li>
            <li>
              Indien van toepassing: leggen wij uit welke maatregelen wij nemen om soortgelijke klachten in de toekomst
              te voorkomen
            </li>
          </ul>
          <p className="mb-4">
            Bij complexe klachten kan de behandelingstermijn langer zijn. In dat geval informeren wij u hierover tijdig.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">4. Niet tevreden met de afhandeling?</h2>
          <p className="mb-4">
            Indien u niet tevreden bent met de afhandeling van uw klacht, kunt u dit binnen 4 weken na onze reactie
            kenbaar maken. Uw klacht wordt dan opnieuw beoordeeld door de directie van XL Groothandel BV.
          </p>
          <p className="mb-4">
            Als we er samen niet uitkomen, kunt u als zakelijke klant het geschil voorleggen aan de bevoegde rechter.
            Zie hiervoor artikel 11 van onze{" "}
            <a href="/algemene-voorwaarden" className="text-[#0F3059] hover:underline">
              Algemene Voorwaarden
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">5. Registratie van klachten</h2>
          <p className="mb-4">
            Alle klachten worden door ons geregistreerd en bewaard voor een periode van 2 jaar. Wij gebruiken deze
            informatie om onze dienstverlening te verbeteren.
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">6. Privacy</h2>
          <p className="mb-4">
            Wij behandelen alle klachten vertrouwelijk. Uw persoonsgegevens worden alleen gebruikt voor de afhandeling
            van uw klacht en worden niet zonder uw toestemming aan derden verstrekt. Voor meer informatie over hoe wij
            omgaan met uw persoonsgegevens, verwijzen wij u naar ons{" "}
            <a href="/privacy-beleid" className="text-[#0F3059] hover:underline">
              Privacy Beleid
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold text-[#0F3059] mt-6 mb-3">7. Contact</h2>
          <p className="mb-4">
            Heeft u vragen over onze klachtenregeling? Neem dan contact op met onze klantenservice:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>E-mail: info@xlgroothandelbv.nl</li>
            <li>Telefoon: +31 6 154 725 74</li>
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
