import { KanaScript } from '../types/game';

export type PhraseEntry = {
  id: string;
  kana: string;
  romaji: string;
  translation: string;
  script: KanaScript;
};

const hiraganaPhrasesData: [string, string, string][] = [
  ['おはようございます', 'ohayou gozaimasu', 'Buenos días (formal)'],
  ['こんにちは', 'konnichiwa', 'Hola / Buenas tardes'],
  ['こんばんは', 'konbanwa', 'Buenas noches (saludo)'],
  ['おやすみなさい', 'oyasuminasai', 'Buenas noches (despedida)'],
  ['ありがとうございます', 'arigatou gozaimasu', 'Muchas gracias'],
  ['すみません', 'sumimasen', 'Disculpe / Perdón'],
  ['おねがいします', 'onegaishimasu', 'Por favor'],
  ['いただきます', 'itadakimasu', 'Buen provecho'],
  ['ごちそうさまでした', 'gochisousamadeshita', 'Gracias por la comida'],
  ['はじめまして', 'hajimemashite', 'Mucho gusto'],
  ['おげんきですか', 'ogenkidesuka', '¿Cómo estás?'],
  ['げんきです', 'genkidesu', 'Estoy bien'],
  ['わたしはがくせいです', 'watashiwagakuseidesu', 'Soy estudiante'],
  ['にほんごをべんきょうします', 'nihongwobenkyoushimasu', 'Estudio japonés'],
  ['これはなんですか', 'korewanandesuka', '¿Qué es esto?'],
  ['それはほんです', 'sorehahondesu', 'Eso es un libro'],
  ['どこにいきますか', 'dokoniikimasuka', '¿A dónde vas?'],
  ['がっこうにいきます', 'gakkouniikimasu', 'Voy a la escuela'],
  ['なまえはなんですか', 'namaehanandesuka', '¿Cuál es tu nombre?'],
  ['おいしいです', 'oishiidesu', 'Está delicioso'],
  ['たのしいです', 'tanoshiidesu', 'Es divertido'],
  ['きょうはいいてんきです', 'kyouhaiitenki desu', 'Hoy hace buen tiempo'],
  ['みずをください', 'mizuwokudasai', 'Agua por favor'],
  ['ともだちにあいます', 'tomodachiniaimasu', 'Me encuentro con un amigo'],
  ['まいにちべんきょうします', 'mainichibenkyoushimasu', 'Estudio todos los días'],
  ['いっしょにいきましょう', 'isshoniikimashou', 'Vamos juntos'],
  ['おかあさんがすきです', 'okaasangasukidesu', 'Quiero a mamá'],
  ['ねこがいます', 'nekogaimasu', 'Hay un gato'],
  ['いぬがすきです', 'inugasukidesu', 'Me gustan los perros'],
  ['あしたはやすみです', 'ashitahayasumidesu', 'Mañana es día libre'],
  ['ごはんをたべます', 'gohanwotabemasu', 'Como arroz / Como comida'],
  ['おちゃをのみます', 'ochawonomimasu', 'Tomo té'],
  ['でんしゃにのります', 'denshaninirimasu', 'Tomo el tren'],
  ['えいがをみます', 'eigawomimasu', 'Veo una película'],
  ['おんがくをききます', 'ongakuwokikimasu', 'Escucho música'],
  ['さんぽをします', 'sanpowoshimasu', 'Doy un paseo'],
  ['てがみをかきます', 'tegamiwokakimasu', 'Escribo una carta'],
  ['しゃしんをとります', 'shashinwotorimasu', 'Tomo una foto'],
  ['かいものにいきます', 'kaimoninikimasu', 'Voy de compras'],
  ['としょかんでべんきょうします', 'toshokandebenkyoushimasu', 'Estudio en la biblioteca'],
  ['たなかさんはせんせいです', 'tanakasanhasenseidesu', 'Tanaka es profesor'],
  ['にほんにいきたいです', 'nihonniikitaidesu', 'Quiero ir a Japón'],
  ['しごとがおわりました', 'shigotogaowarimashita', 'El trabajo terminó'],
  ['あたらしいくつをかいました', 'atarashiikutsuwokaimashita', 'Compré zapatos nuevos'],
  ['きのうはあめでした', 'kinouhaame deshita', 'Ayer llovió'],
  ['まいあさはしります', 'maiasahashirimasu', 'Corro todas las mañanas'],
  ['よるはほんをよみます', 'yoruhahonwoyomimasu', 'Leo libros por la noche'],
  ['うみにいきたいです', 'uminiikitaidesu', 'Quiero ir al mar'],
  ['やまがきれいです', 'yamagakireidesu', 'La montaña es bonita'],
  ['かぞくとあそびます', 'kazokutoasobimasu', 'Juego con la familia'],
];

const katakanaPhraseData: [string, string, string][] = [
  ['コーヒーをください', 'koohiiwokudasai', 'Café por favor'],
  ['レストランにいきます', 'resutoranniikimasu', 'Voy al restaurante'],
  ['テレビをみます', 'terebiwomimasu', 'Veo televisión'],
  ['パソコンをつかいます', 'pasokonwotukaimasu', 'Uso la computadora'],
  ['メニューをください', 'menyuuwokudasai', 'El menú por favor'],
  ['タクシーにのります', 'takushiininirimasu', 'Tomo un taxi'],
  ['ホテルにとまります', 'hoterunitomarimasu', 'Me quedo en un hotel'],
  ['スーパーにいきます', 'suupaaniikimasu', 'Voy al supermercado'],
  ['アイスクリームがすき', 'aisukuriimu ga suki', 'Me gusta el helado'],
  ['サッカーをします', 'sakkaawoshimasu', 'Juego fútbol'],
  ['インターネットをつかいます', 'intaanettowotukaimasu', 'Uso internet'],
  ['チョコレートをたべます', 'chokoreeto wo tabemasu', 'Como chocolate'],
  ['ビールをのみます', 'biiruwonomimasu', 'Tomo cerveza'],
  ['バスにのります', 'basuninirimasu', 'Tomo el autobús'],
  ['カメラをもっています', 'kamerawomotteimasu', 'Tengo una cámara'],
  ['ノートにかきます', 'nootoni kakimasu', 'Escribo en el cuaderno'],
  ['ペンをかします', 'penwokashimasu', 'Presto un bolígrafo'],
  ['テストがあります', 'tesutogaarimasu', 'Hay un examen'],
  ['プレゼントをもらいました', 'purezentowomoraimashita', 'Recibí un regalo'],
  ['ニュースをみます', 'nyuusuwomimasu', 'Veo las noticias'],
];

function createPhraseEntry(
  data: [string, string, string],
  index: number,
  script: KanaScript,
): PhraseEntry {
  return {
    id: `${script}-phrase-${index}`,
    kana: data[0],
    romaji: data[1],
    translation: data[2],
    script,
  };
}

const hiraPhrases = hiraganaPhrasesData.map((data, index) =>
  createPhraseEntry(data, index, 'hiragana'),
);

const kataPhrases = katakanaPhraseData.map((data, index) =>
  createPhraseEntry(data, index, 'katakana'),
);

export function getPhrases(script: KanaScript): PhraseEntry[] {
  return script === 'hiragana' ? hiraPhrases : kataPhrases;
}
