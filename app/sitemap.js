export default function sitemap(){
  const base='https://www.hanvituro.kr';
  return [
    {url:`${base}/`,lastModified:new Date(),changeFrequency:'daily',priority:1},
    {url:`${base}/notice`,lastModified:new Date(),changeFrequency:'weekly',priority:0.7}
  ];
}
