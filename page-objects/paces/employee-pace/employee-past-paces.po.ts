import { $, ElementFinder, promise } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { MyPacesPage } from './my-paces.po';

export class EmployeePastPacesPage extends MyPacesPage {
  private readonly $container: ElementFinder = $('ig-past-container');

  getPastPacesCount(): promise.Promise<number> {
    return this.$container.$$('ig-past-pace-card').count();
  }

  async navigate(): Promise<void> {
    await super.navigate();
    await this.navigateToPastPacesTab();
  }

  async navigateToPastPacesTab(): Promise<void> {
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('pastPace')));
    await waitUntil(() => isDisplayed(this.$container), false);
  }
}
