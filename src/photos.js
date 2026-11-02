const venue = (src, alt, credit, sourceUrl) => ({ src, alt, credit, sourceUrl, kind: 'venue' });
const commons = (src, alt, credit, file, license, licenseUrl, kind = 'venue') => ({
  src, alt, credit, kind, sourceUrl: `https://commons.wikimedia.org/wiki/File:${file}`, license, licenseUrl,
});

export const placePhotos = {
  'tokyo-baseball': commons(
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Tokyo_Dome_%2852480559907%29.jpg/960px-Tokyo_Dome_%2852480559907%29.jpg',
    'Exterior of Tokyo Dome', 'Dick Thomas Johnson',
    'Tokyo_Dome_(52480559907).jpg', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/'),
  'fighters-baseball': venue(
    'https://www.hkdballpark.com/ogp-20240404.jpg',
    'ES CON FIELD and Hokkaido Ballpark F Village', 'Hokkaido Ballpark F Village'),
  sensoji: venue(
    'https://www.senso-ji.jp/images_en/main_img_smf01.jpg',
    'Senso-ji temple in Asakusa', 'Senso-ji'),
  tsukiji: venue(
    'https://www.tsukiji.or.jp/assets/images/english/top/slide06.jpg',
    'Tsukiji Outer Market', 'Tsukiji Outer Market'),
  harajuku: venue(
    'https://www.gotokyo.org/en/destinations/western-tokyo/harajuku/images/area031_1008_30.webp',
    'Harajuku shopping streets', 'GO TOKYO'),
  teamlab: venue(
    'https://teamlab-site.imagewave.pictures/b5EBo9Uo-OK6SM09ZTkEZQ/Yt5eET5oZzm6FBicauQUSY/width=1200,format=jpeg',
    'Digital-art installation at teamLab Borderless', 'teamLab'),
  samurai: venue(
    'https://d1s09xku4jkn9v.cloudfront.net/events/category/2020-11-13_maikoya18748.jpg',
    'Samurai experience shown on the MAIKOYA website', 'MAIKOYA'),
  sumo: commons(
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Asashoryu_fight_Jan08.JPG/960px-Asashoryu_fight_Jan08.JPG',
    'Professional sumo match; historical photo, not a confirmed 2027 event', 'Eckhard Pecher',
    'Asashoryu_fight_Jan08.JPG', 'CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0/'),
  kart: {
    src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    alt: 'Tokyo city streets; the kart tour is not pictured', credit: 'Unsplash',
    sourceUrl: 'https://unsplash.com/', kind: 'area',
  },
  aquarium: venue(
    'https://artaquarium.jp/images/home/home_mainvisual_16.webp?date=2610',
    'Live-fish exhibition at Art Aquarium', 'Art Aquarium'),
  fushimi: venue(
    'https://inari.jp/en/wp-content/uploads/2015/09/index_mainvisual.jpg',
    'Fushimi Inari Shrine', 'Fushimi Inari Taisha'),
  kiyomizu: venue(
    'https://www.kiyomizudera.or.jp/en/img/visit/pic_map_01.jpg',
    'Nio-mon gate at Kiyomizu-dera', 'Kiyomizu-dera'),
  philosopher: commons(
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Japan_Kyoto_philosophers_walk_DSC00297.jpg/960px-Japan_Kyoto_philosophers_walk_DSC00297.jpg',
    'Canal and walking path along the Philosopher’s Path', 'David Monniaux',
    'Japan_Kyoto_philosophers_walk_DSC00297.jpg', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/'),
  tea: commons(
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Matcha_Scoop.jpg/960px-Matcha_Scoop.jpg',
    'Matcha powder and a bamboo scoop; illustrative photo, not the booked tea ceremony', 'Evanhoever',
    'Matcha_Scoop.jpg', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', 'illustrative'),
  chopsticks: commons(
    'https://upload.wikimedia.org/wikipedia/commons/d/d4/Many-chopsticks.jpg',
    'Different styles of chopsticks; illustrative photo, not the workshop', 'FiveRings',
    'Many-chopsticks.jpg', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', 'illustrative'),
  nintendo: venue(
    'https://museum.nintendo.com/assets/images/index/hero/mv01_pc.webp',
    'Nintendo Museum official visitor photo', 'Nintendo Museum', 'https://museum.nintendo.com/en/'),
  railway: commons(
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Kyoto_Railway_Museum_entrance_20161017.jpg/960px-Kyoto_Railway_Museum_entrance_20161017.jpg',
    'Entrance to Kyoto Railway Museum', 'Cheng-en Cheng',
    'Kyoto_Railway_Museum_entrance_20161017.jpg', 'CC BY-SA 2.0', 'https://creativecommons.org/licenses/by-sa/2.0/'),
  higashi: venue(
    'https://www.higashihonganji.or.jp/assets/images/common/ogp.jpg',
    'Higashi Hongan-ji temple', 'Higashi Hongan-ji'),
  moiwa: venue(
    'https://mt-moiwa.jp/wp/wp-content/uploads/2026/05/top_slider_202605_img02-1600x898.jpg',
    'Mt. Moiwa ropeway official visitor photo', 'Mt. Moiwa Ropeway'),
  'beer-museum': venue(
    'https://www.sapporobeer.jp/brewery/s_museum/img/index-main_img01.jpg',
    'Sapporo Beer Museum building', 'Sapporo Breweries'),
  odori: {
    src: 'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?auto=format&fit=crop&w=1000&q=80',
    alt: 'Sapporo city view; area photo, not Nijo Market', credit: 'Unsplash',
    sourceUrl: 'https://unsplash.com/', kind: 'area',
  },
  kawaguchiko: venue(
    'https://en.kawaguchiko.net/wp-content/uploads/2017/09/churei01.jpg',
    'Mt. Fuji and Chureito Pagoda in the Fuji Five Lakes area', 'Kawaguchiko.net'),
  kamakura: venue(
    'https://res-1.cloudinary.com/jnto/image/upload/w_1000,h_667,c_fill,f_auto,fl_lossy,q_auto/v1648115811/kanagawa/H_00586-2_001',
    'Kamakura destination photo', 'Japan National Tourism Organization'),
  nikko: commons(
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/200801_Nikko_Tosho-gu_Nikko_Japan03s3.jpg/960px-200801_Nikko_Tosho-gu_Nikko_Japan03s3.jpg',
    'Toshogu Shrine in Nikko', '663highland',
    '200801_Nikko_Tosho-gu_Nikko_Japan03s3.jpg', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/'),
  odawara: commons(
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Odawara-jo.jpg/960px-Odawara-jo.jpg',
    'Odawara Castle keep', 'Akonnchiroll',
    'Odawara-jo.jpg', 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/'),
  nara: venue(
    'https://images.ctfassets.net/9uvqwr58loxx/13nMwu9Kw4SGLS7XSSIJkf/f666ed9442ecf6111719eadd1ad1c0d0/narasSacredDeer_001.jpg?fit=thumb&w=1000&h=650&q=80',
    'Deer in Nara', 'Visit Nara'),
  osaka: commons(
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Osaka_Dotonbori_Ebisu_Bridge.jpg/960px-Osaka_Dotonbori_Ebisu_Bridge.jpg',
    'Dotonbori and Ebisu Bridge in Osaka', 'Type specimen',
    'Osaka_Dotonbori_Ebisu_Bridge.jpg', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/'),
  otaru: venue(
    'https://otaru.gr.jp/wp-content/themes/otaru/img/top/slider/11/2.jpg',
    'Otaru’s North Canal', 'Otaru Tourism Association'),
  jozankei: venue(
    'https://jozankei.jp/en/wp-content/uploads/sites/2/2023/09/308251a6839252debc31380081f1678e.jpg',
    'Jozankei hot-spring area', 'Jozankei Tourist Association'),
  'tokyo-omo': venue(
    'https://media.hoshinoresorts.com/image/authenticated/s--c6VG-plO--/c_fill,g_auto,h_810,w_1440/f_auto,q_auto/v1690373127/_R8A2848%E3%83%88%E3%83%AA%E3%83%9F%E3%83%B3%E3%82%B0_etbdww.jpg',
    'OMO3 Asakusa property photo', 'Hoshino Resorts'),
  'tokyo-blossom': venue(
    'https://www.jrk-hotels.co.jp/Shinjuku/images/home/img_room_sld_1.jpg',
    'Guest room at JR Kyushu Hotel Blossom Shinjuku', 'JR Kyushu Hotels'),
  'kyoto-gate': venue(
    'https://www.gate-hotel.jp/kyoto/images/bg-top_2.jpg',
    'THE GATE HOTEL Kyoto Takasegawa property photo', 'THE GATE HOTEL'),
  'kyoto-piece': venue(
    'https://storage.googleapis.com/studio-design-asset-files/projects/p6aoZA7mqR/s-2880x1620_v-frms_webp_148986d3-98d8-441d-b67d-7fc67c183940.jpg',
    'PIECE HOSTEL SANJO property photo', 'PIECE'),
  'sapporo-knot': venue(
    'https://hotel-the-knot.jp/sapporo/wp-content/themes/wp-theme-knot-sapporo/assets/images/top_guestroom_05.jpg',
    'Guest room at THE KNOT SAPPORO', 'THE KNOT'),
  'sapporo-cross': venue(
    'https://cross-sapporo.orixhotelsandresorts.com/uploads/2023/05/kvImg01-scaled.jpg',
    'Cross Hotel Sapporo property photo', 'Cross Hotel Sapporo'),
  tsujihan: venue(
    'https://static.wixstatic.com/media/927fc6_7696ad8b15574c38b9535c17d35d1643~mv2.jpg/v1/fill/w_1000,h_650,al_c/927fc6_7696ad8b15574c38b9535c17d35d1643~mv2.jpg',
    'Seafood bowl from Tsujihan’s official website', 'Tsujihan'),
  afuri: venue(
    'https://afuri.com/img/index/photo04.jpg',
    'AFURI Harajuku branch', 'AFURI'),
  'sake-market': venue(
    'https://sakemarket.tokyo/images/sakemarket_KV_1.png',
    'Sake selection at SAKE MARKET', 'SAKE MARKET'),
  nishiki: venue(
    'https://www.kyoto-nishiki.or.jp/wp-content/themes/kyoto-nishiki/assets/img/ogp.jpg',
    'Nishiki Market official photo', 'Nishiki Market'),
  'fushimi-sake': venue(
    'https://fushimi-sakagura-kouji.com/wordpress_1803/wp-content/uploads/2023/06/test_about_image01.png',
    'Fushimi Sake Village tasting venue', 'Fushimi Sakagura Kouji'),
  ippudo: commons(
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Tonkotsu_ramen.JPG/960px-Tonkotsu_ramen.JPG',
    'Tonkotsu ramen; illustrative photo, not an IPPUDO menu item or branch', 'Schellack (Commons attribution)',
    'Tonkotsu_ramen.JPG', 'Public domain', 'https://creativecommons.org/publicdomain/mark/1.0/', 'illustrative'),
  garaku: venue(
    'https://s-garaku.com/common/img/main/top-about01.jpg',
    'GARAKU official restaurant photo', 'GARAKU'),
  daruma: venue(
    'https://sapporo-jingisukan.info/wp-content/uploads/2021/06/daruma_049-scaled.jpg',
    'Jingisukan at Daruma', 'Daruma'),
  hanamaru: venue(
    'https://www.sushi-hanamaru.com/img/index/ogp.jpg',
    'Nemuro Hanamaru official sushi restaurant photo', 'Nemuro Hanamaru'),
};
