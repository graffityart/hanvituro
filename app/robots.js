export default function robots(){
  return {
    rules:[
      {userAgent:'*',allow:'/',disallow:['/admin/','/api/']},
      {userAgent:'Yeti',allow:'/',disallow:['/admin/','/api/']},
      {userAgent:'Googlebot',allow:'/',disallow:['/admin/','/api/']}
    ],
    sitemap:'https://www.hanvituro.kr/sitemap.xml',
    host:'https://www.hanvituro.kr'
  };
}
