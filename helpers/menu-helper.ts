import { $, by, ElementFinder } from 'protractor';

import { clickOnElement, isDisplayed } from './common-helper';

export async function clickOnMenuItem(itemTitle: string): Promise<void> {
  await clickOnElement(getMenuItemSelector(itemTitle));
}

function getMenuItemSelector(itemTitle: string): ElementFinder {
  return $('div[role="menu"]').element(by.cssContainingText('button', itemTitle));
}

export function isMenuItemDisplayed(itemTitle: string): Promise<boolean> {
  return isDisplayed(getMenuItemSelector(itemTitle), { timer: true, withoutScroll: true });
}

export async function isMenuItemEnabled(itemTitle: string): Promise<boolean> {
  const disabledValue: string = await getMenuItemSelector(itemTitle).getAttribute('disabled');

  return !JSON.parse(disabledValue || null);
}
