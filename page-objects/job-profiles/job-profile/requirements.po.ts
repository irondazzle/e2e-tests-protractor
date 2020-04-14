import { $, $$ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';
import { randomNumber } from '@e2e/helpers/random-helper';

import { EditEntityRequirementPage } from '../edit-entity-requirement.po';
import { RemoveEntityRequirementDialog } from '../remove-entity-requirement-dialog.po';

import { AddJobProfileRequirementsDialog } from './add-job-profile-requirements-dialog.po';
import { JobProfilePage } from './job-profile.po';

export class JobProfileRequirementsPage extends JobProfilePage {
  private readonly $addRequirementsButton = $('[e2e-id="addRequirementsButton"] button');

  async addRequirement(requirementPath: string[]) {
    const addJobProfileRequirementsDialog = new AddJobProfileRequirementsDialog();

    await this.clickOnAddRequirementsButton();
    await waitUntil(() => addJobProfileRequirementsDialog.isDisplayed(), false);

    for (const requirementTitle of requirementPath) {
      await addJobProfileRequirementsDialog.clickOnRequirement(requirementTitle);
    }

    await addJobProfileRequirementsDialog.clickOnSubmitButton();
    await waitUntil(() => addJobProfileRequirementsDialog.isDisplayed(), true);

    await waitUntil(() => this.isRequirementDisplayed(requirementPath[requirementPath.length - 1]), false);
  }

  async assignRequirement(requirementTitle: string) {
    const editEntityRequirementPage = new EditEntityRequirementPage();
    const jobLevelsToPSLevelsMap: Map<string, string> = new Map();
    const requirementAssignmentHash = await this.getRequirementAssignmentHash(requirementTitle);

    if (await this.isAssignButtonDisplayed(requirementTitle)) {
      await this.clickOnAssignButton(requirementTitle);
    } else {
      await this.clickOnRequirementAdditionalActions(requirementTitle);
      await waitUntil(() => isMenuItemDisplayed(getI18nText('edit')), false);

      await clickOnMenuItem(getI18nText('edit'));
    }

    await waitUntil(() => editEntityRequirementPage.isDisplayed(), false);

    await editEntityRequirementPage.clickOnNextPSLevel(0);

    const jobLevelsCount = await editEntityRequirementPage.getJobLevelsCount();

    await editEntityRequirementPage.clickOnNextPSLevel(randomNumber(0, jobLevelsCount - 1));

    for (let i = 0; i < jobLevelsCount; i++) {
      jobLevelsToPSLevelsMap.set(
        await editEntityRequirementPage.getJobLevelTitle(i),
        await editEntityRequirementPage.getPSLevelTitle(i)
      );
    }

    await editEntityRequirementPage.clickOnSubmitButton();
    await waitUntil(() => editEntityRequirementPage.isDisplayed(), true);

    await waitUntil(() => this.getRequirementAssignmentHash(requirementTitle), requirementAssignmentHash);

    return jobLevelsToPSLevelsMap;
  }

  async clickOnAddRequirementsButton() {
    await clickOnElement(this.$addRequirementsButton);
  }

  async clickOnAssignButton(requirementTitle: string) {
    await clickOnElement(getElementByText('button', getI18nText('assign'), this.getRequirementSelector(requirementTitle)));
  }

  async clickOnRequirementAdditionalActions(requirementTitle: string) {
    await clickOnElement(this.getRequirementSelector(requirementTitle).$('ig-additional-actions'));
  }

  async getRequirementAssignmentHash(requirementTitle: string) {
    const $assignments = await this.getRequirementSelector(requirementTitle).$$('ig-info-field');
    const hash = [];

    for (const $asignment of $assignments) {
      hash.push(
        await $asignment.$('.ig-info-field-name').getText(),
        await $asignment.$('.ig-info-field-value').getText()
      )
    }

    return hash.join('~');
  }

  getRequirementPSLevel(requirementTitle: string, jobLevelTitle: string) {
    return this.getRequirementSelector(requirementTitle).$(`[e2e-id="${jobLevelTitle}"] span`).getText();
  }

  private getRequirementSelector(requirementTitle: string) {
    return getElementByText('ig-entity-requirement', requirementTitle);
  }

  getRequirementsCount() {
    return $$('ig-entity-requirement').count();
  }

  isAddRequirementsButtonDisplayed() {
    return isDisplayed(this.$addRequirementsButton);
  }

  isAssignButtonDisplayed(requirementTitle: string) {
    return isDisplayed(getElementByText('button', getI18nText('assign'), this.getRequirementSelector(requirementTitle)));
  }

  isCoreRequirement(requirementTitle: string) {
    return isDisplayed(getElementByText('ig-status span', getI18nText('core'), this.getRequirementSelector(requirementTitle)));
  }

  isJobFamilyRequirement(requirementTitle: string) {
    return isDisplayed(getElementByText('ig-status span', getI18nText('jobFamily'), this.getRequirementSelector(requirementTitle)));
  }

  isRequirementAdditionalActionsDisplayed(requirementTitle: string) {
    return isDisplayed(this.getRequirementSelector(requirementTitle).$('ig-additional-actions'));
  }

  isRequirementDisplayed(requirementTitle: string) {
    return isDisplayed(this.getRequirementSelector(requirementTitle));
  }

  async navigate() {
    await this.isDisplayedAssert();
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('requirements')));
    await waitUntil(() =>  isDisplayed($('ig-requirements-container')), false);
  }

  async removeRequirement(title: string) {
    const oldRequirementsCount = await this.getRequirementsCount();
    const removeEntityRequirementDialog = new RemoveEntityRequirementDialog();

    await this.clickOnRequirementAdditionalActions(title);
    await waitUntil(() => isMenuItemDisplayed(getI18nText('remove')), false);

    await clickOnMenuItem(getI18nText('remove'));
    await waitUntil(() => removeEntityRequirementDialog.isDisplayed(), false);

    await removeEntityRequirementDialog.clickOnSubmitButton();
    await waitUntil(() => removeEntityRequirementDialog.isDisplayed(), true);

    await waitUntil(() => this.getRequirementsCount(), oldRequirementsCount);
  }
}
