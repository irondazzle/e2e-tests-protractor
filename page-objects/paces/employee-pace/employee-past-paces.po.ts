import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { MyPacesPage } from './my-paces.po';

export class EmployeePastPacesPage extends MyPacesPage {
  private readonly $container = $('ig-past-container');

  getPastPacesCount() {
    return this.$container.$$('ig-past-pace-card').count();
  }

  async navigate() {
    await super.navigate();
    await this.navigateToPastPacesTab();
  }

  async navigateToPastPacesTab() {
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('pastPace')));
    await waitUntil(() => isDisplayed(this.$container), false);
  }
}
