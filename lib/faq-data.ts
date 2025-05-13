import {
  faShoppingCart,
  faTruck,
  faBoxOpen,
  faCreditCard,
  faBuilding,
  faWineBottle,
} from "@fortawesome/free-solid-svg-icons"

// FAQ data organized by categories
export const faqData = [
  {
    category: "Bestellingen",
    icon: faShoppingCart,
    questions: [
      {
        question: "Hoe plaats ik een bestelling?",
        answer:
          "U kunt eenvoudig online bestellen via onze webshop. Selecteer de gewenste producten, voeg ze toe aan uw winkelwagen en volg de stappen om uw bestelling af te ronden. U kunt ook telefonisch bestellen via +31 6 18495949 tijdens onze openingstijden.",
      },
      {
        question: "Kan ik mijn bestelling wijzigen of annuleren?",
        answer:
          "Ja, u kunt uw bestelling wijzigen of annuleren tot 24 uur na het plaatsen, mits deze nog niet is verzonden. Neem hiervoor contact op met onze klantenservice via telefoon of e-mail. Vermeld daarbij altijd uw bestelnummer.",
      },
      {
        question: "Is er een minimaal bestelbedrag?",
        answer:
          "Voor particuliere klanten hanteren wij geen minimaal bestelbedrag. Voor zakelijke klanten geldt een minimale bestelwaarde van €150 exclusief BTW.",
      },
      {
        question: "Kan ik een bestelling plaatsen voor een later levermoment?",
        answer:
          "Ja, bij het afrekenen kunt u een gewenste leverdatum selecteren. Let op: dit is een voorkeursdatum, de exacte leverdatum kan hiervan afwijken afhankelijk van beschikbaarheid en bezorgplanning.",
      },
      {
        question: "Hoe kan ik de status van mijn bestelling controleren?",
        answer:
          "Na het plaatsen van uw bestelling ontvangt u een bevestigingsmail met een link om uw bestelling te volgen. U kunt ook inloggen op uw account om de status van uw bestelling te bekijken.",
      },
    ],
  },
  {
    category: "Levering",
    icon: faTruck,
    questions: [
      {
        question: "Wat zijn de bezorgkosten?",
        answer:
          "Voor bestellingen onder €750 rekenen wij €69.95 bezorgkosten. Bestellingen boven €750 worden gratis bezorgd in heel Nederland. Voor zakelijke klanten gelden speciale voorwaarden.",
      },
      {
        question: "Hoe lang duurt de levering?",
        answer:
          "Bestellingen die op werkdagen vóór 15:00 uur worden geplaatst, worden de volgende werkdag geleverd. Voor sommige afgelegen gebieden kan de levertijd 1-2 dagen langer zijn.",
      },
      {
        question: "Bezorgen jullie ook in het weekend?",
        answer:
          "Standaard bezorgen wij op werkdagen. Voor zakelijke klanten is bezorging op zaterdag mogelijk tegen een toeslag. Neem contact op met onze klantenservice voor meer informatie.",
      },
      {
        question: "Kan ik een specifiek tijdvak kiezen voor de bezorging?",
        answer:
          "Bij het afrekenen kunt u kiezen uit beschikbare tijdvakken voor bezorging. Voor zakelijke klanten bieden we meer flexibiliteit in bezorgtijden.",
      },
      {
        question: "Bezorgen jullie ook in België?",
        answer:
          "Ja, wij bezorgen ook in België. Houd er rekening mee dat de levertijd 1-2 dagen langer kan zijn en er andere bezorgkosten gelden. Bekijk onze internationale verzendvoorwaarden voor meer informatie.",
      },
    ],
  },
  {
    category: "Retourneren & Garantie",
    icon: faBoxOpen,
    questions: [
      {
        question: "Wat is het retourbeleid?",
        answer:
          "U heeft 14 dagen bedenktijd na ontvangst van uw bestelling. Binnen deze periode kunt u producten retourneren, mits deze onbeschadigd en in de originele verpakking zijn. Neem contact op met onze klantenservice om een retourzending te regelen.",
      },
      {
        question: "Hoe kan ik een product retourneren?",
        answer:
          "Om een product te retourneren, neemt u eerst contact op met onze klantenservice. Zij zullen u voorzien van een retourformulier en instructies voor het terugsturen. Na ontvangst en controle van de geretourneerde producten, wordt het aankoopbedrag binnen 14 dagen teruggestort.",
      },
      {
        question: "Wat als ik een beschadigd product ontvang?",
        answer:
          "Mocht u een beschadigd product ontvangen, neem dan binnen 48 uur contact met ons op. Stuur foto's van de beschadiging en wij zorgen voor een passende oplossing, zoals vervanging of terugbetaling.",
      },
      {
        question: "Kan ik een product omruilen voor een ander product?",
        answer:
          "Ja, u kunt producten omruilen voor andere producten. Neem contact op met onze klantenservice om dit te regelen. Bij een prijsverschil wordt dit verrekend.",
      },
      {
        question: "Wat is de garantie op producten?",
        answer:
          "Op al onze producten geldt de wettelijke garantie. Dit betekent dat producten aan de verwachtingen moeten voldoen die u er redelijkerwijs van mag hebben. Bij specifieke producten kan een fabrieksgarantie gelden.",
      },
    ],
  },
  {
    category: "Betaalmethoden",
    icon: faCreditCard,
    questions: [
      {
        question: "Welke betaalmethoden accepteren jullie?",
        answer:
          "Wij accepteren verschillende betaalmethoden, waaronder iDEAL, creditcard (Visa, Mastercard), PayPal, Bancontact en bankoverschrijving. Voor zakelijke klanten is betaling op factuur mogelijk.",
      },
      {
        question: "Is het veilig om online te betalen?",
        answer:
          "Ja, alle betalingen worden verwerkt via beveiligde verbindingen. Wij maken gebruik van betrouwbare betaaldiensten die voldoen aan de hoogste veiligheidsnormen en zijn PCI-DSS gecertificeerd.",
      },
      {
        question: "Wanneer wordt het bedrag afgeschreven?",
        answer:
          "Bij betaling via iDEAL, PayPal of creditcard wordt het bedrag direct afgeschreven. Bij betaling op factuur (alleen voor zakelijke klanten) geldt een betalingstermijn van 14 dagen na factuurdatum.",
      },
      {
        question: "Kan ik in termijnen betalen?",
        answer:
          "Voor particuliere klanten bieden wij momenteel geen mogelijkheid tot betaling in termijnen. Voor zakelijke klanten met een goedgekeurd krediet zijn er wel mogelijkheden. Neem contact op met onze zakelijke afdeling voor meer informatie.",
      },
      {
        question: "Hoe ontvang ik mijn factuur?",
        answer:
          "Na uw bestelling ontvangt u automatisch een factuur per e-mail. Deze is ook terug te vinden in uw account onder 'Mijn bestellingen'. Zakelijke klanten ontvangen daarnaast een officiële factuur per e-mail.",
      },
    ],
  },
  {
    category: "Zakelijke Klanten",
    icon: faBuilding,
    questions: [
      {
        question: "Hoe kan ik een zakelijk account aanvragen?",
        answer:
          "U kunt een zakelijk account aanvragen via onze website onder 'Zakelijk Account'. Vul het registratieformulier in met uw bedrijfsgegevens, inclusief KVK- en BTW-nummer. Na verificatie wordt uw account binnen 1-2 werkdagen geactiveerd.",
      },
      {
        question: "Wat zijn de voordelen van een zakelijk account?",
        answer:
          "Met een zakelijk account profiteert u van groothandelsprijzen, betaling op factuur, flexibele leveringsopties, een persoonlijke accountmanager, maatwerk assortiment en toegang tot een zakelijk dashboard met bestelhistorie en aangepaste prijslijsten.",
      },
      {
        question: "Bieden jullie volumekortingen aan?",
        answer:
          "Ja, voor zakelijke klanten bieden wij volumekortingen aan. De exacte kortingen zijn afhankelijk van het bestelvolume en de frequentie. Uw accountmanager kan u hierover meer informatie geven.",
      },
      {
        question: "Kan ik een prijsopgave krijgen voor een groot evenement?",
        answer:
          "Zeker, voor evenementen of grote bestellingen maken wij graag een op maat gemaakte offerte. Neem contact op met onze zakelijke afdeling via zakelijk@xldranken.nl of bel +31 6 18495949.",
      },
      {
        question: "Bieden jullie ook verhuur van tapinstallaties en glaswerk aan?",
        answer:
          "Ja, voor zakelijke klanten en evenementen bieden wij verhuur van tapinstallaties, koeling en glaswerk aan. Vraag naar de mogelijkheden bij onze zakelijke afdeling.",
      },
    ],
  },
  {
    category: "Producten & Assortiment",
    icon: faWineBottle,
    questions: [
      {
        question: "Hebben jullie ook alcoholvrije alternatieven?",
        answer:
          "Ja, wij hebben een uitgebreid assortiment alcoholvrije dranken, waaronder alcoholvrij bier, wijn, cocktails en speciaalbieren. U vindt deze in de categorie 'Alcoholvrij' op onze website.",
      },
      {
        question: "Kan ik producten bestellen die niet in het assortiment staan?",
        answer:
          "In veel gevallen kunnen wij producten op aanvraag leveren die niet standaard in ons assortiment staan. Neem contact op met onze klantenservice om de mogelijkheden te bespreken.",
      },
      {
        question: "Zijn jullie producten altijd op voorraad?",
        answer:
          "Wij streven ernaar om alle producten op voorraad te hebben. Op onze website ziet u de actuele voorraadstatus. Bij tijdelijke uitverkoop kunt u zich aanmelden voor een e-mail notificatie wanneer het product weer beschikbaar is.",
      },
      {
        question: "Verkopen jullie ook geschenkverpakkingen of cadeaupakketten?",
        answer:
          "Ja, wij bieden diverse geschenkverpakkingen en cadeaupakketten aan. Deze zijn te vinden onder de categorie 'Cadeaus & Pakketten'. Voor zakelijke relaties kunnen wij ook op maat gemaakte pakketten samenstellen.",
      },
      {
        question: "Hoe weet ik of een wijn droog, halfdroog of zoet is?",
        answer:
          "In de productbeschrijving van onze wijnen vermelden wij altijd de smaakkenmerken, waaronder of de wijn droog, halfdroog of zoet is. U kunt ook filteren op deze eigenschappen in onze wijncategorie.",
      },
    ],
  },
]
