import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

export class JobFamiliesPage {
  async navigate() {
    await clickOnElement(getElementByText('ig-sidenav-item a', getI18nText('jobProfiles')));
    await waitUntil(() => isDisplayed($('ig-job-families-container')), false);
  }
}
