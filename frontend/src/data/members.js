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
      member(
        "Adithya BA",
        "https://in.linkedin.com/in/adithya-b-a-8a450b369",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791218787/IMG-20260907-WA0020_-_Adithya_BA.webp",
      ),
      member(
        "N N Adithya Kashyap",
        "https://www.linkedin.com/in/adithya-kashyap-55aa78335",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791218928/IMG-20250926-WA0011_2_-_Adithya_Kashyap.webp",
      ),
      member(
        "Anagha PV",
        "https://www.linkedin.com/in/anagha-p-vasishta",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791219545/WhatsApp_Image_2026-10-05_at_11.20.32.webp",
      ),
      member(
        "Anshuman TB",
        "https://www.linkedin.com/in/anshuman-tb-868a053b9",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791219374/WhatsApp_Image_2026-10-05_at_22.24.53.webp",
      ),
      member(
        "Deekshith S",
        "https://www.linkedin.com/in/deekshith-s-61048b332",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791219086/IMG_20260925_080946_-_Deekshith_S.webp",
      ),
      member(
        "Lavannya V Desai",
        "https://www.linkedin.com/in/lavannya-vinod-desai-4493bb292",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791117212/IMG_20261004_163838_-_lavannya.webp",
      ),
      member(
        "N Ganesh Pai",
        "https://www.linkedin.com/in/ganesh-pai-540873382",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791218493/Ganesh_-_Ganesh_Pai.webp",
      ),
      member(
        "Maria Rebecca Fernando",
        "https://www.linkedin.com/in/rebecca-fernando-a01261331",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791218858/IMG-20250925-WA0032-1_-_rebecca_fernando.webp",
      ),
      member(
        "Prabhudev Chinivalar",
        "https://www.linkedin.com/in/prabhudev-chinivalar-08a28a35a/",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791218623/IMG_20260605_203816_-_Prabhudev_Chinivalar.webp",
      ),
      member(
        "Pavan R Gowda",
        "https://www.linkedin.com/in/pavan-r-gowda-06050135a/",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791218703/file_00000000bb948208b48fde0fb7d00bb4_-_Pavan_Gowda.webp",
      ),
      member(
        "Nihar Prasad Koundinya",
        "http://www.linkedin.com/in/nihar-prasad-koundinya-a6856636b",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791218999/photo_1_-_NIHAR_PRASAD_KOUNDINYA_24CS.webp",
      ),
      member(
        "Rekhitha R",
        "https://www.linkedin.com/in/rekhitha-rajesh-5b9380379",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791219178/3_1_-_REKHITHA_R_24CS.webp",
      ),
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
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791216131/ChatGPT_Image_Oct_5_2026_09_31_33_PM.webp",
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
      member(
        "Sinchana Suresh",
        "https://www.linkedin.com/in/sinchanasuresh/",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791212808/ss_-_SINCHANA_SURESH_24CS.webp",
      ),
    ],
  },
  {
    id: "da",
    name: "Data Analytics",
    members: [
      lead("Jaishnav"),
      member("Pruthvi"),
      member("Tarun"),
      member(
        "Akanksh Singh",
        "https://www.linkedin.com/in/akanksh-singh-1b04a6371",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791212911/WhatsApp_Image_2026-10-04_at_14.57.06.webp",
      ),
      member(
        "Harshith SR",
        "https://www.linkedin.com/in/harshith-sr-038b8637b",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791212981/IMG_20250603_092357_-_Harshith_SR.webp",
      ),
      member(
        "Poorvika Nagaraj",
        "https://www.linkedin.com/in/poorvika-nagaraj-10347a327",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791116146/IMG_20260515_095038_-_Poorvika_Nagaraj.webp",
      ),
      member(
        "R J Varsha",
        "https://www.linkedin.com/in/r-j-varsha-7a0b16332",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791217909/IMG20260904203806_-_R_J_VARSHA.webp",
      ),
      member(
        "Sanjana Devi Jothiraman",
        "https://www.linkedin.com/in/sanjana-jothiraman-379916382",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791218236/Screenshot_2026-10-04-19-28-35-49_99c04817c0de5652397fc8b56c3b3817_-_Sanjana_Devi.webp",
      ),
      member(
        "Prajna Shetty",
        "https://www.linkedin.com/in/prajna-shetty-744527316",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791217674/IMG20260330012651_-_Prajna_Shetty.webp",
      ),
      member("Swarnashree"),
      member(
        "Thrisha P",
        "https://www.linkedin.com/in/thrisha-p-7385ab399",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791218148/20260523_213311_-_THRISHA_P_24CS.webp",
      ),
      member(
        "A.K Yatin",
        "https://www.linkedin.com/in/a-k-yatin-5a46a6318",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791217782/IMG_20261004_154352_-_YATIN.webp",
      ),
      member(
        "Varsha S",
        "https://www.linkedin.com/in/varsha-s-88274839b/",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791218047/20251012_145309_-_Varsha_s.webp",
      ),
      member(
        "Ashmitha S",
        "https://www.linkedin.com/in/ashmitha-s-6052b1244",
        "https://res.cloudinary.com/vkdnztnm/image/upload/v1791218351/IMG-20241229-WA0345_-_ASHMITHA_S_24CS.webp",
      ),
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
