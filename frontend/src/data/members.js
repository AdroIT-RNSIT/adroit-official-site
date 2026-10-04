const lead = (name, linkedin, photo) => ({
  name,
  role: "Domain Lead",
  ...(linkedin ? { linkedin } : {}),
  ...(photo ? { photo } : {}),
});
const member = (name, linkedin, photo) => ({
  name,
  role: "Member",
  ...(linkedin ? { linkedin } : {}),
  ...(photo ? { photo } : {}),
});

export const memberGroups = [
  {
    id: "ml",
    name: "Machine Learning",
    members: [
      lead("Prajwal Jagadeesh"),
      member("Aneesh"),
      member("Druthi"),
      member("Adithya"),
      member("Anaga"),
      member("Anshuman"),
      member("Deekshith S"),
      member(
        "Lavannya V Desai",
        "https://www.linkedin.com/in/lavannya-vinod-desai-4493bb292",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791117212/IMG_20261004_163838_-_lavannya.webp",
      ),
      member("Ganesh"),
      member("Rebecca"),
    ],
  },
  {
    id: "cc",
    name: "Cloud Computing",
    members: [
      lead(
        "Praveen Kumar M",
        "https://www.linkedin.com/in/praveen-kumar-m-880952246/",
        "https://res.cloudinary.com/vkdnztnm/image/upload/c_fill,g_face,w_800,h_800,f_auto,q_auto/v1791093568/WhatsApp_Image_2026-10-01_at_16.49.50_1.webp",
      ),
      member("Ifrah"),
      member(
        "Sudhanva Muralidharan",
        "https://www.linkedin.com/in/sudhanva-muralidharan-666193248/",
        "https://res.cloudinary.com/vkdnztnm/image/upload/c_fill,g_face,w_800,h_800,f_auto,q_auto/v1791093041/WhatsApp_Image_2026-10-04_at_10.59.02.webp",
      ),
      member(
        "Shitanshu Kumar",
        "https://www.linkedin.com/in/shitanshukumar607",
        "https://res.cloudinary.com/vkdnztnm/image/upload/c_fill,g_face,w_800,h_800,f_auto,q_auto/v1791092709/WhatsApp_Image_2026-10-04_at_11.08.55.webp",
      ),
      member(
        "Kartikeya Somayaji Dhavala",
        "https://www.linkedin.com/in/dhavalakartikeyasomayaji/",
        "https://res.cloudinary.com/vkdnztnm/image/upload/c_fill,g_face,w_800,h_800,f_auto,q_auto/v1791094758/WhatsApp_Image_2026-10-04_at_11.43.11.webp",
      ),
      member(
        "Divyashree S",
        "https://www.linkedin.com/in/divyashree-s-60260b328",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791095762/WhatsApp_Image_2026-10-04_at_11.59.31_1.webp",
      ),
      member(
        "Anoushka Kanchi",
        "https://www.linkedin.com/in/anoushka-kanchi-a20105379",
        "https://res.cloudinary.com/vkdnztnm/image/upload/c_fill,g_face,w_800,h_800,f_auto,q_auto/v1791094083/WhatsApp_Image_2026-10-04_at_11.18.41.webp",
      ),
      member("Raashi"),
      member("Shahzaib Ali Khan"),
    ],
  },
  {
    id: "cy",
    name: "Cybersecurity",
    members: [
      lead(
        "Sanjay N",
        "https://www.linkedin.com/in/sanjuio/",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791117802/WhatsApp_Image_2026-10-04_at_18.12.23.webp",
      ),
      member(
        "कृष्ण",
        "https://www.linuxfoundation.org/projects#idontuselinkedinLOL",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791117286/Linux_mascot_tux_-_Hello.webp",
      ),
      member(
        "Jayasakthi PV",
        "https://www.linkedin.com/in/jayasakthi-pv-41015a412",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791097671/WhatsApp_Image_2026-10-04_at_10.28.20.webp",
      ),
      member("Likhit"),
      member(
        "Chandranshu Kumar",
        "https://www.linkedin.com/in/chandranshu-kumar-23670b31a",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791116950/1RX24CS052_-_CHANDRANSHU_KUMAR_24CS.webp",
      ),
      member(
        "Krish Jaiswal",
        "https://www.linkedin.com/in/krish-jaiswal-375313384",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791116830/20260818_085332_-_KRISH_JAISWAL_25CS.webp",
      ),
      member(
        "Dhanush V",
        "https://www.linkedin.com/in/dhanush-v-49b404330",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791117134/Screenshot_20261004_153023_Gallery_-_DHANUSH_V_24CS.webp",
      ),
      member(
        "Anshika Gupta",
        "https://www.linkedin.com/in/anshika-gupta-26611b313",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791117033/IMG-20260129-WA0195_2_-_ANSHIKA_GUPTA_24CS.webp",
      ),
      member("Amrutha"),
      member("Sinchana"),
    ],
  },
  {
    id: "da",
    name: "Data Analytics",
    members: [
      lead("Jaishnav"),
      member("Pruthvi"),
      member("Tarun"),
      member("Akanksh"),
      member("Poorvika"),
      member("RJ Varsha"),
      member("Sanjana Devi"),
      member("Prajna Shetty"),
      member("Swarnashree"),
      member("Thrisha P"),
      member("Yatin"),
      member("Varsha"),
    ],
  },
  {
    id: "nt",
    name: "Non-Tech",
    members: [
      lead(
        "Poorvika Nagaraj",
        "https://www.linkedin.com/in/poorvika-nagaraj-10347a327",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791116146/IMG_20260515_095038_-_Poorvika_Nagaraj.webp",
      ),
      member("Keerthana B"),
      member(
        "Jayasakthi PV",
        "https://www.linkedin.com/in/jayasakthi-pv-41015a412",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791097671/WhatsApp_Image_2026-10-04_at_10.28.20.webp",
      ),
      member("Ananya R"),
      member(
        "Aneesha S H",
        "https://www.linkedin.com/in/aneesha-hublikar-b0389237a",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791116388/IMG-20260720-WA0023_-_Aneesha_Hublikar.webp",
      ),
      member(
        "Ranjitha N",
        "https://www.linkedin.com/in/ranjitha-n-baa54537b/",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791116073/IMG-20261004-WA0019_-_RANJITHA_N_24CS.webp",
      ),
      member(
        "Utkarsh Naman",
        "https://www.linkedin.com/in/utkarsh-naman-7406b3392",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791115825/IMG_20261003_222741550_-_Utkarsh_Naman.webp",
      ),
      member(
        "Thanmayee",
        "https://www.linkedin.com/in/thanmayee-u-930360380",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791116299/file_00000000cf3882118185af9b5c12774b_-_Thanu.webp",
      ),
      member(
        "Nischal S Kumar",
        "https://www.linkedin.com/in/nischalskumar",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791116223/IMG_1689_-_Nischal_S.webp",
      ),
      member(
        "Isita Mazumder",
        "https://www.linkedin.com/in/isita-mazumder13/",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791115923/1RX24CS101_-_ISITA_MAZUMDER_24CS.webp",
      ),
      member(
        "Gaayana K",
        "https://www.linkedin.com/in/gaayanaksn",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791116002/IMG_1357_-_GAAYANA_KSN.webp",
      ),
    ],
  },
];
