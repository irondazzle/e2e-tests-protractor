import { $, ElementFinder, promise } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, isItemPresent, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { CompetenciesGroupPage } from './group.po';

export class CompetenciesGroupGeneralPage extends CompetenciesGroupPage {
  private readonly $createCompetencyButton: ElementFinder = $('[e2e-id="createCompetencyButton"]');

  async clickOnCreateCompetencyButton(): Promise<void> {
    await clickOnElement(this.$createCompetencyButton);
  }

  getOwner(): promise.Promise<string> {
    return $('ig-about-group ig-simple-user').getText();
  }

  isCompetencyCreated(name: string): Promise<boolean> {
    return isItemPresent('ig-competencies-nodes-datatable', name);
  }

  isCompetenciesDataTableDisplayed(): Promise<boolean> {
    return isDisplayed($('ig-competencies-nodes-datatable'));
  }

  isCreateCompetencyButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$createCompetencyButton);
  }

  async navigate(): Promise<void> {
    await this.isDisplayedAssert();
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('general')));
    await waitUntil(() =>  isDisplayed($('ig-general-container')), false);
  }
}
