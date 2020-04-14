import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { randomNumber } from '@e2e/helpers/random-helper';

import { EditEntityRequirementPage } from '../edit-entity-requirement.po';

import { AddJobFamilyRequirementsDialog } from './add-job-family-requirements-dialog.po';
import { JobFamilyPage } from './job-family.po';

export class JobFamilyRequirementsPage extends JobFamilyPage {
  private readonly $addRequirementsButton = $('[e2e-id="addRequirementsButton"] button');

  async addRequirement(jobTracks: string[] | string, requirementPath: string[]) {
    const addJobFamilyRequirementsDialog = new AddJobFamilyRequirementsDialog();
    let jobTrack: string;

    if (Array.isArray(jobTracks)) {
      jobTrack = jobTracks[randomNumber(0, jobTracks.length - 1)];
    } else {
      jobTrack = jobTracks;
    }

    await this.clickOnAddRequirementsButton();
    await waitUntil(() => addJobFamilyRequirementsDialog.isDisplayed(), false);

    await addJobFamilyRequirementsDialog.clickOnJobTrack(jobTrack);
    await addJobFamilyRequirementsDialog.clickOnNextButton();

    for (const requirementTitle of requirementPath) {
      await addJobFamilyRequirementsDialog.clickOnRequirement(requirementTitle);
    }

    await addJobFamilyRequirementsDialog.clickOnSubmitButton();
    await waitUntil(() => addJobFamilyRequirementsDialog.isDisplayed(), true);

    await waitUntil(() => this.isRequirementDisplayed(jobTrack, requirementPath[requirementPath.length - 1]), false);

    return jobTrack;
  }

  async assignRequirement(jobTrackTitle: string, requirementTitle: string) {
    const editEntityRequirementPage = new EditEntityRequirementPage();
    const jobLevelsToPSLevelsMap: Map<string, string> = new Map();
    const requirementAssignmentHash = await this.getRequirementAssignmentHash(jobTrackTitle, requirementTitle);

    await this.clickOnAssignButton(jobTrackTitle, requirementTitle);
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

    await waitUntil(() => this.getRequirementAssignmentHash(jobTrackTitle, requirementTitle), requirementAssignmentHash);

    return jobLevelsToPSLevelsMap;
  }

  async clickOnAddRequirementsButton() {
    await clickOnElement(this.$addRequirementsButton);
  }

  async clickOnAssignButton(jobTrackTitle: string, requirementTitle: string) {
    await clickOnElement(getElementByText('button', getI18nText('assign'), this.getRequirementSelector(jobTrackTitle, requirementTitle)));
  }

  async clickOnRequirementAdditionalActions(jobTrackTitle: string, requirementTitle: string) {
    await clickOnElement(this.getRequirementSelector(jobTrackTitle, requirementTitle).$('ig-additional-actions'));
  }

  async getRequirementAssignmentHash(jobTrackTitle: string, requirementTitle: string) {
    const $assignments = await this.getRequirementSelector(jobTrackTitle, requirementTitle).$$('ig-info-field');
    const hash = [];

    for (const $asignment of $assignments) {
      hash.push(
        await $asignment.$('.ig-info-field-name').getText(),
        await $asignment.$('.ig-info-field-value').getText()
      )
    }

    return hash.join('~');
  }

  getRequirementPSLevel(jobTrackTitle: string, requirementTitle: string, jobLevelTitle: string) {
    return this.getRequirementSelector(jobTrackTitle, requirementTitle).$(`[e2e-id="${jobLevelTitle}"] span`).getText();
  }

  private getRequirementSelector(jobTrackTitle: string, requirementTitle: string) {
    return getElementByText('ig-entity-requirement', requirementTitle, getElementByText('ig-job-family-track', jobTrackTitle));
  }

  getRequirementsCount(jobTrackTitle: string) {
    return getElementByText('ig-job-family-track', jobTrackTitle).$$('ig-entity-requirement').count();
  }

  isAddRequirementsButtonDisplayed() {
    return isDisplayed(this.$addRequirementsButton);
  }

  isAssignButtonDisplayed(jobTrackTitle: string, requirementTitle: string) {
    return isDisplayed(getElementByText('button', getI18nText('assign'), this.getRequirementSelector(jobTrackTitle, requirementTitle)));
  }

  isCoreRequirement(jobTrackTitle: string, requirementTitle: string) {
    return isDisplayed(getElementByText('ig-status span', getI18nText('core'), this.getRequirementSelector(jobTrackTitle, requirementTitle)));
  }

  isRequirementAdditionalActionsDisplayed(jobTrackTitle: string, requirementTitle: string) {
    return isDisplayed(this.getRequirementSelector(jobTrackTitle, requirementTitle).$('ig-additional-actions'));
  }

  isRequirementDisplayed(jobTrackTitle: string, requirementTitle: string) {
    return isDisplayed(this.getRequirementSelector(jobTrackTitle, requirementTitle));
  }

  async navigate() {
    await this.isDisplayedAssert();
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('requirements')));
    await waitUntil(() =>  isDisplayed($('ig-requirements-container')), false);
  }
}
