import { $, ElementFinder } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

export class MyPacesPage {
  async navigate(): Promise<void> {
    const $myPace: ElementFinder = getElementByText('ig-sidenav-item', getI18nText('myPace'));

    if (!await isDisplayed($myPace)) {
      await clickOnElement(getElementByText('[e2e-id="sidenav-group-name"]', getI18nText('pace')));
      await waitUntil(() => isDisplayed($myPace), false);
    }

    await clickOnElement($myPace);
    await waitUntil(() => isDisplayed($('ig-my-paces-container')), false);
  }
}
