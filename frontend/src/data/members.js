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
      member("Lavanya"),
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
      lead("Sanjay"),
      member("Krishna"),
      member("Jaysakthi"),
      member("Likhit"),
      member("Chandranshu"),
      member("Krish Jaiswal"),
      member("Dhanush"),
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
      lead("Poorvika"),
      member("Keerthana B"),
      member("Ananya R"),
      member("Aneesha"),
      member("Ranjitha"),
      member("Utkarsh Naman"),
      member("Thanmaye"),
      member("Nischal"),
    ],
  },
];
