import { $, ElementFinder } from 'protractor';

import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import {
  clickOnElement,
  generateName,
  getElementByText,
  getItemId,
  isDisplayed,
  waitUntil
} from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { CompetenciesNodePage, CreateCompetenciesGroupChildDialog } from '../node';

import { CompetenciesGroupPage } from './group.po';

export class CompetenciesGroupMapPage extends CompetenciesGroupPage {
  private readonly $createCompetencyButton: ElementFinder = $('[e2e-id="createCompetencyButton"]');

  async clickOnCreateCompetencyButton(): Promise<void> {
    await clickOnElement(this.$createCompetencyButton);
  }

  async createAndNavigateToCompetency(
    psMode: ProficiencyScaleDefinitionMode = ProficiencyScaleDefinitionMode.Basic,
    competencyName: string = generateName()
  ): Promise<string> {
    await this.navigate();

    const createCompetencyDialog = new CreateCompetenciesGroupChildDialog();
    await this.clickOnCreateCompetencyButton();
    await waitUntil(() => createCompetencyDialog.isDisplayed(), false);

    await createCompetencyDialog.setNameFieldValue(competencyName);
    await createCompetencyDialog.setPSMode(psMode);

    await createCompetencyDialog.clickOnSubmitButton();
    await waitUntil(() => createCompetencyDialog.isDisplayed(), true);

    const competencyId = await this.getCompetencyId(competencyName);

    await this.navigateToCompetency(competencyId);

    return competencyId;
  }

  getCompetencyId(name: string): Promise<string> {
    return getItemId('ig-entities-card-tile > a[href*="/node/"]', name);
  }

  isCreateCompetencyButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$createCompetencyButton);
  }

  async navigate(): Promise<void> {
    await this.isDisplayedAssert();
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('groupMap')));
    await waitUntil(() =>  isDisplayed($('ig-map-container')), false);
  }

  async navigateToCompetency(id: string): Promise<void> {
    const competencyPage = new CompetenciesNodePage();

    await clickOnElement($(`[href$="/node/${id}"]`));
    await waitUntil(() => competencyPage.isDisplayed(), false);
  }
}
