import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, isItemPresent, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { CompetenciesGroupPage } from './group.po';

export class CompetenciesGroupGeneralPage extends CompetenciesGroupPage {
  private readonly $createCompetencyButton = $('[e2e-id="createCompetencyButton"]');

  async clickOnCreateCompetencyButton() {
    await clickOnElement(this.$createCompetencyButton);
  }

  getOwner() {
    return $('ig-about-group ig-simple-user').getText();
  }

  isCompetencyCreated(name: string) {
    return isItemPresent('ig-competencies-nodes-datatable', name);
  }

  isCompetenciesDataTableDisplayed() {
    return isDisplayed($('ig-competencies-nodes-datatable'));
  }

  isCreateCompetencyButtonDisplayed() {
    return isDisplayed(this.$createCompetencyButton);
  }

  async navigate() {
    await this.isDisplayedAssert();
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('general')));
    await waitUntil(() =>  isDisplayed($('ig-general-container')), false);
  }
}
