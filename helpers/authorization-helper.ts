import { $, $$, browser, ElementFinder } from 'protractor';

import { StorageKey } from '@app/models/storage-key.model';

import { clickOnElement, isDisplayed, setLocalStorageItem, waitForElement, waitUntil } from './common-helper';
import { getI18nText } from './i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from './menu-helper';

const $useAnotherAccount: ElementFinder = $('#otherTile');

export async function logIn(liveId: string, password: string): Promise<void> {
  const $confirmButton: ElementFinder = $('#idSIButton9');
  const $doNotShowCheckbox: ElementFinder = $('#KmsiCheckboxField');
  const $liveIdField: ElementFinder = $('#i0116');
  const $passwordField: ElementFinder = $('#i0118');

  //For correct Protractor waiting is necessary to setup 'waitForAngularEnabled' to 'false' before all actions
  await browser.waitForAngularEnabled(false);

  const useAnotherAccount = await isDisplayed($useAnotherAccount);

  //Basical check whether this is first login or not
  if (!useAnotherAccount) {
    await browser.get('/');
  }

  if (useAnotherAccount) {
    await $useAnotherAccount.click();
  }

  await waitForElement($liveIdField);

  await $liveIdField.sendKeys(liveId);
  await clickOnElement($confirmButton);
  await waitForElement($passwordField);
  await $passwordField.sendKeys(password);
  await clickOnElement($confirmButton);

  await waitUntil(() => $passwordField.isPresent(), true);

  if (await isDisplayed($doNotShowCheckbox, { timer: 500 })) {
    await clickOnElement($confirmButton);
  }
  //NOTE: Disabling application insights because waitForAngularEnabled continuously waits
  await setLocalStorageItem(StorageKey.AIDisabled, true);
  await waitUntil(() => isDisplayed($('ig-app')), false);
  await browser.waitForAngularEnabled(true);
}

export async function logOut(): Promise<void> {
  const $currentUser: ElementFinder = $('ig-auth-user');
  const $previousUsers: ElementFinder = $$('div[data-test-id$="intellias.com"]').get(0);

  await $currentUser.click();
  await waitUntil(() => isMenuItemDisplayed(getI18nText('logout')), false);
  await clickOnMenuItem(getI18nText('logout'));

  await browser.waitForAngularEnabled(false);

  //Added timers for better stability
  await waitUntil(() => isDisplayed($previousUsers, { timer: 800 }), false);
  await waitUntil(() => isDisplayed($useAnotherAccount, { timer: 800 }), false);
}
