export type songs = {
  id: string;
  title: string;
  artist: string;
};


export const song:songs[] = [
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
    }
]

const embedUrl = (song:songs) => {
    `https://www.youtube.com/embed/${song.id}`;
}

export const tumbnailUrl = (song:songs) =>{
    `https://i.ytimg.com/vi/${song.id}/maxresdefault.jpg`;
}