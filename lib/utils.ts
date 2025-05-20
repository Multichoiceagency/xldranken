import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {ClipboardList, LogOut, MapPin, Package, Tag, User} from "lucide-react";
import {className} from "postcss-selector-parser";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export const menuItemsList = [
  {
    name: "ALCOHOL",
    href: "/categorie/sterke-drank",
    id: "16",
    submenu: [
      {
        name: "STERKE DRANK",
        href: "/categorie/sterke-drank",
        id: "16",
      },
      {
        name: "MIX DRANK",
        href: "/categorie/mix-drank",
        id: "5",
      },
      {
        name: "COCKTAILS",
        href: "/categorie/cocktails",
        id: "10",
      },
    ],
  },
  {
    name: "WIJN",
    href: "/categorie/wijn",
    id: "13",
    submenu: [],
  },
  {
    name: "BIER",
    href: "/categorie/poolse-bier-blik",
    id: "1",
    submenu: [
      {
        name: "POOLSE BIER BLIK",
        href: "/categorie/poolse-bier-blik",
        id: "4",
      },
      {
        name: "POOLSE BIER FLES",
        href: "/categorie/poolse-bier-fles",
        id: "3",
      },
      {
        name: "NL BIER",
        href: "/categorie/bier",
        id: "4",
      },
    ],
  },
  {
    name: "FRISDRANKEN",
    href: "/categorie/frisdranken",
    id: "6",
    submenu: [
      {
        name: "FRISDRANKEN",
        href: "/categorie/frisdranken",
        id: "6",
      },
      {
        name: "KRATTEN",
        href: "/categorie/krat",
        id: "23",
      },
      {
        name: "LIMONADEN",
        href: "/categorie/limonaden",
        id: "1",
      },
      {
        name: "WATER",
        href: "/categorie/water-nl",
        id: "7",
      },
      {
        name: "PETFLESSEN",
        href: "/categorie/poolse",
        id: "2",
      },
    ],
  },
  {
    name: "FOOD",
    href: "/categorie/food",
    id: "20",
    submenu: [
      {
        name: "FOOD",
        href: "/categorie/food",
        id: "20",
      },
    ],
  },
  {
    name: "NON-FOOD",
    href: "/categorie/non-food",
    id: "21",
    submenu: [
      {
        name: "NON-FOOD",
        href: "/categorie/non-food",
        id: "21",
      },
      {
        name: "KOFFIE THEE",
        href: "/categorie/koffie-thee",
        id: "18",
      },
      {
        name: "HOUTSKOOL",
        href: "/categorie/houtskool",
        id: "19",
      },
      {
        name: "SCHOONMAAK",
        href: "/categorie/schoonmaak",
        id: "22",
      },
    ],
  },
]

interface MenuItem {
  icon: any
  title: string
  href: string
}


// export const accountPageMenuItems: MenuItem[] = [
//   { icon: <ClipboardList className="w-8 h-8 text-gray-400" />, title: "Bestellingen", href: "/account/bestellingen" },
//   { icon: <Tag className="w-8 h-8 text-gray-400" />, title: "Aanbiedingen", href: "/account/aanbiedingen" },
//   { icon: <Package className="w-8 h-8 text-gray-400" />, title: "Bulkbestelling", href: "/account/bulkbestelling" },
//   { icon: <MapPin className="w-8 h-8 text-gray-400" />, title: "Adressen", href: "/account/adressen" },
//   { icon: <User className="w-8 h-8 text-gray-400" />, title: "Accountgegevens", href: "/account/gegevens" },
//   { icon: <LogOut className="w-8 h-8 text-gray-400" />, title: "Logout", href: "/logout" }
// ]

export const accountPageMenuItems: MenuItem[] = [
  { icon: ClipboardList, title: "Bestellingen", href: "/account/bestellingen" },
  { icon: Tag, title: "Aanbiedingen", href: "/account/aanbiedingen" },
  { icon: Package, title: "Bulkbestelling", href: "/account/bulkbestelling" },
  { icon: MapPin, title: "Adressen", href: "/account/adressen" },
  { icon: User, title: "Accountgegevens", href: "/account/gegevens" },
  { icon: LogOut, title: "Logout", href: "/logout" }
]