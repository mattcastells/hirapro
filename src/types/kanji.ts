export type KanjiCategoryId =
  | 'numeros'
  | 'tiempo'
  | 'personas'
  | 'escuela'
  | 'direcciones'
  | 'naturaleza'
  | 'vida-diaria'
  | 'adjetivos';

export type KanjiPracticeMode =
  | 'kanji-to-meaning'
  | 'meaning-to-kanji'
  | 'kanji-to-reading'
  | 'reading-to-kanji';

export type KanjiEntry = {
  id: string;
  kanji: string;
  readings: string[];
  meaning: string;
  category: KanjiCategoryId;
  example?: string;
};

export type KanjiCategory = {
  id: KanjiCategoryId;
  label: string;
};
