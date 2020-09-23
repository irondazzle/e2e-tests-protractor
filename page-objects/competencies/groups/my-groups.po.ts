import { $, ElementFinder } from 'protractor';

import {
  clickOnElement,
  generateName,
  getCurrentUsername,
  getElementByText,
  getItemId,
  isDisplayed,
  isItemPresent,
  waitUntil
} from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { CreateGroupDialog, CompetenciesGroupPage } from '../group';

import { CompetenciesGroupsPage } from './groups.po';

export class MyCompetenciesGroupsPage extends CompetenciesGroupsPage {
  private readonly $createGroupButton: ElementFinder = $('[e2e-id="createGroupButton"]');

  async clickOnCreateCompetencyButton(competencyGroupId: string): Promise<void> {
    await clickOnElement(this.getCreateCompetencyButtonSelector(competencyGroupId));
  }

  async clickOnCreateGroupButton(): Promise<void> {
    await clickOnElement(this.$createGroupButton);
  }

  async createAndNavigateToCompetencyGroup(
    groupName: string = generateName(),
    coeName: string = 'Engagement - IntelliGrowth',
  ): Promise<string> {
    await this.navigate();

    const createGroupDialog = new CreateGroupDialog();
    const ownerName = await getCurrentUsername();

    await this.clickOnCreateGroupButton();
    await waitUntil(() => createGroupDialog.isDisplayed(), false);

    await createGroupDialog.setNameFieldValue(groupName);
    await createGroupDialog.setCoEFieldValue(coeName);
    await createGroupDialog.setOwnerFieldValue(ownerName);

    await createGroupDialog.clickOnSubmitButton();
    await waitUntil(() => createGroupDialog.isDisplayed(), true);

    const competencyGroupId = await this.getCompetencyGroupId(groupName);

    await this.navigateToCompetencyGroup(competencyGroupId);

    return competencyGroupId;
  }

  getCompetencyGroupId(name: string): Promise<string> {
    return getItemId('ig-entity-card > a[href*="/group/"]', name);
  }

  private getCreateCompetencyButtonSelector(competencyGroupId: string): ElementFinder {
    return $(`[e2e-id="createCompetencyButton-${competencyGroupId}"]`);
  }

  isCompetencyCreated(name: string): Promise<boolean> {
    return isItemPresent('ig-competencies-nodes-card', name);
  }

  isCreateCompetencyButtonDisplayed(competencyGroupId: string): Promise<boolean> {
    return isDisplayed(this.getCreateCompetencyButtonSelector(competencyGroupId));
  }

  isCreateGroupButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$createGroupButton);
  }

  async navigate(): Promise<void> {
    await super.navigate();

    const $myGroupsContainer: ElementFinder = $('ig-my-competencies-groups-container');

    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('myGroups')));
    await waitUntil(() => isDisplayed($myGroupsContainer), false);
  }

  async navigateToCompetencyGroup(id: string): Promise<void> {
    const groupPage = new CompetenciesGroupPage();

    await clickOnElement($(`[href$="/group/${id}"]`));
    await waitUntil(() => groupPage.isDisplayed(), false);
  }
}
