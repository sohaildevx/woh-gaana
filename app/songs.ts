export type songs = {
  id: string;
  title: string;
  artist: string;
};


export const song:songs[] = [
    {
       id: "gaYpZ-lGhQg",
       title:"Bahut Jatate Ho Chah Humse",
       artist:"Alka Yagnik, Mohammed Aziz"
    },
    {
       id:"fBylcT-TWZw",
       title:"Ek Sanam Chahiye Aashiqui Ke Liye",
       artist:"Kumar Sanu"
    },
    {
        id:"c_K2sf6QWFY",
        title:"Mujhse Mohabbat Ka",
        artist:"Kumar Sanu"
    },
    {
        id:"qsKPEVIgrxU",
        title:"Mere Rang Mein Rangne Wali",
        artist:"S.P. Balasubrahmanyam"
    },
    {
      id:"_4Ft9UIKzwk",
      title:"Yeh Dil Deewana",
      artist:"Sonu Nigam"
    },
    {
      id:"Jtg2zyS_y_c",
      title:"Ae Kash Ke Hum",
      artist:"Kumar Sanu"
    },
    {
      id:"aj8Dsv36R1c",
      title:"Chori Chori Dil Tera Churayenge",
      artist:"Kumar Sanu, Sujata Goswamy"
    }
]

export const embedUrl = (song: songs) =>
  `https://www.youtube.com/embed/${song.id}`;

export const thumbnailUrl = (song: songs) =>
  `https://i.ytimg.com/vi/${song.id}/maxresdefault.jpg`;