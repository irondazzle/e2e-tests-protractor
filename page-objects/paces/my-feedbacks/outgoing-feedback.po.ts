import { $, ElementFinder } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

export class OugoingFeedbackPage {
  async navigate(): Promise<void> {
    const $outgoingFeedback: ElementFinder = getElementByText('ig-sidenav-item', getI18nText('outgoingFeedback'));

    if (!await isDisplayed($outgoingFeedback)) {
      await clickOnElement(getElementByText('[e2e-id="sidenav-group-name"]', getI18nText('pace')));
      await waitUntil(() => isDisplayed($outgoingFeedback), false);
    }

    await clickOnElement($outgoingFeedback);
    await waitUntil(() => isDisplayed($('ig-my-feedbacks-container')), false);
  }
}
