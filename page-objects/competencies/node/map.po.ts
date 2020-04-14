import { $ } from 'protractor';

import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { clickOnElement, generateName, getItemId, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';

import { CreateCompetenciesNodeChildDialog } from './create-node-child-dialog.po';
import { CompetenciesNodePage } from './node.po';

export class CompetenciesNodeMapPage extends CompetenciesNodePage {
  private readonly $createChildButton = $('[e2e-id="createChildButton"]');

  async clickOnCreateChildButton() {
    await clickOnElement(this.$createChildButton);
  }

  async createAndNavigateToChild(
    psMode: ProficiencyScaleDefinitionMode = ProficiencyScaleDefinitionMode.Basic,
    childName: string = generateName()
  ) {
    await this.navigate();

    const createChildDialog = new CreateCompetenciesNodeChildDialog();

    await this.clickOnCreateChildButton();
    await waitUntil(() => createChildDialog.isDisplayed(), false);

    await createChildDialog.setNameFieldValue(childName);
    await createChildDialog.setPSMode(psMode);

    await createChildDialog.clickOnSubmitButton();
    await waitUntil(() => createChildDialog.isDisplayed(), true);

    const childId = await this.getChildId(childName);

    await this.navigateToChild(childId);

    return childId;
  }

  getChildId(name: string) {
    return getItemId('ig-entities-card-tile > a[href*="/node/"]', name);
  }

  isCreateChildButtonDisplayed() {
    return isDisplayed(this.$createChildButton);
  }

  async navigate() {
    await this.isDisplayedAssert();
    await clickOnElement($('ig-tabs-navigation a[href$="/map"]'));
    await waitUntil(() =>  isDisplayed($('ig-map-container')), false);
  }

  async navigateToChild(id: string) {
    const parents = this.getBreadcrumbsParents();
    const parentsCount = await parents.count();

    await clickOnElement($(`ig-entities-card-tile > a[href$="/node/${id}"]`));
    await waitUntil(async () => {
      return (await parents.count()) === parentsCount + 1;
    }, false);
  }
}
