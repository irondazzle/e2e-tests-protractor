import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

export class CompetenciesGroupsPage {
  async navigate(): Promise<void> {
    await clickOnElement(getElementByText('ig-sidenav-item a', getI18nText('competencies')));
    await waitUntil(() => isDisplayed($('ig-competencies-groups-container')), false);
  }
}
