import { $, ElementFinder } from 'protractor';

import {
  clickOnElement,
  generateName,
  getCurrentUsername,
  getElementByText,
  getItemId,
  isDisplayed,
  waitUntil
} from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { CreateJobFamilyDialog, JobFamilyPage } from '../job-family';

import { JobFamiliesPage } from './job-families.po';

export class MyFamiliesPage extends JobFamiliesPage {
  private readonly $createJobFamilyButton: ElementFinder = $('[e2e-id="createJobFamilyButton"]');

  async clickOnCreateJobFamilyButton(): Promise<void> {
    await clickOnElement(this.$createJobFamilyButton);
  }

  async clickOnCreateJobProfileButton(jobFamilyId: string): Promise<void> {
    await clickOnElement(this.getCreateJobProfileButtonSelector(jobFamilyId));
  }

  async createAndNavigateToJobFamily(jobFamilyName: string = generateName()): Promise<string> {
    await this.navigate();

    const createJobFamilyDialog = new CreateJobFamilyDialog();
    const ownerName: string = await getCurrentUsername();

    await this.clickOnCreateJobFamilyButton();
    await waitUntil(() => createJobFamilyDialog.isDisplayed(), false);

    await createJobFamilyDialog.setNameFieldValue(jobFamilyName);
    await createJobFamilyDialog.setOwnerFieldValue(ownerName);

    await createJobFamilyDialog.clickOnSubmitButton();
    await waitUntil(() => createJobFamilyDialog.isDisplayed(), true);

    const jobFamilyId: string = await this.getJobFamilyId(jobFamilyName);

    await this.navigateToJobFamily(jobFamilyId);

    return jobFamilyId;
  }

  private getCreateJobProfileButtonSelector(jobFamilyId: string): ElementFinder {
    return $(`[e2e-id="createJobProfileButton-${jobFamilyId}"]`);
  }

  getJobFamilyId(name: string): Promise<string> {
    return getItemId('ig-entity-card > a[href*="/job-family/"]', name);
  }

  getJobProfileId(name: string): Promise<string> {
    return getItemId('ig-entities-card-tile > a[href*="/job-profile/"]', name);
  }

  isCreateJobFamilyButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$createJobFamilyButton);
  }

  isCreateJobProfileButtonDisplayed(jobFamilyId: string): Promise<boolean> {
    return isDisplayed(this.getCreateJobProfileButtonSelector(jobFamilyId));
  }

  async isCreateJobProfileButtonEnabled(jobFamilyId: string): Promise<boolean> {
    const disabledValue: string = await this.getCreateJobProfileButtonSelector(jobFamilyId).getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }

  async navigate(): Promise<void> {
    await super.navigate();

    const $myJobFamiliesContainer: ElementFinder = $('ig-my-job-families-container');

    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('myJobFamilies')));
    await waitUntil(() => $myJobFamiliesContainer.isDisplayed(), false);
  }

  async navigateToJobFamily(id: string): Promise<void> {
    const jobFamilyPage = new JobFamilyPage();

    await clickOnElement($(`[href$="/job-family/${id}"]`));
    await waitUntil(() => jobFamilyPage.isDisplayed(), false);
  }
}
