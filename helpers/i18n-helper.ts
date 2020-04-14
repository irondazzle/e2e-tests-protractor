import { en } from '@app/i18n/en';

export function getI18nText(key: string, params: { [key: string]: string | number } = {}) {
  const value = key.split('.').reduce((map, keyItem) => {
    return map[keyItem];
  }, en);

  return Object.keys(params).reduce((text, param) => {
    return text.replace(`{{${param}}}`, params[param]);
  }, value);
}
