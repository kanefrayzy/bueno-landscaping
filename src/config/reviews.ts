export type ReviewSource = 'Google' | 'Facebook' | 'Yelp';

export type Review = {
  name: string;
  text: string;
  source: ReviewSource;
  date: string;
  dateApprox?: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
  link?: string;
};

// Real reviews only, copied word for word from the source, with the reviewer's first name and
// last initial. Never write, edit or paraphrase a review. While this list is empty the reviews
// section is hidden. Dates are ISO (YYYY-MM-DD); Google shows only relative dates ("2 years ago"),
// so those are approximate (dateApprox) and the site shows the year only. Facebook reviews are
// recommendations without a star rating.
// Checked against screenshots on 2026-11-03 (bueno-media/reviews/screens). Google showed 4.8 from
// 65 reviews, but only 5 are visible without signing in; add more from the Google Business Profile.
export const reviews: Review[] = [
  {"name":"Bob S.","text":"Juan came to my house to remove the overgrown wisteria and thorn vines on the south side of my driveway. Juan and his team worked very hard removing all the overgrowth. Once all the vines were removed, he regraded the property to plant a natural barrier of Forsythia bushes along the driveway. Juan and his team were professional and did a great job. I am very satisfied with his work and price, I would clearly recommend him and his team for your yard issues.","source":"Google","date":"2026-06-03","dateApprox":true,"rating":5,"link":"https://www.google.com/maps?cid=4204569090947005764"},
  {"name":"Louise A.","text":"Juan and his team has done very good work for me. I definitely would recommend him.👍🏼👍🏼\nBrick work is excellent also. He's returning for additional work.\nGreat job guys 100%\nThank you very much","source":"Google","date":"2026-05-03","dateApprox":true,"rating":5,"link":"https://www.google.com/maps?cid=4204569090947005764"},
  {"name":"Thomas B.","text":"The team did a fantastic job of removing leaves and other debris from the fall and winter. They were prompt and extremely professional. Excellent service with a great price!","source":"Google","date":"2026-04-03","dateApprox":true,"rating":5,"link":"https://www.google.com/maps?cid=4204569090947005764"},
  {"name":"Anthony W.","text":"Juan and his guys are always our go to for any kind of landscaping. His prices are great, and his guys are hardworking. They did an amazing job on our front and backyard. Would definitely recommend","source":"Google","date":"2024-11-03","dateApprox":true,"rating":5,"link":"https://www.google.com/maps?cid=4204569090947005764"},
  {"name":"Keith A.","text":"In all of our years that we have had landscapers BUENO IS THE BEST!! Our property has never look so beautiful. Our neighbors have given us so many compliments. 3 have even changed to Bueno. Juan is so professional so fair in price. The work he has and will do is  10 out of 10. Thank you Juan we are above happy with your work. Monica and Keith","source":"Facebook","date":"2024-03-24","link":"https://www.facebook.com/profile.php?id=100063660936359&sk=reviews"},
  {"name":"Karren K.","text":"We went through several companies none of which come close to Bueno Landscaping. They are by far the best around, quality, price, overall work and communication. They take pride in their work and make sure you are 100% satisfied with their everything. I highly recommend them and can’t say enough good things about them.\nThanks Bueno!☀️🌿✂️🌱🌳","source":"Facebook","date":"2021-04-28","link":"https://www.facebook.com/profile.php?id=100063660936359&sk=reviews"},
  {"name":"Josephine M.","text":"Bueno did an amazing job cleaning up my daughters yard.  She had just purchased a house where nothing was done in that yard for years.  Bueno brought it to life.   They worked for hours. Bueno is reliable , trustworthy, and reasonable priced.  I highly recommend them.","source":"Facebook","date":"2020-09-16","link":"https://www.facebook.com/profile.php?id=100063660936359&sk=reviews"},
  {"name":"Lisa H.","text":"Outstanding work by Juan and his crew! Reliable, efficient and extremely hard working. They go above and beyond","source":"Facebook","date":"2019-11-30","link":"https://www.facebook.com/profile.php?id=100063660936359&sk=reviews"},
  {"name":"David H.","text":"I used Bueno landscaping to redo my whole backyard. I am very happy with the result. Juan and his crew are hard working, professional, punctual and reasonably priced. They came back after the work was done to make sure everything was going well.\nI would recommend them to friends and family and use them for future projects or maintenance.","source":"Google","date":"2018-11-03","dateApprox":true,"rating":5,"link":"https://www.google.com/maps?cid=4204569090947005764"},
];

// TODO: confirm with client: replace with the direct review link from Google Business Profile
// ("Ask for reviews"). Until then this opens the business on Google Maps.
export const reviewLink = 'https://www.google.com/maps?cid=4204569090947005764';
