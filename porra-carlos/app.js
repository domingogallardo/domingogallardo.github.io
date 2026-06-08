"use strict";

const STORAGE_KEY = "porraCarlosMundial2026State";

const groups = {
  A: ["México", "Sudáfrica", "República de Corea", "República Checa"],
  B: ["Canadá", "Bosnia y Herzegovina", "Catar", "Suiza"],
  C: ["Brasil", "Marruecos", "Haití", "Escocia"],
  D: ["Estados Unidos", "Paraguay", "Australia", "Turquía"],
  E: ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"],
  F: ["Países Bajos", "Japón", "Suecia", "Túnez"],
  G: ["Bélgica", "Egipto", "RI de Irán", "Nueva Zelanda"],
  H: ["España", "Cabo Verde", "Arabia Saudí", "Uruguay"],
  I: ["Francia", "Senegal", "Irak", "Noruega"],
  J: ["Argentina", "Argelia", "Austria", "Jordania"],
  K: ["Portugal", "RD de Congo", "Uzbekistán", "Colombia"],
  L: ["Inglaterra", "Croacia", "Ghana", "Panamá"]
};

const groupLetters = Object.keys(groups);

const carlosGroupPredictions = {
  A: ["México", "Sudáfrica", "República Checa", "República de Corea"],
  B: ["Canadá", "Catar", "Suiza", "Bosnia y Herzegovina"],
  C: ["Brasil", "Marruecos", "Escocia", "Haití"],
  D: ["Australia", "Turquía", "Estados Unidos", "Paraguay"],
  E: ["Alemania", "Costa de Marfil", "Ecuador", "Curazao"],
  F: ["Suecia", "Países Bajos", "Japón", "Túnez"],
  G: ["Bélgica", "RI de Irán", "Egipto", "Nueva Zelanda"],
  H: ["España", "Uruguay", "Cabo Verde", "Arabia Saudí"],
  I: ["Francia", "Noruega", "Irak", "Senegal"],
  J: ["Argentina", "Argelia", "Austria", "Jordania"],
  K: ["Portugal", "Colombia", "RD de Congo", "Uzbekistán"],
  L: ["Inglaterra", "Croacia", "Ghana", "Panamá"]
};

const carlosBestThirds = ["A", "B", "C", "F", "G", "H", "I", "J"];

const steps = [
  { key: "groups", title: "Fase de grupos" },
  { key: "thirds", title: "Mejores terceros" },
  { key: "round32", title: "Dieciseisavos" },
  { key: "round16", title: "Octavos" },
  { key: "quarterfinals", title: "Cuartos" },
  { key: "semifinals", title: "Semifinales" },
  { key: "thirdPlace", title: "Tercer puesto" },
  { key: "final", title: "Final" },
  { key: "summary", title: "Resumen final" }
];

const roundNames = {
  round32: "Dieciseisavos",
  round16: "Octavos",
  quarterfinals: "Cuartos",
  semifinals: "Semifinales",
  thirdPlace: "Tercer puesto",
  final: "Final"
};

const thirdMatchIds = [74, 77, 79, 80, 81, 82, 85, 87];

// FIFA Annex C mapping for the eight best third-placed teams.
// Each value is ordered by thirdMatchIds: 74, 77, 79, 80, 81, 82, 85, 87.
const thirdPlaceAssignmentRows = [
  "EFGHIJKL:FGEKIHJL;DFGHIJKL:DFHKIJGL;DEGHIJKL:DGEKIHJL;DEFHIJKL:DFEKIHJL;DEFGIJKL:DFEKIJGL;DEFGHJKL:DFEKJHGL;DEFGHIKL:DFEKIHGL;DEFGHIJL:DFEIJHGL",
  "DEFGHIJK:DFEKJHGI;CFGHIJKL:CFHKIJGL;CEGHIJKL:CGEKIHJL;CEFHIJKL:CFEKIHJL;CEFGIJKL:CFEKIJGL;CEFGHJKL:CFEKJHGL;CEFGHIKL:CFEKIHGL;CEFGHIJL:CFEIJHGL",
  "CEFGHIJK:CFEKJHGI;CDGHIJKL:CDHKIJGL;CDFHIJKL:DFCKIHJL;CDFGIJKL:DFCKIJGL;CDFGHJKL:DFCKJHGL;CDFGHIKL:DFCKIHGL;CDFGHIJL:DFCIJHGL;CDFGHIJK:DFCKJHGI",
  "CDEHIJKL:CDEKIHJL;CDEGIJKL:CDEKIJGL;CDEGHJKL:CDEKJHGL;CDEGHIKL:CDEKIHGL;CDEGHIJL:CDEIJHGL;CDEGHIJK:CDEKJHGI;CDEFIJKL:DFCKEIJL;CDEFHJKL:DFCKEHJL",
  "CDEFHIKL:DFCKIHEL;CDEFHIJL:DFCIEHJL;CDEFHIJK:DFCKEHJI;CDEFGJKL:DFCKEJGL;CDEFGIKL:DFCKEIGL;CDEFGIJL:DFCIEJGL;CDEFGIJK:DFCKEJGI;CDEFGHKL:DFCKEHGL",
  "CDEFGHJL:DFCEJHGL;CDEFGHJK:DFCKJHGE;CDEFGHIL:DFCIEHGL;CDEFGHIK:DFCKEHGI;CDEFGHIJ:DFCIJHGE;BFGHIJKL:FGHKBIJL;BEGHIJKL:BGEKIHJL;BEFHIJKL:FHEKBIJL",
  "BEFGIJKL:FGEKBIJL;BEFGHJKL:FGEKBHJL;BEFGHIKL:FHEKBIGL;BEFGHIJL:FGEIBHJL;BEFGHIJK:FGEKBHJI;BDGHIJKL:DGHKBIJL;BDFHIJKL:DFHKBIJL;BDFGIJKL:DFIKBJGL",
  "BDFGHJKL:DFHKBJGL;BDFGHIKL:DFHKBIGL;BDFGHIJL:DFHIBJGL;BDFGHIJK:DFHKBJGI;BDEHIJKL:DHEKBIJL;BDEGIJKL:DGEKBIJL;BDEGHJKL:DGEKBHJL;BDEGHIKL:DHEKBIGL",
  "BDEGHIJL:DGEIBHJL;BDEGHIJK:DGEKBHJI;BDEFIJKL:DFEKBIJL;BDEFHJKL:DFEKBHJL;BDEFHIKL:DFEKBHIL;BDEFHIJL:DFEIBHJL;BDEFHIJK:DFEKBHJI;BDEFGJKL:DFEKBJGL",
  "BDEFGIKL:DFEKBIGL;BDEFGIJL:DFEIBJGL;BDEFGIJK:DFEKBJGI;BDEFGHKL:DFEKBHGL;BDEFGHJL:DFHEBJGL;BDEFGHJK:DFHKBJGE;BDEFGHIL:DFEIBHGL;BDEFGHIK:DFEKBHGI",
  "BDEFGHIJ:DFHIBJGE;BCGHIJKL:CGHKBIJL;BCFHIJKL:CFHKBIJL;BCFGIJKL:CFIKBJGL;BCFGHJKL:CFHKBJGL;BCFGHIKL:CFHKBIGL;BCFGHIJL:CFHIBJGL;BCFGHIJK:CFHKBJGI",
  "BCEHIJKL:CHEKBIJL;BCEGIJKL:CGEKBIJL;BCEGHJKL:CGEKBHJL;BCEGHIKL:CHEKBIGL;BCEGHIJL:CGEIBHJL;BCEGHIJK:CGEKBHJI;BCEFIJKL:CFEKBIJL;BCEFHJKL:CFEKBHJL",
  "BCEFHIKL:CFEKBHIL;BCEFHIJL:CFEIBHJL;BCEFHIJK:CFEKBHJI;BCEFGJKL:CFEKBJGL;BCEFGIKL:CFEKBIGL;BCEFGIJL:CFEIBJGL;BCEFGIJK:CFEKBJGI;BCEFGHKL:CFEKBHGL",
  "BCEFGHJL:CFHEBJGL;BCEFGHJK:CFHKBJGE;BCEFGHIL:CFEIBHGL;BCEFGHIK:CFEKBHGI;BCEFGHIJ:CFHIBJGE;BCDHIJKL:CDHKBIJL;BCDGIJKL:CDIKBJGL;BCDGHJKL:CDHKBJGL",
  "BCDGHIKL:CDHKBIGL;BCDGHIJL:CDHIBJGL;BCDGHIJK:CDHKBJGI;BCDFIJKL:DFCKBIJL;BCDFHJKL:DFCKBHJL;BCDFHIKL:DFCKBHIL;BCDFHIJL:DFCIBHJL;BCDFHIJK:DFCKBHJI",
  "BCDFGJKL:DFCKBJGL;BCDFGIKL:DFCKBIGL;BCDFGIJL:DFCIBJGL;BCDFGIJK:DFCKBJGI;BCDFGHKL:DFCKBHGL;BCDFGHJL:DFCJBHGL;BCDFGHJK:CFHKBJGD;BCDFGHIL:DFCIBHGL",
  "BCDFGHIK:DFCKBHGI;BCDFGHIJ:CFHIBJGD;BCDEIJKL:CDEKBIJL;BCDEHJKL:CDEKBHJL;BCDEHIKL:CDEKBHIL;BCDEHIJL:CDEIBHJL;BCDEHIJK:CDEKBHJI;BCDEGJKL:CDEKBJGL",
  "BCDEGIKL:CDEKBIGL;BCDEGIJL:CDEIBJGL;BCDEGIJK:CDEKBJGI;BCDEGHKL:CDEKBHGL;BCDEGHJL:CDHEBJGL;BCDEGHJK:CDHKBJGE;BCDEGHIL:CDEIBHGL;BCDEGHIK:CDEKBHGI",
  "BCDEGHIJ:CDHIBJGE;BCDEFJKL:DFCKBEJL;BCDEFIKL:DFCKBIEL;BCDEFIJL:DFCIBEJL;BCDEFIJK:DFCKBEJI;BCDEFHKL:DFCKBHEL;BCDEFHJL:DFCEBHJL;BCDEFHJK:DFCKBHJE",
  "BCDEFHIL:DFCIBHEL;BCDEFHIK:DFCKBHEI;BCDEFHIJ:DFCIBHJE;BCDEFGKL:DFCKBEGL;BCDEFGJL:DFCEBJGL;BCDEFGJK:DFCKBJGE;BCDEFGIL:DFCIBEGL;BCDEFGIK:DFCKBEGI",
  "BCDEFGIJ:DFCIBJGE;BCDEFGHL:DFCEBHGL;BCDEFGHK:DFCKBHGE;BCDEFGHJ:CFHEBJGD;BCDEFGHI:DFCIBHGE;AFGHIJKL:FGHKIAJL;AEGHIJKL:AGEKIHJL;AEFHIJKL:FHEKIAJL",
  "AEFGIJKL:FGEKIAJL;AEFGHJKL:FHEKJAGL;AEFGHIKL:FHEKIAGL;AEFGHIJL:FHEIJAGL;AEFGHIJK:FHEKJAGI;ADGHIJKL:DGHKIAJL;ADFHIJKL:DFHKIAJL;ADFGIJKL:DFIKJAGL",
  "ADFGHJKL:DFHKJAGL;ADFGHIKL:DFHKIAGL;ADFGHIJL:DFHIJAGL;ADFGHIJK:DFHKJAGI;ADEHIJKL:DHEKIAJL;ADEGIJKL:DGEKIAJL;ADEGHJKL:DHEKJAGL;ADEGHIKL:DHEKIAGL",
  "ADEGHIJL:DHEIJAGL;ADEGHIJK:DHEKJAGI;ADEFIJKL:DFEKIAJL;ADEFHJKL:DFHKEAJL;ADEFHIKL:DFHKIAEL;ADEFHIJL:DFHIEAJL;ADEFHIJK:DFHKEAJI;ADEFGJKL:DFEKJAGL",
  "ADEFGIKL:DFEKIAGL;ADEFGIJL:DFEIJAGL;ADEFGIJK:DFEKJAGI;ADEFGHKL:DFHKEAGL;ADEFGHJL:DFHEJAGL;ADEFGHJK:DFHKJAGE;ADEFGHIL:DFHIEAGL;ADEFGHIK:DFHKEAGI",
  "ADEFGHIJ:DFHIJAGE;ACGHIJKL:CGHKIAJL;ACFHIJKL:CFHKIAJL;ACFGIJKL:CFIKJAGL;ACFGHJKL:CFHKJAGL;ACFGHIKL:CFHKIAGL;ACFGHIJL:CFHIJAGL;ACFGHIJK:CFHKJAGI",
  "ACEHIJKL:CHEKIAJL;ACEGIJKL:CGEKIAJL;ACEGHJKL:CHEKJAGL;ACEGHIKL:CHEKIAGL;ACEGHIJL:CHEIJAGL;ACEGHIJK:CHEKJAGI;ACEFIJKL:CFEKIAJL;ACEFHJKL:CFHKEAJL",
  "ACEFHIKL:CFHKIAEL;ACEFHIJL:CFHIEAJL;ACEFHIJK:CFHKEAJI;ACEFGJKL:CFEKJAGL;ACEFGIKL:CFEKIAGL;ACEFGIJL:CFEIJAGL;ACEFGIJK:CFEKJAGI;ACEFGHKL:CFHKEAGL",
  "ACEFGHJL:CFHEJAGL;ACEFGHJK:CFHKJAGE;ACEFGHIL:CFHIEAGL;ACEFGHIK:CFHKEAGI;ACEFGHIJ:CFHIJAGE;ACDHIJKL:CDHKIAJL;ACDGIJKL:CDIKJAGL;ACDGHJKL:CDHKJAGL",
  "ACDGHIKL:CDHKIAGL;ACDGHIJL:CDHIJAGL;ACDGHIJK:CDHKJAGI;ACDFIJKL:DFCKIAJL;ACDFHJKL:CDHKFAJL;ACDFHIKL:CDHKIAFL;ACDFHIJL:CDHIFAJL;ACDFHIJK:CDHKFAJI",
  "ACDFGJKL:DFCKJAGL;ACDFGIKL:DFCKIAGL;ACDFGIJL:DFCIJAGL;ACDFGIJK:DFCKJAGI;ACDFGHKL:CDHKFAGL;ACDFGHJL:DFCHJAGL;ACDFGHJK:CFHKJAGD;ACDFGHIL:CDHIFAGL",
  "ACDFGHIK:CDHKFAGI;ACDFGHIJ:CFHIJAGD;ACDEIJKL:CDEKIAJL;ACDEHJKL:CDHKEAJL;ACDEHIKL:CDHKIAEL;ACDEHIJL:CDHIEAJL;ACDEHIJK:CDHKEAJI;ACDEGJKL:CDEKJAGL",
  "ACDEGIKL:CDEKIAGL;ACDEGIJL:CDEIJAGL;ACDEGIJK:CDEKJAGI;ACDEGHKL:CDHKEAGL;ACDEGHJL:CDHEJAGL;ACDEGHJK:CDHKJAGE;ACDEGHIL:CDHIEAGL;ACDEGHIK:CDHKEAGI",
  "ACDEGHIJ:CDHIJAGE;ACDEFJKL:DFCKEAJL;ACDEFIKL:DFCKIAEL;ACDEFIJL:DFCIEAJL;ACDEFIJK:DFCKEAJI;ACDEFHKL:CDHKFAEL;ACDEFHJL:CDHEFAJL;ACDEFHJK:CFHKEAJD",
  "ACDEFHIL:CDHIFAEL;ACDEFHIK:CDHKFAEI;ACDEFHIJ:CFHIEAJD;ACDEFGKL:DFCKEAGL;ACDEFGJL:DFCEJAGL;ACDEFGJK:DFCKJAGE;ACDEFGIL:DFCIEAGL;ACDEFGIK:DFCKEAGI",
  "ACDEFGIJ:DFCIJAGE;ACDEFGHL:CDHEFAGL;ACDEFGHK:CFHKEAGD;ACDEFGHJ:CFHEJAGD;ACDEFGHI:CFHIEAGD;ABGHIJKL:AGHKBIJL;ABFHIJKL:AFHKBIJL;ABFGIJKL:FGIKBAJL",
  "ABFGHJKL:FGHKBAJL;ABFGHIKL:AFHKBIGL;ABFGHIJL:FGHIBAJL;ABFGHIJK:FGHKBAJI;ABEHIJKL:AHEKBIJL;ABEGIJKL:AGEKBIJL;ABEGHJKL:AGEKBHJL;ABEGHIKL:AHEKBIGL",
  "ABEGHIJL:AGEIBHJL;ABEGHIJK:AGEKBHJI;ABEFIJKL:AFEKBIJL;ABEFHJKL:FHEKBAJL;ABEFHIKL:FHEKBAIL;ABEFHIJL:FHEIBAJL;ABEFHIJK:FHEKBAJI;ABEFGJKL:FGEKBAJL",
  "ABEFGIKL:AFEKBIGL;ABEFGIJL:FGEIBAJL;ABEFGIJK:FGEKBAJI;ABEFGHKL:FHEKBAGL;ABEFGHJL:FGHEBAJL;ABEFGHJK:FGHKBAJE;ABEFGHIL:FHEIBAGL;ABEFGHIK:FHEKBAGI",
  "ABEFGHIJ:FGHIBAJE;ABDHIJKL:DHIKBAJL;ABDGIJKL:DGIKBAJL;ABDGHJKL:DGHKBAJL;ABDGHIKL:DHIKBAGL;ABDGHIJL:DGHIBAJL;ABDGHIJK:DGHKBAJI;ABDFIJKL:DFIKBAJL",
  "ABDFHJKL:DFHKBAJL;ABDFHIKL:DFHKBAIL;ABDFHIJL:DFHIBAJL;ABDFHIJK:DFHKBAJI;ABDFGJKL:DGFKBAJL;ABDFGIKL:DFIKBAGL;ABDFGIJL:DGFIBAJL;ABDFGIJK:DGFKBAJI",
  "ABDFGHKL:DFHKBAGL;ABDFGHJL:DFHJBAGL;ABDFGHJK:DFHKBAGJ;ABDFGHIL:DFHIBAGL;ABDFGHIK:DFHKBAGI;ABDFGHIJ:DFHJBAGI;ABDEIJKL:ADEKBIJL;ABDEHJKL:DHEKBAJL",
  "ABDEHIKL:DHEKBAIL;ABDEHIJL:DHEIBAJL;ABDEHIJK:DHEKBAJI;ABDEGJKL:DGEKBAJL;ABDEGIKL:ADEKBIGL;ABDEGIJL:DGEIBAJL;ABDEGIJK:DGEKBAJI;ABDEGHKL:DHEKBAGL",
  "ABDEGHJL:DGHEBAJL;ABDEGHJK:DGHKBAJE;ABDEGHIL:DHEIBAGL;ABDEGHIK:DHEKBAGI;ABDEGHIJ:DGHIBAJE;ABDEFJKL:DFEKBAJL;ABDEFIKL:DFEKBAIL;ABDEFIJL:DFEIBAJL",
  "ABDEFIJK:DFEKBAJI;ABDEFHKL:DFHKBAEL;ABDEFHJL:DFHEBAJL;ABDEFHJK:DFHKBAJE;ABDEFHIL:DFHIBAEL;ABDEFHIK:DFHKBAEI;ABDEFHIJ:DFHIBAJE;ABDEFGKL:DFEKBAGL",
  "ABDEFGJL:DFEJBAGL;ABDEFGJK:DFEKBAGJ;ABDEFGIL:DFEIBAGL;ABDEFGIK:DFEKBAGI;ABDEFGIJ:DFEJBAGI;ABDEFGHL:DFHEBAGL;ABDEFGHK:DFHKBAGE;ABDEFGHJ:DFHJBAGE",
  "ABDEFGHI:DFHIBAGE;ABCHIJKL:CHIKBAJL;ABCGIJKL:CGIKBAJL;ABCGHJKL:CGHKBAJL;ABCGHIKL:CHIKBAGL;ABCGHIJL:CGHIBAJL;ABCGHIJK:CGHKBAJI;ABCFIJKL:CFIKBAJL",
  "ABCFHJKL:CFHKBAJL;ABCFHIKL:CFHKBAIL;ABCFHIJL:CFHIBAJL;ABCFHIJK:CFHKBAJI;ABCFGJKL:FGCKBAJL;ABCFGIKL:CFIKBAGL;ABCFGIJL:FGCIBAJL;ABCFGIJK:FGCKBAJI",
  "ABCFGHKL:CFHKBAGL;ABCFGHJL:CFHJBAGL;ABCFGHJK:CFHKBAGJ;ABCFGHIL:CFHIBAGL;ABCFGHIK:CFHKBAGI;ABCFGHIJ:CFHJBAGI;ABCEIJKL:ACEKBIJL;ABCEHJKL:CHEKBAJL",
  "ABCEHIKL:CHEKBAIL;ABCEHIJL:CHEIBAJL;ABCEHIJK:CHEKBAJI;ABCEGJKL:CGEKBAJL;ABCEGIKL:ACEKBIGL;ABCEGIJL:CGEIBAJL;ABCEGIJK:CGEKBAJI;ABCEGHKL:CHEKBAGL",
  "ABCEGHJL:CGHEBAJL;ABCEGHJK:CGHKBAJE;ABCEGHIL:CHEIBAGL;ABCEGHIK:CHEKBAGI;ABCEGHIJ:CGHIBAJE;ABCEFJKL:CFEKBAJL;ABCEFIKL:CFEKBAIL;ABCEFIJL:CFEIBAJL",
  "ABCEFIJK:CFEKBAJI;ABCEFHKL:CFHKBAEL;ABCEFHJL:CFHEBAJL;ABCEFHJK:CFHKBAJE;ABCEFHIL:CFHIBAEL;ABCEFHIK:CFHKBAEI;ABCEFHIJ:CFHIBAJE;ABCEFGKL:CFEKBAGL",
  "ABCEFGJL:CFEJBAGL;ABCEFGJK:CFEKBAGJ;ABCEFGIL:CFEIBAGL;ABCEFGIK:CFEKBAGI;ABCEFGIJ:CFEJBAGI;ABCEFGHL:CFHEBAGL;ABCEFGHK:CFHKBAGE;ABCEFGHJ:CFHJBAGE",
  "ABCEFGHI:CFHIBAGE;ABCDIJKL:CDIKBAJL;ABCDHJKL:CDHKBAJL;ABCDHIKL:CDHKBAIL;ABCDHIJL:CDHIBAJL;ABCDHIJK:CDHKBAJI;ABCDGJKL:DGCKBAJL;ABCDGIKL:CDIKBAGL",
  "ABCDGIJL:DGCIBAJL;ABCDGIJK:DGCKBAJI;ABCDGHKL:CDHKBAGL;ABCDGHJL:CDHJBAGL;ABCDGHJK:CDHKBAGJ;ABCDGHIL:CDHIBAGL;ABCDGHIK:CDHKBAGI;ABCDGHIJ:CDHJBAGI",
  "ABCDFJKL:DFCKBAJL;ABCDFIKL:DFCKBAIL;ABCDFIJL:DFCIBAJL;ABCDFIJK:DFCKBAJI;ABCDFHKL:CDHKBAFL;ABCDFHJL:DFCHBAJL;ABCDFHJK:CFHKBAJD;ABCDFHIL:CDHIBAFL",
  "ABCDFHIK:CDHKBAFI;ABCDFHIJ:CFHIBAJD;ABCDFGKL:DFCKBAGL;ABCDFGJL:DFCJBAGL;ABCDFGJK:DFCKBAGJ;ABCDFGIL:DFCIBAGL;ABCDFGIK:DFCKBAGI;ABCDFGIJ:DFCJBAGI",
  "ABCDFGHL:DFCHBAGL;ABCDFGHK:CFHKBAGD;ABCDFGHJ:CFHJBAGD;ABCDFGHI:CFHIBAGD;ABCDEJKL:CDEKBAJL;ABCDEIKL:CDEKBAIL;ABCDEIJL:CDEIBAJL;ABCDEIJK:CDEKBAJI",
  "ABCDEHKL:CDHKBAEL;ABCDEHJL:CDHEBAJL;ABCDEHJK:CDHKBAJE;ABCDEHIL:CDHIBAEL;ABCDEHIK:CDHKBAEI;ABCDEHIJ:CDHIBAJE;ABCDEGKL:CDEKBAGL;ABCDEGJL:CDEJBAGL",
  "ABCDEGJK:CDEKBAGJ;ABCDEGIL:CDEIBAGL;ABCDEGIK:CDEKBAGI;ABCDEGIJ:CDEJBAGI;ABCDEGHL:CDHEBAGL;ABCDEGHK:CDHKBAGE;ABCDEGHJ:CDHJBAGE;ABCDEGHI:CDHIBAGE",
  "ABCDEFKL:DFCKBAEL;ABCDEFJL:DFCEBAJL;ABCDEFJK:DFCKBAJE;ABCDEFIL:DFCIBAEL;ABCDEFIK:DFCKBAEI;ABCDEFIJ:DFCIBAJE;ABCDEFHL:CDHEBAFL;ABCDEFHK:CFHKBAED",
  "ABCDEFHJ:CFHEBAJD;ABCDEFHI:CFHIBAED;ABCDEFGL:DFCEBAGL;ABCDEFGK:DFCKBAGE;ABCDEFGJ:DFCJBAGE;ABCDEFGI:DFCIBAGE;ABCDEFGH:CFHEBAGD"
];

const thirdPlaceAssignments = thirdPlaceAssignmentRows.reduce((map, row) => {
  row.split(";").forEach((entry) => {
    const [key, assignments] = entry.split(":");
    map[key] = assignments;
  });
  return map;
}, {});

const round32Schema = [
  { id: 74, a: "1E", b: "3*" },
  { id: 77, a: "1I", b: "3*" },
  { id: 73, a: "2A", b: "2B" },
  { id: 75, a: "1F", b: "2C" },
  { id: 83, a: "2K", b: "2L" },
  { id: 84, a: "1H", b: "2J" },
  { id: 81, a: "1D", b: "3*" },
  { id: 82, a: "1G", b: "3*" },
  { id: 76, a: "1C", b: "2F" },
  { id: 78, a: "2E", b: "2I" },
  { id: 79, a: "1A", b: "3*" },
  { id: 80, a: "1L", b: "3*" },
  { id: 86, a: "1J", b: "2H" },
  { id: 88, a: "2D", b: "2G" },
  { id: 85, a: "1B", b: "3*" },
  { id: 87, a: "1K", b: "3*" }
];

const nextRoundSchemas = {
  round16: [
    { id: 89, from: [74, 77] },
    { id: 90, from: [73, 75] },
    { id: 93, from: [83, 84] },
    { id: 94, from: [81, 82] },
    { id: 91, from: [76, 78] },
    { id: 92, from: [79, 80] },
    { id: 95, from: [86, 88] },
    { id: 96, from: [85, 87] }
  ],
  quarterfinals: [
    { id: 97, from: [89, 90] },
    { id: 98, from: [93, 94] },
    { id: 99, from: [91, 92] },
    { id: 100, from: [95, 96] }
  ],
  semifinals: [
    { id: 101, from: [97, 98] },
    { id: 102, from: [99, 100] }
  ],
  final: [{ id: 104, from: [101, 102] }],
  thirdPlace: [{ id: 103, loserFrom: [101, 102] }]
};

let state = createInitialState();

function createInitialState() {
  const groupPredictions = {};
  groupLetters.forEach((letter) => {
    groupPredictions[letter] = [...carlosGroupPredictions[letter]];
  });

  return {
    currentStep: 0,
    groupPredictions,
    bestThirds: [...carlosBestThirds],
    matches: {},
    winners: {},
    assignmentNote: ""
  };
}

function renderCurrentStep() {
  clearMessage();
  buildAvailableMatches();
  renderProgress();

  const step = steps[state.currentStep];
  const app = document.getElementById("app");

  if (step.key === "groups") renderGroupStep(app);
  if (step.key === "thirds") renderBestThirdsStep(app);
  if (["round32", "round16", "quarterfinals", "semifinals", "thirdPlace", "final"].includes(step.key)) {
    renderKnockoutStep(app, step.key);
  }
  if (step.key === "summary") renderSummaryStep(app);

  updateNavButtons();
  saveState();
}

function renderProgress() {
  const current = state.currentStep + 1;
  const total = steps.length;
  document.getElementById("stepLabel").innerHTML = `<span>${steps[state.currentStep].title}</span><span>${current} de ${total}</span>`;
  document.getElementById("progressBar").style.width = `${(current / total) * 100}%`;
}

function renderGroupStep(container) {
  container.innerHTML = `
    <div class="phase-head">
      <div>
        <h2>Ordena cada grupo</h2>
        <p class="intro-text">Elige del 1.º al 4.º. No se puede repetir equipo dentro de un grupo.</p>
      </div>
    </div>
    <div class="group-grid">
      ${groupLetters.map(renderGroupCard).join("")}
    </div>
  `;
}

function renderGroupCard(letter) {
  const prediction = state.groupPredictions[letter];
  const isComplete = isGroupValid(letter);

  return `
    <article class="card">
      <div class="group-title">
        <h3>Grupo ${letter}</h3>
        <span class="complete-badge ${isComplete ? "ok" : ""}">${isComplete ? "Completo" : "Revisar"}</span>
      </div>
      ${[0, 1, 2, 3].map((index) => renderRankRow(letter, index, prediction[index])).join("")}
    </article>
  `;
}

function renderRankRow(letter, index, selectedTeam) {
  const options = groups[letter]
    .map((team) => `<option value="${escapeHtml(team)}" ${team === selectedTeam ? "selected" : ""}>${escapeHtml(team)}</option>`)
    .join("");

  return `
    <label class="rank-row">
      <span class="rank-number">${index + 1}.º</span>
      <select data-group="${letter}" data-index="${index}">
        ${options}
      </select>
      <span class="mini-actions" aria-label="Mover equipo">
        <button class="icon-button" type="button" data-move="${letter}:${index}:-1" ${index === 0 ? "disabled" : ""} title="Subir">↑</button>
        <button class="icon-button" type="button" data-move="${letter}:${index}:1" ${index === 3 ? "disabled" : ""} title="Bajar">↓</button>
      </span>
    </label>
  `;
}

function renderBestThirdsStep(container) {
  const thirds = getThirds();
  const selectedCount = state.bestThirds.length;
  const eliminated = thirds.filter((third) => !state.bestThirds.includes(third.group));

  container.innerHTML = `
    <div class="phase-head">
      <div>
        <h2>Elige los 8 mejores terceros</h2>
        <p class="intro-text">Selecciona exactamente 8 de los 12 terceros.</p>
      </div>
      <span class="counter">${selectedCount}/8</span>
    </div>
    <div class="thirds-grid">
      ${thirds.map(renderThirdOption).join("")}
    </div>
    ${eliminated.length === 4 ? `<p class="hint">Eliminados ahora mismo: ${eliminated.map(formatThird).join(", ")}.</p>` : ""}
  `;
}

function renderThirdOption(third) {
  const checked = state.bestThirds.includes(third.group);
  return `
    <label class="third-option ${checked ? "selected" : ""}">
      <input type="checkbox" value="${third.group}" ${checked ? "checked" : ""}>
      <span><strong>3.º Grupo ${third.group}</strong><br>${escapeHtml(third.team)}</span>
    </label>
  `;
}

function buildRoundOf32() {
  const assignment = assignBestThirds(state.bestThirds);
  state.assignmentNote = assignment.note;

  const thirdByMatch = assignment.slots.reduce((map, slot) => {
    map[slot.matchId] = slot.group;
    return map;
  }, {});

  state.matches.round32 = round32Schema.map((match) => {
    const thirdGroup = thirdByMatch[match.id] || null;
    return {
      id: match.id,
      round: "round32",
      teamA: resolveSeed(match.a),
      teamB: match.b === "3*" ? resolveSeed(`3${thirdGroup}`) : resolveSeed(match.b),
      seedA: match.a,
      seedB: match.b === "3*" ? `3${thirdGroup}` : match.b
    };
  });

  pruneWinnersForExistingMatches();
}

function assignBestThirds(selectedGroups) {
  const key = [...selectedGroups].sort().join("");
  const assignments = thirdPlaceAssignments[key] || "";
  const slots = thirdMatchIds.map((matchId, index) => ({
    matchId,
    group: assignments[index],
    compatible: Boolean(assignments[index])
  }));

  return {
    slots,
    note: assignments ? "" : "No se ha encontrado una asignación oficial para esta combinación de terceros."
  };
}

function buildNextRounds() {
  state.matches.round16 = buildRoundFromWinners("round16");
  state.matches.quarterfinals = buildRoundFromWinners("quarterfinals");
  state.matches.semifinals = buildRoundFromWinners("semifinals");
  state.matches.final = buildRoundFromWinners("final");
  state.matches.thirdPlace = buildThirdPlaceMatch();
  pruneWinnersForExistingMatches();
}

function buildRoundFromWinners(roundKey) {
  return nextRoundSchemas[roundKey].map((schema) => ({
    id: schema.id,
    round: roundKey,
    teamA: state.winners[schema.from[0]] || "",
    teamB: state.winners[schema.from[1]] || "",
    from: schema.from
  }));
}

function buildThirdPlaceMatch() {
  return nextRoundSchemas.thirdPlace.map((schema) => ({
    id: schema.id,
    round: "thirdPlace",
    teamA: getLoser(schema.loserFrom[0]),
    teamB: getLoser(schema.loserFrom[1]),
    loserFrom: schema.loserFrom
  }));
}

function buildAvailableMatches() {
  if (validateAllGroups().ok && state.bestThirds.length === 8) {
    buildRoundOf32();
    buildNextRounds();
  }
}

function renderKnockoutStep(container, roundKey) {
  const matches = state.matches[roundKey] || [];
  const note = roundKey === "round32" && state.assignmentNote
    ? `<p class="assignment-note">${escapeHtml(state.assignmentNote)}</p>`
    : "";

  container.innerHTML = `
    <div class="phase-head">
      <div>
        <h2>${roundNames[roundKey]}</h2>
        <p class="intro-text">Toca el equipo que gana cada partido.</p>
      </div>
    </div>
    ${note}
    <div class="match-grid">
      ${matches.map(renderMatchCard).join("")}
    </div>
  `;
}

function renderMatchCard(match) {
  const winner = state.winners[match.id] || "";
  const disabled = !match.teamA || !match.teamB;

  return `
    <article class="match-card">
      <div class="match-meta">Partido ${match.id}</div>
      ${renderTeamChoice(match.id, match.teamA, winner, disabled)}
      ${renderTeamChoice(match.id, match.teamB, winner, disabled)}
    </article>
  `;
}

function renderTeamChoice(matchId, team, winner, disabled) {
  const selected = team && team === winner;
  return `
    <button class="team-choice ${selected ? "selected" : ""}" type="button" data-winner="${matchId}:${escapeAttr(team)}" ${disabled ? "disabled" : ""}>
      ${team ? escapeHtml(team) : "Pendiente"}
    </button>
  `;
}

function renderSummaryStep(container) {
  const summary = generateSummaryText();
  container.innerHTML = `
    <div class="phase-head">
      <div>
        <h2>Resumen final</h2>
        <p class="intro-text">Usa los botones y revisa el texto antes de enviarlo.</p>
      </div>
    </div>
    <div class="summary-actions">
      <button id="copySummaryButton" class="button button-primary" type="button">Copiar resumen</button>
      <button id="downloadSummaryButton" class="button button-secondary" type="button">Descargar resumen .txt</button>
    </div>
    <textarea id="summaryText" class="summary-box" readonly>${escapeHtml(summary)}</textarea>
  `;
}

function selectWinner(matchId, team) {
  const match = findMatchById(matchId);
  if (!match || !team) return;

  state.winners[matchId] = team;
  clearDependentWinners(matchId);
  buildNextRounds();
  renderCurrentStep();
}

function clearDependentWinners(matchId) {
  const dependents = {
    73: [90], 74: [89], 75: [90], 76: [91], 77: [89], 78: [91], 79: [92], 80: [92],
    81: [94], 82: [94], 83: [93], 84: [93], 85: [96], 86: [95], 87: [96], 88: [95],
    89: [97], 90: [97], 91: [99], 92: [99], 93: [98], 94: [98], 95: [100], 96: [100],
    97: [101], 98: [101], 99: [102], 100: [102],
    101: [103, 104], 102: [103, 104]
  };
  const queue = [...(dependents[matchId] || [])];

  while (queue.length) {
    const id = queue.shift();
    delete state.winners[id];
    queue.push(...(dependents[id] || []));
  }
}

function generateSummaryText() {
  const lines = [];
  const podium = getPodium();

  lines.push("PORRA CARLOS MUNDIAL 2026", "");
  lines.push("FASE DE GRUPOS");
  groupLetters.forEach((letter) => {
    const prediction = state.groupPredictions[letter];
    lines.push(`Grupo ${letter}: 1.º ${prediction[0]}, 2.º ${prediction[1]}, 3.º ${prediction[2]}, 4.º ${prediction[3]}`);
  });

  const thirds = getThirds();
  const passed = thirds.filter((third) => state.bestThirds.includes(third.group));
  const eliminated = thirds.filter((third) => !state.bestThirds.includes(third.group));

  lines.push("", "MEJORES TERCEROS");
  lines.push(`Pasan: ${passed.map(formatThird).join(", ")}`);
  lines.push(`Eliminados: ${eliminated.map(formatThird).join(", ")}`);
  if (state.assignmentNote) lines.push(`Nota: ${state.assignmentNote}`);

  appendRoundSummary(lines, "DIECISEISAVOS", "round32");
  appendRoundSummary(lines, "OCTAVOS", "round16");
  appendRoundSummary(lines, "CUARTOS", "quarterfinals");
  appendRoundSummary(lines, "SEMIFINALES", "semifinals");
  appendRoundSummary(lines, "TERCER PUESTO", "thirdPlace");
  appendRoundSummary(lines, "FINAL", "final");

  lines.push("", "PODIO");
  lines.push(`Campeón: ${podium.champion}`);
  lines.push(`Subcampeón: ${podium.runnerUp}`);
  lines.push(`Tercer puesto: ${podium.third}`);
  lines.push(`Cuarto puesto: ${podium.fourth}`);

  return lines.join("\n");
}

function appendRoundSummary(lines, title, roundKey) {
  lines.push("", title);
  (state.matches[roundKey] || []).forEach((match) => {
    lines.push(`Partido ${match.id}: ${match.teamA} vs ${match.teamB} -> gana ${state.winners[match.id] || "Pendiente"}`);
  });
}

function getPodium() {
  const finalMatch = findMatchById(104);
  const thirdPlaceMatch = findMatchById(103);
  const champion = state.winners[104] || "Pendiente";
  const runnerUp = finalMatch ? getOtherTeam(finalMatch, champion) : "Pendiente";
  const third = state.winners[103] || "Pendiente";
  const fourth = thirdPlaceMatch ? getOtherTeam(thirdPlaceMatch, third) : "Pendiente";

  return { champion, runnerUp, third, fourth };
}

function copySummaryToClipboard() {
  const text = generateSummaryText();
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(
      () => showMessage("Resumen copiado al portapapeles.", "success"),
      () => fallbackCopy(text)
    );
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.getElementById("summaryText");
  if (!textarea) return;
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  textarea.setSelectionRange(0, 0);
  showMessage("Resumen copiado al portapapeles.", "success");
}

function downloadSummaryTxt() {
  const blob = new Blob([generateSummaryText()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "porra-carlos-mundial-2026.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function validateBeforeNext() {
  const stepKey = steps[state.currentStep].key;

  if (stepKey === "groups") return validateAllGroups();
  if (stepKey === "thirds") {
    if (state.bestThirds.length !== 8) {
      return { ok: false, message: `Selecciona exactamente 8 mejores terceros. Ahora hay ${state.bestThirds.length}.` };
    }
    return { ok: true };
  }
  if (["round32", "round16", "quarterfinals", "semifinals", "thirdPlace", "final"].includes(stepKey)) {
    return validateRound(stepKey);
  }

  return { ok: true };
}

function validateAllGroups() {
  const invalid = groupLetters.filter((letter) => !isGroupValid(letter));
  if (invalid.length) {
    return { ok: false, message: `Revisa estos grupos: ${invalid.map((letter) => `Grupo ${letter}`).join(", ")}. Deben tener cuatro equipos distintos.` };
  }
  return { ok: true };
}

function validateRound(roundKey) {
  const missing = (state.matches[roundKey] || []).filter((match) => !state.winners[match.id]);
  if (missing.length) {
    return { ok: false, message: `Falta elegir ganador en: ${missing.map((match) => `Partido ${match.id}`).join(", ")}.` };
  }
  return { ok: true };
}

function isGroupValid(letter) {
  const prediction = state.groupPredictions[letter] || [];
  return prediction.length === 4 && new Set(prediction).size === 4 && prediction.every((team) => groups[letter].includes(team));
}

function getThirds() {
  return groupLetters.map((group) => ({ group, team: state.groupPredictions[group][2] }));
}

function formatThird(third) {
  return `3.º ${third.team} (Grupo ${third.group})`;
}

function resolveSeed(seed) {
  if (!seed || seed === "3null" || seed === "3undefined") return "";
  const position = Number(seed[0]) - 1;
  const group = seed.slice(1);
  return state.groupPredictions[group]?.[position] || "";
}

function findMatchById(matchId) {
  const id = Number(matchId);
  return Object.values(state.matches).flat().find((match) => match.id === id);
}

function getLoser(matchId) {
  const match = findMatchById(matchId);
  const winner = state.winners[matchId];
  if (!match || !winner) return "";
  return getOtherTeam(match, winner);
}

function getOtherTeam(match, team) {
  if (!team || team === "Pendiente") return "Pendiente";
  if (match.teamA === team) return match.teamB || "Pendiente";
  if (match.teamB === team) return match.teamA || "Pendiente";
  return "Pendiente";
}

function pruneWinnersForExistingMatches() {
  Object.values(state.matches).flat().forEach((match) => {
    const winner = state.winners[match.id];
    if (winner && winner !== match.teamA && winner !== match.teamB) {
      delete state.winners[match.id];
    }
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    state = {
      ...createInitialState(),
      ...parsed,
      groupPredictions: {
        ...createInitialState().groupPredictions,
        ...(parsed.groupPredictions || {})
      },
      matches: parsed.matches || {},
      winners: parsed.winners || {}
    };
    migrateSavedGroupPredictions();
  } catch {
    state = createInitialState();
  }
}

function migrateSavedGroupPredictions() {
  groupLetters.forEach((letter) => {
    if (!isGroupValid(letter)) {
      state.groupPredictions[letter] = [...carlosGroupPredictions[letter]];
    }
  });
}

function resetState({ clearStorage = false } = {}) {
  state = createInitialState();
  if (clearStorage) localStorage.removeItem(STORAGE_KEY);
  renderCurrentStep();
}

function updateNavButtons() {
  document.getElementById("prevButton").disabled = state.currentStep === 0;
  document.getElementById("nextButton").textContent = state.currentStep === steps.length - 1 ? "Terminado" : "Siguiente";
  document.getElementById("nextButton").disabled = state.currentStep === steps.length - 1;
}

function showMessage(text, type = "warning") {
  const message = document.getElementById("message");
  message.textContent = text;
  message.className = `message ${type === "success" ? "success" : ""}`;
  message.hidden = false;
}

function clearMessage() {
  const message = document.getElementById("message");
  message.textContent = "";
  message.hidden = true;
  message.className = "message";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return encodeURIComponent(String(value ?? ""));
}

document.addEventListener("change", (event) => {
  if (event.target.matches("select[data-group]")) {
    const group = event.target.dataset.group;
    const index = Number(event.target.dataset.index);
    state.groupPredictions[group][index] = event.target.value;
    state.bestThirds = state.bestThirds.filter((letter) => groupLetters.includes(letter));
    state.winners = {};
    state.matches = {};
    renderCurrentStep();
  }

  if (event.target.matches(".third-option input")) {
    const group = event.target.value;
    if (event.target.checked) {
      if (!state.bestThirds.includes(group)) state.bestThirds.push(group);
    } else {
      state.bestThirds = state.bestThirds.filter((letter) => letter !== group);
    }
    state.winners = {};
    state.matches = {};
    renderCurrentStep();
  }
});

document.addEventListener("click", (event) => {
  const moveButton = event.target.closest("[data-move]");
  if (moveButton) {
    const [group, indexText, directionText] = moveButton.dataset.move.split(":");
    const index = Number(indexText);
    const direction = Number(directionText);
    const nextIndex = index + direction;
    const prediction = state.groupPredictions[group];
    [prediction[index], prediction[nextIndex]] = [prediction[nextIndex], prediction[index]];
    state.winners = {};
    state.matches = {};
    renderCurrentStep();
    return;
  }

  const winnerButton = event.target.closest("[data-winner]");
  if (winnerButton) {
    const [matchIdText, encodedTeam] = winnerButton.dataset.winner.split(":");
    selectWinner(Number(matchIdText), decodeURIComponent(encodedTeam));
    return;
  }

  if (event.target.id === "copySummaryButton") copySummaryToClipboard();
  if (event.target.id === "downloadSummaryButton") downloadSummaryTxt();
});

document.getElementById("prevButton").addEventListener("click", () => {
  if (state.currentStep > 0) {
    state.currentStep -= 1;
    renderCurrentStep();
  }
});

document.getElementById("nextButton").addEventListener("click", () => {
  const validation = validateBeforeNext();
  if (!validation.ok) {
    showMessage(validation.message);
    return;
  }

  if (state.currentStep < steps.length - 1) {
    state.currentStep += 1;
    renderCurrentStep();
  }
});

document.getElementById("resetButton").addEventListener("click", () => {
  if (confirm("¿Quieres reiniciar la porra actual?")) resetState();
});

document.getElementById("clearStorageButton").addEventListener("click", () => {
  if (confirm("¿Quieres borrar los datos guardados y empezar de cero?")) {
    resetState({ clearStorage: true });
    showMessage("Datos guardados borrados.", "success");
  }
});

loadState();
renderCurrentStep();
