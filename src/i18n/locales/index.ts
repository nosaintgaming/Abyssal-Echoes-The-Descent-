import { Language, TranslationDictionary } from '../types';
import { en } from './en';
import { es } from './es';
import { ja } from './ja';
import { fr } from './fr';
import { de } from './de';
import { zh } from './zh';
import { ko } from './ko';
import { pt } from './pt';
import { ru } from './ru';
import { it } from './it';
import { pl } from './pl';
import { tr } from './tr';
import { ar } from './ar';
import { hi } from './hi';
import { uk } from './uk';

export const dictionaries: Record<Language, TranslationDictionary> = {
  en,
  es,
  ja,
  fr,
  de,
  zh,
  ko,
  pt,
  ru,
  it,
  pl,
  tr,
  ar,
  hi,
  uk,
};

export const getDictionary = (lang: Language): TranslationDictionary => {
  return dictionaries[lang] || dictionaries.en;
};
