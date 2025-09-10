"use client";

import React, { useMemo, useState } from "react";

/** ================= i18n ================= */
const SUPPORTED_LANGS = ["en", "da"];
const t = {
  en: {
    appTitle: "D&D NPC Generator",
    subtitle: "Weighted races • 100 professions • Demeanor • EN/DA",
    fields: { name:"Name", gender:"Gender", race:"Race", profession:"Profession", appearance:"Appearance", speech:"Speech", movement:"Movement", demeanor:"Demeanor" },
    buttons: { roll:"Roll!", lockAll:"Lock All", unlockAll:"Unlock All", copyText:"Copy (text)", copyJson:"Copy (JSON)" },
    outputTitle: "Output",
    genderUnrevealed: "Unrevealed",
  },
  da: {
    appTitle: "D&D NPC Generator",
    subtitle: "Vægtede racer • 100 professioner • Væsen • EN/DA",
    fields: { name:"Navn", gender:"Køn", race:"Race", profession:"Profession", appearance:"Udseende", speech:"Tale", movement:"Bevægelse", demeanor:"Væsen" },
    buttons: { roll:"Rul!", lockAll:"Lås alle", unlockAll:"Lås alle op", copyText:"Kopiér (tekst)", copyJson:"Kopiér (JSON)" },
    outputTitle: "Output",
    genderUnrevealed: "Uoplyst",
  }
};
function useLang() {
  const [lang, setLang] = React.useState("da");
  const tr = t[lang];
  return { lang, setLang, tr };
}

/** ============ Gender (weighted) ============ */
const genders = ["Male", "Female", "Non-binary", "Hermaphrodite"];
function weightedGender() {
  const r = Math.random() * 100;
  if (r < 48) return "Male";
  if (r < 96) return "Female";
  if (r < 98) return "Non-binary";
  return "Hermaphrodite";
}
const genderHiddenRaces = new Set(["Dragonborn", "Lizardfolk", "Kobold"]);
function displayGenderFor(race, gender, tr) {
  return genderHiddenRaces.has(race) ? tr.genderUnrevealed : gender;
}

/** ============ Races (weighted) ============ */
const races = [
  "Human","Half-Elf","High Elf","Wood Elf","Dark Elf (Drow)",
  "Mountain Dwarf","Hill Dwarf",
  "Lightfoot Halfling","Stout Halfling",
  "Forest Gnome","Rock Gnome",
  "Half-Orc","Orc",
  "Tiefling","Dragonborn","Aasimar",
  "Tabaxi","Tortle","Kenku","Kobold",
  "Goliath","Firbolg",
  "Genasi (Air)","Genasi (Earth)","Genasi (Fire)","Genasi (Water)",
  "Loxodon","Leonin","Minotaur",
  "Changeling","Shifter","Warforged","Vedalken",
  "Owlin","Harengon","Satyr","Triton",
  "Yuan-ti Pureblood","Lizardfolk",
  "Bugbear","Goblin","Hobgoblin",
  "Kalashtar"
];
const raceWeights = {
  "Human": 40,
  "Half-Elf": 6,
  "High Elf": 6,
  "Wood Elf": 6,
  "Dark Elf (Drow)": 4,
  "Mountain Dwarf": 6,
  "Hill Dwarf": 6,
  "Lightfoot Halfling": 4,
  "Stout Halfling": 4,
  "Forest Gnome": 4,
  "Rock Gnome": 4,
  "Half-Orc": 4,
  "Orc": 3,
  "Tiefling": 3,
  "Dragonborn": 3,
  "Aasimar": 3
  // others default to 1
};
const raceMap = {
  "Human": "human","Half-Elf": "elf","High Elf": "elf","Wood Elf": "elf","Dark Elf (Drow)": "drow",
  "Mountain Dwarf": "dwarf","Hill Dwarf": "dwarf",
  "Lightfoot Halfling": "halfling","Stout Halfling": "halfling",
  "Forest Gnome": "gnome","Rock Gnome": "gnome",
  "Half-Orc": "halforc","Orc": "halforc",
  "Tiefling": "tiefling","Dragonborn": "dragonborn","Aasimar": "human",
  "Tabaxi": "tabaxi","Tortle": "tortle","Kenku": "kenku","Kobold": "kobold",
  "Goliath": "goliath","Firbolg": "firbolg",
  "Genasi (Air)": "genasi","Genasi (Earth)": "genasi","Genasi (Fire)": "genasi","Genasi (Water)": "genasi",
  "Loxodon": "loxodon","Leonin": "leonin","Minotaur": "minotaur",
  "Changeling": "changeling","Shifter": "shifter","Warforged": "warforged","Vedalken": "vedalken",
  "Owlin": "owlin","Harengon": "harengon","Satyr": "satyr","Triton": "triton",
  "Yuan-ti Pureblood": "yuanti","Lizardfolk": "lizardfolk",
  "Bugbear": "bugbear","Goblin": "goblin","Hobgoblin": "hobgoblin",
  "Kalashtar": "kalashtar",
};

/** ============ Names (unchanged; race-based) ============ */
const names = {
  human: {
    male: ["Alric","Tomas","Cedric","Willem","Marcus","Robert","Victor","Joran","Edric","Jonas","Leoric","Harlan","Roderick","Tristan","Gavin"],
    female: ["Elira","Selene","Mara","Fiona","Katarina","Sophia","Isolde","Lydia","Rowena","Annette","Clara","Elise","Helena","Nadia","Vera"],
    surname: ["Blackwood","Fairweather","Strongarm","Ravenshadow","Holloway","Rivers","Marsh","Faraday","Kestrel","Dunwich","Ashford","Crowley","Thorne","Merriweather","Hawke"]
  },
  dwarf: {
    male: ["Thrain","Dain","Borin","Rurik","Kargrom","Eberk","Baern","Adrik","Bruenor","Harbek"],
    female: ["Helja","Vistra","Brynja","Hlin","Sigrun","Audhild","Eldeth","Gunnloda","Finellen","Ilde"],
    surname: ["Ironfist","Stonehelm","Coppervein","Goldbeard","Frostaxe","Battlehammer","Fireforge","Dankil","Thunderbrand","Granitebraid"]
  },
  elf: {
    male: ["Aelar","Thamior","Carric","Eldrin","Loric","Soveliss","Varis","Theren","Rolen","Imar"],
    female: ["Arwen","Sylvara","Naivara","Shalana","Thia","Keyleth","Lia","Miala","Shava","Enna"],
    surname: ["Moonwhisper","Silverfrond","Windwalker","Dawnsinger","Evenwood","Starbloom","Nightbreeze","Willowshade","Sunweaver","Wavesong"]
  },
  drow: {
    male: ["Ryld","Jarlaxle","Pharaun","Nalfein","Solaufein","Belwar","Zeknar","Verrak","Ilzt","Tazraen"],
    female: ["Quenthel","Vierna","Liriel","Zesstra","Triel","Halisstra","Zarra","Belira","Szinrae","Shi'nayne"],
    surname: ["Do'Urden","Baenre","Mizzrym","Xorlarrin","DeVir","Frey'lar","Despana","Kenafin","Faen'za","Teken'ghym"]
  },
  halfling: {
    male: ["Alton","Milo","Corrin","Perrin","Finnan","Merric","Roscoe","Colby","Tobin","Doolan"],
    female: ["Andry","Cora","Jillian","Seraphina","Shaena","Lavinia","Tegan","Verna","Bree","Marigold"],
    surname: ["Tealeaf","Brushgather","Goodbarrel","Underbough","Greenbottle","High-hill","Thistlefoot","Honeypot","Hilltopple","Hearthhome"]
  },
  gnome: {
    male: ["Boddynock","Fonkin","Warryn","Zook","Alston","Jebeddo","Pilwicken","Foddex","Duvamil","Wizzle"],
    female: ["Bimpnottin","Carlin","Loopmottin","Nissa","Roywyn","Ellyjobell","Lorilla","Mardnab","Nyx","Tana"],
    surname: ["Nackle","Murnig","Daergel","Ningel","Timbers","Fiddlefen","Sparkspindle","Cobblelob","Beren","Turen"]
  },
genasi: {
  male: ["Aeris","Boros","Ignan","Neris","Pyros","Terran","Zephos","Korran","Lazur","Tharos"],
  female: ["Aella","Caeli","Ilyra","Nirra","Pyra","Sola","Talia","Veyra","Zyra","Thessa"],
  surname: ["Stormborn","Flameheart","Earthshaper","Wavebound","Skywhisper","Stoneveil","Seaflame","Windcaller","Ashwalker","Deepcurrent"]
},
  halforc: {
    male: ["Grom","Ugar","Thok","Brug","Karash","Dorn","Rogar","Ulf","Karguk","Mogar"],
    female: ["Shauka","Urtha","Mogha","Krula","Sutha","Baggi","Engong","Myev","Ovina","Yevelda"],
    surname: ["Bonebreaker","Skullcrusher","Red Fang","Grimscar","Bloodtusk","Ironmaw","Skullcleaver","Rotfang","Stonehide","Ashskull"]
  },
  tiefling: {
    male: ["Malachai","Zephyr","Damakos","Therai","Akmenos","Lucian","Mordai","Zeth","Erebus","Caelum"],
    female: ["Nyx","Seraphine","Leucis","Kallista","Azariah","Belladonna","Lilith","Rieta","Zaida","Vesper"],
    surname: ["Shadowrend","Emberborn","Hellbrand","Darkflame","Nightbloom","Ashenveil","Cindervale","Grimlight","Umbrage","Doomwhisper"]
  },
  dragonborn: {
    male: ["Arjhan","Balasar","Rhogar","Torinn","Kriv","Medrash","Nadarr","Pandjed","Patrin","Tarhun"],
    female: ["Akra","Sora","Thava","Vyra","Jheri","Kava","Mishann","Nala","Perra","Uadjit"],
    surname: ["Myastan","Clethtinthiallor","Nemmonis","Drachedandion","Kepeshkmolik","Fenkenkabradon","Verthisathurgiesh","Yrjixtileth","Shestendeliath","Zekkar"]
  },
  goliath: {
    male: ["Aukan","Kavak","Thalai","Jorrun","Eglath","Gauthak","Iligit","Manneo","Othek","Thotham"],
    female: ["Vaunea","Imra","Orila","Anaq","Hulda","Keothi","Maveith","Nola","Thalai","Rava"],
    surname: ["Stoneshield","Thunderstep","Boulderborn","Skywatcher","Rockrunner","Peakstrider","Stonevigor","Snowguard","Highcliff","Graniteheart"]
  },
  tabaxi: {
    male: ["Bright Claw","Silent Reed","Copper Pounce","Quick Brook","Whispering Gale","Silver Thread","Ember Prowl","Black Ember","Clever Ash","Quiet Thorn"],
    female: ["Humming Quill","Soft Feather","Swift Lily","Amber Song","Shining Brook","Saffron Breeze","Velvet Step","Silent Jasmine","Hidden Dew","Flickering Ember"],
    surname: ["of the Tall Grasses","of the Sun Dunes","of the Moon Isles","of Whispering Reeds","of Jade Canopies","of Painted Stones","of Saffron Markets","of Wandering Paths","of the Coral Coves","of Starlit Sands"]
  },
  firbolg: {
    male: ["Brom","Fenn","Tolan","Ronan","Hale","Rowan","Cael","Doran","Eamon","Leif"],
    female: ["Aine","Bree","Kira","Maeve","Orla","Riona","Saoirse","Tara","Una","Niamh"],
    surname: ["Oakfriend","Mossmantle","Riverguard","Stonebloom","Thornwarden","Hearthgrove","Moonmeadow","Greenbark","Fogvale","Deepglen"]
  },
  tortle: {
    male: ["Kopo","Mako","Rasho","Tamu","Boru","Kavan","Talo","Moro","Garu","Sava"],
    female: ["Kela","Mira","Suri","Tila","Bana","Kovi","Taya","Sora","Gila","Nuri"],
    surname: ["Shellward","Tidewalker","Seagrass","Wavecarver","Sandburrow","Coralback","Reedferry","Saltshore","Driftlog","Pebblehide"]
  },
  kenku: {
    male: ["Karr","Rook","Kaak","Vek","Kek","Rik","Varr","Kirr","Kekko","Kraa"],
    female: ["Ree","Kia","Rika","Vea","Kee","Rii","Kiri","Viri","Kaya","Risa"],
    surname: ["Featherfall","Blackwing","Tinvoice","Hollowcall","Quickbeak","Echopeak","Nightcaw","Skylilt","Sharpquill","Dustplume"]
  },
  kobold: {
    male: ["Skrix","Vekket","Razik","Drak","Krix","Ruk","Zekk","Tirx","Varrik","Kazz"],
    female: ["Skaai","Kizzi","Riza","Vikki","Tazzi","Kukka","Rikka","Drazi","Sizzi","Tirra"],
    surname: ["Emberchip","Stonebite","Tunnelgleam","Scrapclaw","Redscale","Cindersnap","Rustsnout","Sparkclaw","Dustscale","Flintspark"]
  },
  loxodon: {
    male: ["Boram","Tovan","Ramak","Daman","Hareth","Jorvun","Kelram","Loman","Maruk","Neram"],
    female: ["Amara","Devi","Hema","Isha","Kala","Mira","Nala","Rani","Sana","Veda"],
    surname: ["Trunkbearer","Stonebinder","Oathcarver","Granitepath","Sagestep","Marbleguard","Sandtreader","Sunvein","Ivorybrow","Templeward"]
  },
  leonin: {
    male: ["Akar","Barun","Ceros","Dakar","Harun","Javin","Koros","Marun","Rakor","Tavus"],
    female: ["Amara","Besra","Caela","Dasha","Hera","Kira","Lareen","Nessa","Sera","Tala"],
    surname: ["Proudclaw","Dawnmane","Sunpride","Swiftstep","Stonepride","Windstalker","Goldmane","Nightstalk","Grassrunner","Brightfang"]
  },
  minotaur: {
    male: ["Aster","Brax","Corvos","Damar","Gorth","Hadar","Korvan","Marek","Roth","Turog"],
    female: ["Astra","Brena","Coria","Dessa","Gora","Hessa","Kara","Mara","Risa","Tura"],
    surname: ["Ironhorn","Stormhoof","Labyrn","Boulderhoof","Redhorn","Maizewalker","Stonemaze","Stronghorn","Longhorn","Deepmaze"]
  },
  changeling: {
    male: ["Aven","Corin","Darel","Evan","Ilan","Jas","Korin","Lem","Nivek","Sorin"],
    female: ["Asha","Cali","Dara","Elin","Ira","Jae","Kari","Lena","Mira","Sera"],
    surname: ["Manyfaces","Softstep","Mistguise","Quickmask","Shiftwhisper","Greyveil","Palegleam","Whiteshape","Veilwalk","Nameless"]
  },
  shifter: {
    male: ["Ash","Badger","Bran","Fang","Holt","Kade","Moss","Rook","Thorn","Warr"],
    female: ["Briar","Dawn","Ember","Fawn","Kaia","Lark","Reed","Sable","Thistle","Wren"],
    surname: ["Wildroot","Moonscent","Swiftpelt","Briarhide","Stonefur","Fernstride","Nightmane","Riverpad","Ashclaw","Greytrack"]
  },
  warforged: {
    male: ["Anchor","Bastion","Cipher","Drill","Forge","Gasket","Harbor","Iron","Jolt","Keystone"],
    female: ["Aegis","Beacon","Ciphera","Ember","Geara","Halo","Ivory","Javelin","Kindle","Lumen"],
    surname: ["Unit-3","Model-7","Pattern-12","Series-IX","Mark-V","Batch-22","Node-5","Frame-4","Shell-8","Array-10"]
  },
  vedalken: {
    male: ["Arix","Bener","Cerul","Dovin","Evar","Feron","Ivus","Neral","Sarin","Varek"],
    female: ["Ari","Cera","Devi","Enna","Ila","Lira","Nera","Sela","Tala","Vena"],
    surname: ["Bluehaze","Tideglass","Mindscroll","Aetherloom","Coldcurrent","Stillwater","Glassmind","Logicweir","Deepthought","Inkweave"]
  },
  owlin: {
    male: ["Arro","Bubo","Caro","Drin","Eyo","Faro","Gryx","Hoot","Iro","Jaro"],
    female: ["Ara","Bina","Ciri","Dari","Evi","Fia","Gala","Hina","Ivi","Jina"],
    surname: ["Nightplume","Moonfeather","Hollowgaze","Starwing","Duskbeak","Glidewind","Softhoot","Skylumen","Whisperflight","Cloudplume"]
  },
  harengon: {
    male: ["Brisk","Clover","Dandel","Fennel","Harro","Jasper","Knot","Pip","Quill","Thim"],
    female: ["Bun","Clovera","Daisy","Fritta","Honey","Junie","Pippa","Rosie","Tansy","Willa"],
    surname: ["Quickfoot","Warrenhop","Burrowtail","Dewclover","Harebell","Skyleap","Greenmeadow","Thump","Nibble","Springleaf"]
  },
  satyr: {
    male: ["Aeson","Brix","Calius","Doros","Eryx","Faunus","Kyros","Lykos","Neron","Thespis"],
    female: ["Aella","Brisa","Calla","Dione","Eris","Fauna","Lyra","Nysa","Rhea","Tessa"],
    surname: ["Winewhistle","Greenglade","Piperidge","Thornsong","Merrifenn","Hilldance","Ramblebrook","Oakpipe","Goldthicket","Leafpipe"]
  },
  triton: {
    male: ["Aqual","Boreas","Coral","Delfin","Eryon","Galor","Hydor","Nereus","Pelag","Thal"],
    female: ["Aphra","Coralia","Delphi","Eldra","Gaia","Maris","Nerida","Pelena","Sirra","Thassa"],
    surname: ["Seamarch","Wavecrest","Brineguard","Pearlcurrent","Tidebinder","Foamrider","Kelpcloak","Deepwatch","Sprayharp","Reeftide"]
  },
  yuanti: {
    male: ["Azhiss","Bashar","Chazek","Drazzi","Ezhar","Hassik","Izzar","Sszek","Tazir","Zehss"],
    female: ["Azira","Beshka","Chassra","Drezza","Ezira","Hassra","Isska","Sszira","Tazra","Zehra"],
    surname: ["of the Coil","of the Venom","of the Silent Pit","Serpentcrest","Viperscale","Shadowcoil","Nightfang","Whispershed","Fangveil","Coilward"]
  },
  lizardfolk: {
    male: ["Arak","Brask","Chak","Drass","Ghak","Hassk","Izzik","Krass","Shakk","Vrask"],
    female: ["Arasa","Braska","Chassa","Drassa","Hassa","Issa","Krassa","Shassa","Vrassa","Zassa"],
    surname: ["Mudscale","Marshgaze","Reedfins","Bogclaw","Stoneswim","Sunscale","Stillwater","Bonefin","Shadegill","Dreampool"]
  },
  bugbear: {
    male: ["Brukk","Darg","Gash","Krull","Marr","Rukk","Sharg","Thokk","Ugg","Varr"],
    female: ["Brukka","Darga","Gasha","Krulla","Marra","Rukka","Sharga","Thokka","Ugga","Varra"],
    surname: ["Blackmaw","Longarm","Nightpelt","Skulltusk","Redhide","Darksnarl","Grimfur","Boneback","Ironpelt","Miresnout"]
  },
  goblin: {
    male: ["Bikk","Drik","Grax","Hik","Jik","Klik","Nok","Rik","Snik","Vik"],
    female: ["Bikka","Drika","Graxa","Hikka","Jikka","Klia","Nokka","Rikka","Snika","Vikka"],
    surname: ["Ratbit","Rustnail","Sootsmudge","Fleagrin","Tinsnatch","Wiretwist","Grubpocket","Moldnose","Sparkskip","Brickstain"]
  },
  hobgoblin: {
    male: ["Arkh","Barok","Dargan","Grish","Horak","Kargan","Loruk","Mardak","Rhaz","Torak"],
    female: ["Arka","Barra","Darga","Grisha","Hora","Karra","Lora","Marda","Rhaza","Tora"],
    surname: ["Steelbanner","Bloodmarch","Ironfile","Warbrand","Skirmcrest","Drillscar","Shieldlash","Campwarden","Redrank","Warscribe"]
  },
  kalashtar: {
    male: ["Anat","Beren","Doran","Eshan","Ilan","Joran","Kiran","Lashan","Rayan","Talen"],
    female: ["Asha","Bira","Devi","Eila","Ira","Kala","Lira","Mira","Sera","Tira"],
    surname: ["Dreamborne","Lightweave","Mindweft","Soulbridge","Tranceward","Calmriver","Nightwatch","Starweft","Thoughtsinger","Dawnmind"]
  },
  // already included: tabaxi, firbolg, goliath, tiefling, dragonborn, etc.
};

/** ============ Bilingual trait data (100 each) ============ */
const data = {
  professions: {
    en: [
      "Farmer","Fisher","Shepherd","Hunter","Trapper","Forester","Miller","Baker","Butcher","Brewer",
      "Vintner","Cook","Street Vendor","Innkeeper","Tavern Server","Stablehand","Blacksmith","Armorer","Weaponsmith","Jeweler",
      "Lapidary","Carpenter","Wheelwright","Mason","Potter","Glassblower","Tinker","Weaver","Tailor","Cobbler",
      "Chandler (Candlemaker)","Scribe","Bookbinder","Cartographer","Librarian","Alchemist","Apothecary","Herbalist","Physician","Surgeon",
      "Midwife","Barber","Miner","Smelter","Chandler (Ship)","Sailor","Fisherboat Captain","Dockworker","Shipwright","Navigator",
      "Messenger","Courier","Town Crier","Guard","Watch Sergeant","City Watch Captain","Soldier","Scout","Ranger","Mercenary",
      "Bounty Hunter","Bodyguard","Gladiator","Entertainer","Bard","Minstrel","Juggler","Acrobat","Actor","Fortune Teller",
      "Seer","Astrologer","Priest","Monk","Nun","Acolyte","Paladin","Temple Attendant","Gravedigger","Undertaker",
      "Chandler (Tallow)","Tanner","Furrier","Dyer","Ropemaker","Sailmaker","Cooper","Ferrier","Teamster","Caravan Leader",
      "Trader","Shopkeeper","Moneylender","Tax Collector","Scribe of the Court","Magistrate’s Clerk","Courtier","Noble’s Steward","Retired Adventurer","Wizard’s Apprentice"
    ],
    da: [
      "Bonde","Fisker","Hyrde","Jæger","Fældeopsætter","Skovfoged","Møller","Bager","Slagter","Brygger",
      "Vingartner","Kok","Gadesælger","Værtshusholder","Tjener på kro","Staldknægt","Smed","Rustningsmager","Våbensmed","Guldsmed",
      "Stensliber","Tømrer","Hjulmand","Murer","Pottemager","Glaspuster","Kramkar","Væver","Skrædder","Skomager",
      "Lysestøber","Skriver","Bogbinder","Kartograf","Bibliotekar","Alkymist","Apoteker","Urtekender","Læge","Kirurg",
      "Jordemoder","Barber","Minearbejder","Støber","Skibsprovianter","Sømand","Fiskeskipper","Havnearbejder","Skibsbygger","Navigatør",
      "Budbringer","Kurer","Byråber","Vagt","Vagtofficer","Byvagt-kaptajn","Soldat","Spejder","Skovrider","Lejesoldat",
      "Dusørjæger","Livvagt","Gladiator","Underholder","Bard","Spillemand","Jonglør","Akrobat","Skuespiller","Spåkvinde/Spåmand",
      "Seer","Astrolog","Præst","Munk","Nonne","Akolyt","Paladin","Tempeltjener","Gravgraver","Bedemand",
      "Tællekoger","Garver","Pelsmager","Farver","Rebslager","Sejlduger","Bødker","Hovslagter","Kusk","Karavanefører",
      "Købmand","Butiksejer","Ågerkarl","Skatteopkræver","Retsskriver","Dommerfuldmægtig","Hofsinde","Adelig forvalter","Pensioneret eventyrer","Troldmandslærling"
    ]
  },
  appearances: {
    en: [
      "A long scar across the face","One eye is milky white","Toothless but always smiling","Ragged cloak full of moth holes","Permanently dirty fingers","Six fingers on the right hand","Very long, greasy hair","Bald head tattooed with sigils","A hunched back","One hand always bandaged","Pocked with tiny burn marks","Pronounced high cheekbones","Perpetually rosy cheeks","Keeps a pet (rat/toad/bird) in pocket","Necklace strung with tiny bones","Always sun-kissed skin","Pale, almost translucent skin","A carved wooden prosthetic foot","Crooked, many-times-broken nose","Huge moustache but no head hair","A glass eye of odd color","Wears antlers/horns as jewelry","Missing one ear","Tiny fingertip tattoos","Soot or ash smeared constantly","Very small and wiry","Unnaturally tall and lanky","A rasping, chronic cough","Always smells of fish","Decorative eyepatch","Teeth stained blue by berries","Large wine-stain birthmark","Jagged scar across throat","Hands always in pockets","Hooded cloak that drips even when dry","Heterochromia (two eye colors)","Ear filled with rings","Always wears a wide-brim hat","Grease smudge on cheek that never leaves","Very long nails","Spyglass hanging from neck","Always chewing a root","Large wart on the nose","Shoes far too expensive for outfit","Fresh flower crown every day","Covered in tiny scratches","Metal facial prosthetic","Enormous bushy eyebrows","A wound that never heals","Voice cracks into falsetto","Boots always caked with mud","Checks a pocketwatch constantly","Carries a child’s doll","Clutches a battered book","Arcane symbols drawn on skin","Thick fur coat regardless of season","Wreath of dried herbs","Necklace of teeth","Walking stick carved with runes","Deep hood concealing the face","Scar shaped like an animal","Gold leaf flaking on skin","Hands that bleed in tiny cuts","Odd birthmark on the brow","Belt of clinking vials","A bird that always follows","Tinted glass spectacles","Rings on every finger","Cloak that smells of the sea","Oversized gloves","Belt jangling with keys","Constantly darting eyes","A creaking spine","Eyes that always look wet","Voice like a knife’s edge","Backpack twice their size","A scar that looks very recent","Heavy eyeliner (even on men)","A single gold tooth always flashed","Ear pierced many times","Beard woven into braids","Always blood under fingernails","Carries a worn flute","Hair full of dust","Rusty old hero’s sword","Rune branded into the arm","Clothes of a color no one else wears","Hooked nose","Face-wrapping scarf","Goggles strapped to forehead","Leather half-mask","Poison-green lipstick","Permanent wine blotch on clothes","Skull-shaped buckle","Broken keepsake they guard","A dried hand at the belt","Tiny bells sewn into clothes","Prosthetic leg made from wrong size","Hood edged with animal teeth","Robe that glitters like a starfield","Smudged ink on fingertips","Freshly stitched wound","Missing two front teeth","Burn-scarred ear","Fingerless gloves regardless of weather","Scent of ozone follows them","Faintly glowing tattoo","Hair braided with copper wire"
    ],
    da: [
      "Et langt ar hen over ansigtet","Det ene øje er mælkehvidt","Tandløs men altid smilende","Laserkappe fyldt med møl-huller","Permanent snavsede fingre","Seks fingre på højre hånd","Meget langt, fedtet hår","Skaldet hoved tatoveret med segl","En pukkelryg","Den ene hånd altid forbundet","Prikket af små brændemærker","Markante høje kindben","Altid rødmossede kinder","Har et kæledyr (rotte/padde/fugl) i lommen","Halskæde snoret med små knogler","Altid solbrun hud","Bleg, næsten gennemsigtig hud","Udskåret træprotese som fod","Krogede, mange gange brækket næse","Kæmpe overskæg men intet hovedhår","Et glasøje i mærkelig farve","Bærer gevir/horn som smykke","Mangler det ene øre","Små tatoveringer på fingerspidserne","Sod eller aske smurt på hele tiden","Meget lille og spinkel","Unaturligt høj og ranglet","Hæs, kronisk hoste","Lugter altid af fisk","Dekorativ klap for øjet","Tænder farvet blå af bær","Stor vinrød modermærkeplet","Takket ar hen over halsen","Hænderne altid i lommerne","Hættekappe der drypper selv når tør","Heterokromi (to øjenfarver)","Øret fuldt af ringe","Bærer altid bredskygget hat","Fedtplam i kinden der aldrig går væk","Meget lange negle","Kikkert hænger i en snor om halsen","Tygger altid på en rod","Stor vorte på næsen","Sko alt for dyre til tøjet","Ny blomsterkrans hver dag","Dækket af små ridser","Metallisk ansigtsprotese","Enorme buskede øjenbryn","Et sår der aldrig heler","Stemme, der knækker i falset","Støvler altid smurt ind i mudder","Tjekker konstant et lommeur","Bærer på en barnedukke","Klynger sig til en medtaget bog","Arkaneruner tegnet på huden","Tykt pelsslag uanset årstid","Krans af tørrede urter","Halskæde af tænder","Stok udskåret med runer","Dyb hætte, der skjuler ansigtet","Ar formet som et dyr","Guldflager skaller af huden","Hænder der bløder i små rifter","Underligt modermærke i panden","Bælte med klirrende hætteglas","En fugl følger dem altid","Tonede brilleglas","Ringe på alle fingre","Kappe der lugter af hav","Alt for store handsker","Bælte der klirrer af nøgler","Øjne der konstant flakker","En rygsøjle der knager","Øjne der altid ser våde ud","Stemme som en knivsæg","Rygsæk dobbelt så stor som dem","Et ar der ser helt friskt ud","Kraftig eyeliner (også på mænd)","En enkelt guldtand vises altid","Øret gennemstukket mange gange","Skæg flettet i fletninger","Altid blod under neglene","Bærer en slidt fløjte","Håret fuldt af støv","Rustet, gammel heltesværd","Rune brændt ind i armen","Tøj i en farve ingen andre bærer","Kroget næse","Ansigtstørklæde viklet rundt","Beskyttelsesbriller på panden","Læder-halvmaske","Giftgrøn læbestift","Permanent vinplet på tøjet","Bæltespænde formet som kranie","Knick-knack de vogter nidkært","En tørret hånd i bæltet","Små klokker syet i tøjet","Protese-ben i forkert størrelse","Hættekant med dyretænder","Kåbe der glimter som en stjernehimmel","Snavset blæk på fingerspidser","Friskt syet sår","Mangler de to fortænder","Forbrændt og arret øre","Fingerløse handsker året rundt","Lugt af ozon følger dem","Svagt glødende tatovering","Hår flettet med kobbertråd"
    ]
  },
  speech: {
    en: [
      "Always whispering","Constantly shouting","Speaks in riddles","Misuses proverbs at odd times","Stutters","Overlong vowels (‘I thiiiink…’)","Hoarse voice","Nasal tone","Clips off words","Talks very quickly","Talks painfully slowly","Speaks in rhyme","Talks in third person","Calls everyone ‘my friend’","Shrill, hysterical laugh","Tears up mid-sentence","Nervous giggle","Singsong dialect","Slips into another language","Heavy foreign accent","Echoes others’ last words","Wildly mixed metaphors","Interrupts self with curses","Utterly monotone","Animal noises between words","Starts every sentence with ‘Well…’","Constant interrupter","Says ‘uh’ every other word","Uses fancy words wrong","Obsessed with old sayings","Sounds constantly drunk","Sounds constantly angry","Sounds constantly cheerful","Sounds like they’re crying","Sings instead of speaking","Excessively polite in all cases","Blunt and rude","Short, choppy sentences","Speaks without stopping to breathe","High, squeaky voice","Deep rumbling voice","Pitch swings unpredictably","Metallic, tinny voice","Whisper then sudden shout","Over-articulated diction","Stage-actor projection","Imitates others frequently","Overloads with detail","Speaks in half-sentences","Never finishes sentences","Begins with a quick prayer","Mixes in animal growls","Voice cracks suddenly","Persistent cough mid-word","Swears far too much","Talks only about themself","Feigns wisdom with long words","Describes everything in past tense","Predicts in future tense","Adds comic book sound effects","Asks ‘do you understand?’ often","Gives everyone nicknames","Whispering chuckle","Barking loud laugh","Speaks in meter/verse","Pounds table for emphasis","Exaggerated… dramatic… pauses","Talks to their hat/pet/object","Repeats ‘as I said’ constantly","Marketplace hawker tone","Oceanic metaphors for everything","Religious phrases regardless of topic","Barks soldier commands","Voice that grates the ear","Barely audible mumble","Noticeable tremble in voice","Always out of breath","Starts with ‘listen here…’","Starts with ‘by the gods…’","Says own name often","Repeats last word of each sentence","Huge hand gestures at all times","Carnival barker flourish","Perpetual sighing tone","Relentlessly encouraging tone","Snide schoolmaster tone","Threatening whisper","Roaring laugh after each line","Speaks only in exclamations","Speaks only in questions","Says ‘maybe’ every sentence","Says ‘of course’ every sentence","Says ‘why not?’ every sentence","Voice changes with mood","Voice just stops abruptly","Sounds like a hymn","Recites like a recipe","Reads as if from a book","Theatrical wails (‘oh, woe!’)","Adds little whistles between words","Clicks tongue before speaking","Hums a note between phrases","Ends statements with ‘right?’","Overuses sports metaphors","Chronically mispronounces names","Whispers numbers as they talk","Laughs at their own jokes","Never uses contractions"
    ],
    da: [
      "Hvisker altid","Råber konstant","Taler i gåder","Bruger ordsprog forkert på skæve tidspunkter","Stammer","Trækker voldsomt i vokalerne (‘Jeeeg synes…’)","Hæs stemme","Nasal klang","Hakker ordene af","Taler meget hurtigt","Taler pinefuldt langsomt","Rimer når de taler","Taler i tredje person","Kalder alle ‘min ven’","Skinger, hysterisk latter","Begynder at græde midt i en sætning","Nervøs fnisen","Syngende dialekt","Glider over i et andet sprog","Tung udenlandsk accent","Gentager andres sidste ord","Vildt blandede metaforer","Afbryder sig selv med eder","Fuldstændig monoton","Dyrelyde mellem ordene","Starter hver sætning med ‘Tja…’","Afbryder hele tiden","Siger ‘øh’ hvert andet ord","Bruger fine ord forkert","Besat af gamle talemåder","Lyder konstant beruset","Lyder konstant vred","Lyder konstant munter","Lyder som om de græder","Synger i stedet for at tale","Overdrevent høflig i alle situationer","Brutal og uhøflig","Korte, hakkende sætninger","Taler uden at trække vejret","Skinger, pibende stemme","Dyb, rumlende stemme","Tonehøjde svinger uforudsigeligt","Metallisk, blik-agtig stemme","Hvisker og råber pludseligt","Overartikuleret diktion","Teaterskuespiller-projektion","Efterligner andre ofte","Overdænger med detaljer","Taler i halve sætninger","Gør aldrig sætninger færdige","Begynder med en hurtig bøn","Blender dyreknurren ind","Stemmen knækker pludseligt","Vedvarende hoste midt i ord","Bander alt for meget","Taler kun om sig selv","Foregiver visdom med lange ord","Beskriver alt i datid","Forudsiger alt i fremtid","Tilføjer tegneserie-lydord","Spørger ‘forstår du?’ hele tiden","Giver alle øgenavne","Hviskende fnis","Bjæffende høj latter","Taler i takt/meter","Slår i bordet for at understrege","Overdrevne… dramatiske… pauser","Taler til sin hat/sit kæledyr/en genstand","Gentager ‘som jeg sagde’ hele tiden","Markedsråber-stemme","Havmetaforer om alt","Religiøse fraser uanset emne","Gør kommandoer som en soldat","Stemme der skærer i øret","Næsten uhørlig mumlen","Tydelig rysten på stemmen","Altid forpustet","Starter med ‘hør her…’","Starter med ‘ved guderne…’","Siger sit eget navn ofte","Gentager sidste ord i hver sætning","Voldsomme håndbevægelser hele tiden","Gøgler-agtig salgstale","Evigt suk-klingende tone","Utrætteligt opmuntrende tone","Spydig skolelærer-klang","Truende hvisken","Brølende latter efter hver replik","Taler kun i udråb","Taler kun i spørgsmål","Siger ‘måske’ i hver sætning","Siger ‘selvfølgelig’ i hver sætning","Siger ‘hvorfor ikke?’ i hver sætning","Stemmen skifter med humøret","Stemmen stopper brat","Lyder som en salme","Remser op som en opskrift","Læser op som fra en bog","Teatralske jamren (‘åh, ve!’)","Tilføjer små fløjten mellem ord","Klikker med tungen før hun/han taler","Summer en tone mellem fraser","Slutter sætninger med ‘ikke?’","Overbruger sportsmetaforer","Forvrænger navne kronisk","Hvisker tal mens de taler","Griner af egne jokes","Bruger aldrig sammentrækninger"
    ]
  },
  movement: {
    en: [
      "Limping slightly","Always tiptoeing","Dragging feet","Tiny mincing steps","Overlong strides","Sailor’s side-to-side sway","Half-jogging for no reason","Trips over own feet","Little hops instead of steps","High-knee parade march","Changes direction constantly","Walks backward when talking","Hands clasped behind back","Wild arm-waving","Big theatrical strides","Leaning forward like in a rush","Long freezes then sudden bursts","Drops to a squat mid-chat","Exaggeratedly straight-backed","Feet turned inward","Feet turned outward","One-two… pause… rhythm","Balances like on a tightrope","Sneaks needlessly","Marches to an inner drum","Hesitates before each step","Rocks back and forth standing","Always moving in small circles","Gliding, silent gait","Hands out like a sleepwalker","Half-dancing while walking","Head tilted up at the sky","Head down watching the ground","Searching the ground constantly","A hop every third step","Military march cadence","Random little spins","Catlike, smooth and silent","Bearlike, heavy and slow","Birdlike, quick little steps","Body leaning left while walking","Body leaning right while walking","Carries a cane but doesn’t need it","Seems perpetually dizzy","Balances on one leg when stopping","Shrugs shoulders as they walk","Shoulder-bumps others aside","Jumps cracks in the road","Steps precisely on lines","Hands jammed in pockets","Arms folded while walking","Arms raised ready to fight","Bounces in place while still","Fast scurry then hard stop","Slides feet like on ice","Drags one foot more than the other","Rocks heel to toe in place","Cracks knuckles while walking","Slams heels hard with each step","Always sneaking, even in crowds","Moves with dance-like rhythm","Hooflike clop rhythm","Doglike loping trot","Stomps when excited","Looks constantly panicked","Seems to float along","Moves like through water","Runs a few steps then walks","Balances on tiptoes often","Balances on heels often","Zigzags slightly","Turns head with feet","Turns head against feet","Stands uncomfortably close","Stands far too distant","Rolls shoulders in circles","Drums fingers on thighs","Runs down stairs instead of walking","Side-steps like a crab","Short pheasant-like hops","Heavy, thudding steps","Glides as if on wheels","Pivots sharply on heel","Puffs chest in arrogance","Constantly pushes up glasses","Steps to their own humming","Head bobs to imagined music","Little hop every fifth step","Keeps glancing backward","Stops to ‘tie shoes’ repeatedly","Lifts feet as if ground burns","Walks as if burden is heavy","Walks as if weightless","Sudden darting sprints","Trips on invisible things","Slides to knees instead of bowing","Hops up on crates and stones","Strikes odd poses when halted","Sits down mid-conversation","Moves like a puppet on strings","Slides sideways through gaps","Hugs walls while moving","Tiptoes on creaky boards","Balances on curbs and edges","Skips every few steps","Paces in perfect squares","Counts steps out loud","Shadowboxes while walking"
    ],
    da: [
      "Halter let","Går altid på tæer","Slæber fødderne","Meget små, trippe-trin","Alt for lange skridt","Sømænds gyngende gang","Småløber uden grund","Snubler over egne fødder","Små hop i stedet for skridt","Høje knæløft som i parade","Skifter retning hele tiden","Går baglæns når de taler","Hænderne foldet bag ryggen","Viltre armbevægelser","Store, teatralske skridt","Læner sig frem som i hast","Lange frys og pludselige ryk","Faldt ned i hug midt i samtale","Overdrevent rank holdning","Fødderne peger indad","Fødderne peger udad","Et-to… pause… rytme","Balancerer som på line","Sniger sig uden grund","Marcherer til en indre tromme","Tøvende før hvert skridt","Gynger frem og tilbage stående","Bevæger sig altid i små cirkler","Glidende, lydløs gang","Hænderne strakt frem som søvngænger","Halvdansende gangart","Hovedet vendt op mod himlen","Hovedet nede mod jorden","Spejder hele tiden mod jorden","Et hop hvert tredje skridt","Militær march-kadence","Tilfældige små piruetter","Kat-agtig, glat og stille","Bjørne-agtig, tung og langsom","Fugle-agtige, hurtige trin","Kroppen læner til venstre under gang","Kroppen læner til højre under gang","Bærer stok uden at have brug for den","Virker konstant svimle","Balancerer på ét ben ved stop","Trækker på skuldrene mens de går","Skulder-skubber andre væk","Hopper over revner i vejen","Træder præcist på linjerne","Hænderne dybt i lommerne","Arme over kors mens de går","Arme løftet klar til kamp","Hopper på stedet når de står stille","Hurtigt piskeri og brat stop","Glider fødderne som på is","Slæber mere på den ene fod","Vipper hæl-tå på stedet","Knækker knoer mens de går","Hamrer hælene i for hvert skridt","Sniger altid, selv i menneskemængder","Bevæger sig som i dans","Hov-agtig klapren","Hundelignende luntetrav","Stamper når de bliver ivrige","Ser konstant panisk ud","Synes at svæve frem","Bevæger sig som gennem vand","Løber få skridt, så går","Balancerer ofte på tæer","Balancerer ofte på hæle","Zigzagger let","Drejer hovedet med fødderne","Drejer hovedet modsat fødderne","Står ubehageligt tæt","Står alt for langt væk","Ruller skuldre i cirkler","Trommer fingre på lårene","Løber ned ad trapper i stedet for at gå","Side-trin som en krabbe","Korte fasan-lignende hop","Tunge, dundrende skridt","Glider som på hjul","Drejer skarpt på hælen","Puster brystet stolt frem","Skubber hele tiden briller op","Træder i takt til egen nynnens","Hovedet gynger til indre musik","Et lille hop hvert femte skridt","Kigger hele tiden bagud","Stopper for at ‘binde snørebånd’ igen og igen","Løfter fødderne som om jorden brænder","Går som med tung byrde","Går som uden vægt","Pludselige, piskende spurter","Snubler over usynlige ting","Glider ned på knæ i stedet for at bukke","Hopper op på kasser og sten","Indtager sære positurer ved stop","Sætter sig midt i samtalen","Bevæger sig som en marionet","Glider sidelæns gennem sprækker","Klynger sig til vægge når de går","Listes over knirkende brædder","Balancerer på kantsten og kanter","Springer et par skridt indimellem","Pacer i perfekte kvadrater","Tæller skridt højt","Skadetræner i luften mens de går"
    ]
  },
  demeanor: {
    en: [
      "Stoic and unreadable","Cheerfully oblivious","Brooding and distant","Nervously fidgety","Quietly confident","Hopelessly romantic","Perpetually suspicious","Proud to a fault","Genuinely compassionate","Grim but fair","Playfully sarcastic","Deadpan humor","Wide-eyed curious","World-weary cynic","Easily offended","Quick to forgive","Eager to please","Passive-aggressive","Bossy and controlling","Melodramatic storyteller","Absent-minded daydreamer","Calm under pressure","Hotheaded sprinter","Cold and clinical","Chipper morning person","Night owl grumbler","Superstitious about everything","Hero-worshipping adventurers","Greedy but careful","Generous to strangers","Recklessly brave","Conflict-avoidant","Reluctant leader","Natural mediator","Blunt truth-teller","Silver-tongued flatterer","Chronic exaggerator","Pessimistic realist","Optimistic idealist","Snarky but loyal","Grateful survivor","Vengeful grudge-keeper","Shameless gossip","Chivalrous helper","Tactless but honest","Excitable and jumpy","Protective of underdogs","Rule-obsessed stickler","Rule-breaking free spirit","Flirtatious and bold","Prudish and proper","Easily distracted","Methodical planner","Improvises constantly","Schemer two steps ahead","Conspiracy-minded","Overly apologetic","Secretly terrified","Dead-serious mission focus","Play-it-safe cautious","Adrenaline chaser","Spiritual and reflective","Scientific skeptic","Squeamish about blood","Bloodthirsty braggart","Merciful even to foes","Vindictive with rivals","Compulsively tidy","Comfortably messy","Food-obsessed","Perpetually thirsty","Animal lover","Kids’ best friend","Patronizing to nobility","Awed by nobility","Dislikes magic","Fascinated by magic","Clerical about records","Artistic and bohemian","Musically inclined","Poet at heart","Collector of oddities","Hates being touched","Hugger of everyone","Always humming","Whistles when thinking","Laughs at own jokes","Stone-faced listener","Interrupts constantly","Lets others speak first","Overexplains everything","Keeps answers short","Needs last word","Avoids eye contact","Holds intense eye contact","Uncomfortable in crowds","Thrives in crowds","Hates the outdoors","Feels alive outdoors","Existentially anxious","Radiates quiet joy"
    ],
    da: [
      "Stoiskt og uigennemskueligt","Muntert uvidende","Tungsindigt og fjern","Nervøst pilfingret","Stille selvsikker","Håbløst romantisk","Evigt mistænksom","Stolt til det overdrevne","Oprigtigt medfølende","Barsk men retfærdig","Legende sarkastisk","Tørt deadpan-humor","Storøjet nysgerrig","Verdens-træt kyniker","Let at fornærme","Hurtig til at tilgive","Ivrig efter at behage","Passiv-aggressiv","Dominerende og kontrollerende","Melodramatisk historiefortæller","Fraværende dagdrømmer","Rolig under pres","Hidsig sprinter","Kold og klinisk","Morgenfrisk og kvik","Natteugle der brokker sig","Overtroisk med alt","Heltedyrkende eventyrfan","Grådig men varsom","Generøs mod fremmede","Hensynsløst modig","Konfliktsky","Modvillig leder","Naturlig mægler","Brutal sandhedssiger","Sølv-tung smigrer","Kronisk overdriver","Pessimistisk realist","Optimistisk idealist","Spydig men loyal","Taknemmelig overlever","Hævngerrig og langnæbbet","Skamløs sladdertante","Ridderlig hjælper","Taktløs men ærlig","Letantændelig og springende","Beskytter de svage","Regelrytter til det maniske","Fri sjæl der bryder reglerne","Flirtende og modig","Prippet og korrekt","Let at distrahere","Metodisk planlægger","Improviserer hele tiden","Skakspiller to træk frem","Konspirations-orienteret","Overdrevent undskyldende","Hemmelig rædselsslagen","Dødalvorligt opgavefokus","Sikkerheds-orienteret forsigtighed","Jager adrenalin","Åndelig og eftertænksom","Videnskabeligt skeptisk","Sart over for blod","Blodtørstig pralhals","Barmhjertig selv mod fjender","Hævnlysten mod rivaler","Tvangsryddelig","Tilpas rodet","Madfikseret","Evigt tørstig","Dyreven","Børns bedste ven","Patroniserende mod adel","Ærbødig over for adel","Kan ikke lide magi","Fascineret af magi","Kontornusser med papir","Kunstnerisk og boheme","Musikalsk anlagt","Digter af hjertet","Samler af kuriositeter","Bryder sig ikke om berøring","Krammer alle","Nynner hele tiden","Fløjter når der tænkes","Griner af egne vittigheder","Stenansigt-lytter","Afbryder konstant","Lader andre tale først","Overforklarer alting","Holder svarene korte","Skal have det sidste ord","Undgår øjenkontakt","Holder intens øjenkontakt","Utilpas i folkemængder","Trives i folkemængder","Hader udendørs","Lever op udendørs","Eksistentielt ængstelig","Udsender stille glæde"
    ]
  }
};

function padTo100(arr, label) {
  if (arr.length >= 100) return arr;
  return arr.concat(Array.from({ length: 100 - arr.length }, (_, i) => `${label} ${i + 1}`));
}
function getTables(lang) {
  return {
    professions: padTo100(data.professions[lang], lang==="da"?"Profession":"Profession"),
    appearances: padTo100(data.appearances[lang], lang==="da"?"Særkende":"Distinct feature"),
    speech: padTo100(data.speech[lang], lang==="da"?"Sproglig særhed":"Unusual speech quirk"),
    movement: padTo100(data.movement[lang], lang==="da"?"Bevægelsesmønster":"Unusual movement quirk"),
    demeanor: padTo100(data.demeanor[lang], lang==="da"?"Væsen":"Notable demeanor"),
  };
}

/** ============ Helpers ============ */
const roll = (arr) => arr[Math.floor(Math.random() * arr.length)];
const weightedRoll = (items, weightMap) => {
  const weights = items.map((it) => weightMap[it] ?? 1);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    if (r < weights[i]) return items[i];
    r -= weights[i];
  }
  return items[items.length - 1];
};

function generateName(race, gender) {"Genasi (Air)": "genasi",
"Genasi (Earth)": "genasi",
"Genasi (Fire)": "genasi",
"Genasi (Water)": "genasi",
  const key = (raceMap[race] || race || "").toLowerCase().replace(/\s+|[()]/g, "");
  let entry = names[key] || names["human"]; // Fallback til human hvis race mangler
  // vælg kønspool – ellers brug begge
  let pool = (gender === "Male" && entry.male) ? entry.male
           : (gender === "Female" && entry.female) ? entry.female
           : [...(entry.male || []), ...(entry.female || [])];
  if (!pool.length) pool = ["Alex","Morgan","Rin","Kael","Rowan"]; // ekstra fallback
  const first = roll(pool);
  // hvis racen ikke har efternavne, brug humans – ellers tom streng
  const last = entry.surname?.length ? roll(entry.surname)
             : (names.human.surname ? roll(names.human.surname) : "");
  return `${first} ${last}`.trim();
}

/** ============ State / Component ============ */
function useNPC(initial) {
  const [npc, setNpc] = useState(() => initial);
  const reroll = (locks, tables) => {
    setNpc((prev) => {
      const gender = locks.gender ? prev.gender : weightedGender();
      const race = locks.race ? prev.race : weightedRoll(races, raceWeights);
      return {
        name: locks.name ? prev.name : generateName(race, gender),
        gender,
        race,
        profession: locks.profession ? prev.profession : roll(tables.professions),
        appearance: locks.appearance ? prev.appearance : roll(tables.appearances),
        speech: locks.speech ? prev.speech : roll(tables.speech),
        movement: locks.movement ? prev.movement : roll(tables.movement),
        demeanor: locks.demeanor ? prev.demeanor : roll(tables.demeanor),
      };
    });
  };
  return { npc, setNpc, reroll };
}

export default function DnDNpcGenerator({ embed = false }) {
  const { lang, setLang, tr } = useLang();
  const tables = getTables(lang);

  const [locks, setLocks] = useState({
    name: false, gender: false, race: false, profession: false, appearance: false, speech: false, movement: false, demeanor: false,
  });

  const { npc, reroll } = useNPC({
    gender: weightedGender(),
    race: weightedRoll(races, raceWeights),
    profession: roll(tables.professions),
    appearance: roll(tables.appearances),
    speech: roll(tables.speech),
    movement: roll(tables.movement),
    demeanor: roll(tables.demeanor),
    name: "",
  });

  if (!npc.name) npc.name = generateName(npc.race, npc.gender);

  const textOut = useMemo(
    () =>
      `${tr.fields.name}: ${npc.name}
${tr.fields.gender}: ${displayGenderFor(npc.race, npc.gender, tr)}
${tr.fields.race}: ${npc.race}
${tr.fields.profession}: ${npc.profession}
${tr.fields.appearance}: ${npc.appearance}
${tr.fields.speech}: ${npc.speech}
${tr.fields.movement}: ${npc.movement}
${tr.fields.demeanor}: ${npc.demeanor}`,
    [npc, tr]
  );

  const jsonOut = useMemo(() => JSON.stringify({ ...npc, displayGender: displayGenderFor(npc.race, npc.gender, tr), lang }, null, 2), [npc, tr, lang]);

  const copy = async (str) => { try { await navigator.clipboard.writeText(str); } catch {} };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!embed && (
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className={`px-2 py-1 text-xs rounded-full border ${lang==="en"?"bg-slate-700 border-slate-600":"bg-slate-900 border-slate-800"}`} onClick={()=>setLang("en")}>EN</button>
            <button className={`px-2 py-1 text-xs rounded-full border ${lang==="da"?"bg-slate-700 border-slate-600":"bg-slate-900 border-slate-800"}`} onClick={()=>setLang("da")}>DA</button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{tr.appTitle}</h1>
          <div className="text-xs opacity-70">{tr.subtitle}</div>
        </header>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldCard label={tr.fields.name} value={npc.name} locked={locks.name} onLock={() => setLocks((s) => ({ ...s, name: !s.name }))} />
        <FieldCard label={tr.fields.gender} value={displayGenderFor(npc.race, npc.gender, tr)} locked={locks.gender} onLock={() => setLocks((s) => ({ ...s, gender: !s.gender }))} />
        <FieldCard label={tr.fields.race} value={npc.race} locked={locks.race} onLock={() => setLocks((s) => ({ ...s, race: !s.race }))} />
        <FieldCard label={tr.fields.profession} value={npc.profession} locked={locks.profession} onLock={() => setLocks((s) => ({ ...s, profession: !s.profession }))} />
        <FieldCard label={tr.fields.appearance} value={npc.appearance} locked={locks.appearance} onLock={() => setLocks((s) => ({ ...s, appearance: !s.appearance }))} />
        <FieldCard label={tr.fields.speech} value={npc.speech} locked={locks.speech} onLock={() => setLocks((s) => ({ ...s, speech: !s.speech }))} />
        <FieldCard label={tr.fields.movement} value={npc.movement} locked={locks.movement} onLock={() => setLocks((s) => ({ ...s, movement: !s.movement }))} />
        <FieldCard label={tr.fields.demeanor} value={npc.demeanor} locked={locks.demeanor} onLock={() => setLocks((s) => ({ ...s, demeanor: !s.demeanor }))} />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4">
        <div>
          <button className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-900/30 active:scale-[.98]" onClick={() => reroll(locks, tables)}>{tr.buttons.roll}</button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-400">Locks:</span>
          <button
            className="px-3 py-2 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium shadow"
            onClick={() => setLocks({name:true, gender:true, race:true, profession:true, appearance:true, speech:true, movement:true, demeanor:true})}
            aria-label="Lock all fields"
          >{tr.buttons.lockAll}</button>
          <button
            className="px-3 py-2 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-medium shadow"
            onClick={() => setLocks({name:false, gender:false, race:false, profession:false, appearance:false, speech:false, movement:false, demeanor:false})}
            aria-label="Unlock all fields"
          >{tr.buttons.unlockAll}</button>
        </div>

        <div className="h-1" />

        <div className="flex flex-wrap gap-3">
  <button className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700" onClick={() => copy(textOut)}>{tr.buttons.copyText}</button>
  <button className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700" onClick={() => copy(jsonOut)}>{tr.buttons.copyJson}</button>
  <button
    className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white"
    onClick={() => copy(buildMidjourneyPrompt({ ...npc }))}
    title="Copy an English Midjourney prompt"
  >
    Copy (Midjourney)
  </button>
</div>
        
      </div>

      {!embed && (
        <section className="bg-slate-900/60 rounded-2xl p-4 space-y-4">
          <h2 className="text-lg font-semibold">{tr.outputTitle}</h2>
          <pre className="whitespace-pre-wrap text-sm bg-slate-950/60 rounded-xl p-3 border border-slate-800">{textOut}</pre>
        </section>
      )}
    </div>
  );
}

function FieldCard({ label, value, locked, onLock }) {
  return (
    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm uppercase tracking-wide text-slate-400">{label}</div>
        <button
          className={`text-xs px-2 py-1 rounded-full border ${locked ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-800 border-slate-700'} hover:opacity-90`}
          onClick={onLock}
          aria-pressed={locked}
        >{locked ? 'Locked' : 'Lock'}</button>
      </div>
      <div className="text-base sm:text-lg leading-relaxed">{value}</div>
    </div>
  );
}

// ---- Midjourney helpers (English only) ----
function seedFromString(s = "") {
  // deterministic seed so the same NPC gives similar portraits
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 99999) + 1; // 1..99999
}

function buildMidjourneyPrompt(npc) {
  // always use English terms, even if UI is DA
  const genderOut = displayGenderFor(npc.race, npc.gender, t.en); // "Unrevealed" for hidden-gender races
  const parts = [
    "fantasy character portrait, head & shoulders",
    `${npc.race} ${genderOut} ${npc.profession}`,
    `demeanor: ${npc.demeanor}`,
    `appearance details: ${npc.appearance}`,
    `speaking style: ${npc.speech}`,
    `movement vibe: ${npc.movement}`,
    "rich lighting, painterly detail, sharp focus, neutral background, subtle costume matching the role, color harmony, (no modern items), (no text)"
  ];
  const body = parts.join(", ");
  const seed = seedFromString(npc.name || `${npc.race}-${npc.profession}`);
  return `/imagine prompt: ${body} --ar 2:3 --v 6 --style raw --s 250 --seed ${seed}`;
}
