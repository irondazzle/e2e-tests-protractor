import { $, by } from 'protractor';

import { clickOnElement, isDisplayed } from './common-helper';

export async function clickOnMenuItem(itemTitle: string) {
  await clickOnElement(getMenuItemSelector(itemTitle));
}

function getMenuItemSelector(itemTitle: string) {
  return $('div[role="menu"]').element(by.cssContainingText('button', itemTitle));
}

export function isMenuItemDisplayed(itemTitle: string) {
  return isDisplayed(getMenuItemSelector(itemTitle), { timer: true, withoutScroll: true });
}

export async function isMenuItemEnabled(itemTitle: string) {
  const disabledValue = await getMenuItemSelector(itemTitle).getAttribute('disabled');

  return !JSON.parse(disabledValue || null);
}
