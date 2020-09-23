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

import { CreateJobProfileGroupDialog, JobProfileGroupPage } from '../job-profile-group';
import { CreateJobProfileDialog, JobProfilePage } from '../job-profile';

import { JobFamilyPage } from './job-family.po';

export class JobFamilyMapPage extends JobFamilyPage {
  private readonly $createChildButton: ElementFinder = $('[e2e-id="createChildButton"]');
  private readonly $createJobProfileButton: ElementFinder = $('[e2e-id="createJobProfileButton"]');
  private readonly $createJobProfileGroupButton: ElementFinder = $('[e2e-id="createJobProfileGroupButton"]');

  async clickOnCreateChildButton(): Promise<void> {
    await clickOnElement(this.$createChildButton);
  }

  async clickOnСreateJobProfileButton(): Promise<void> {
    await clickOnElement(this.$createJobProfileButton);
  }

  async clickOnСreateJobProfileGroupButton(): Promise<void> {
    await clickOnElement(this.$createJobProfileGroupButton);
  }

  async createAndNavigateToJobProfile(jobTrack: string, jobProfileName: string = generateName()): Promise<string> {
    await this.navigate();

    const createJobProfileDialog = new CreateJobProfileDialog();
    const ownerName: string = await getCurrentUsername();

    await this.clickOnCreateChildButton();
    await waitUntil(() => this.isCreateJobProfileButtonDisplayed(), false);

    await this.clickOnСreateJobProfileButton();
    await waitUntil(() => createJobProfileDialog.isDisplayed(), false);

    await createJobProfileDialog.setNameFieldValue(jobProfileName);
    await createJobProfileDialog.setOwnerFieldValue(ownerName);
    await createJobProfileDialog.setJobTrack(jobTrack);

    await createJobProfileDialog.clickOnSubmitButton();
    await waitUntil(() => createJobProfileDialog.isDisplayed(), true);

    const jobProfileId = await this.getJobProfileId(jobProfileName);

    await this.navigateToJobProfile(jobProfileId);

    return jobProfileId;
  }

  async createAndNavigateToJobProfileGroup(jobProfileGroupName: string = generateName()): Promise<string> {
    await this.navigate();

    const createJobProfileGroupDialog = new CreateJobProfileGroupDialog();

    await this.clickOnCreateChildButton();
    await waitUntil(() => this.isCreateJobProfileGroupButtonDisplayed(), false);

    await this.clickOnСreateJobProfileGroupButton();
    await waitUntil(() => createJobProfileGroupDialog.isDisplayed(), false);

    await createJobProfileGroupDialog.setNameFieldValue(jobProfileGroupName);

    await createJobProfileGroupDialog.clickOnSubmitButton();
    await waitUntil(() => createJobProfileGroupDialog.isDisplayed(), true);

    const jobProfileGroupId: string = await this.getJobProfileGroupId(jobProfileGroupName);

    await this.navigateToJobProfileGroup(jobProfileGroupId);

    return jobProfileGroupId;
  }

  getJobProfileId(name: string): Promise<string> {
    return getItemId('ig-entities-card-tile > a[href*="/job-profile/"]', name);
  }

  getJobProfileGroupId(name: string): Promise<string> {
    return getItemId('ig-entities-card-tile > a[href*="/job-profile-group/"]', name);
  }

  isCreateChildButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$createChildButton);
  }

  async isCreateChildButtonEnabled(): Promise<boolean> {
    const disabledValue: string = await this.$createChildButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }

  isCreateJobProfileButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$createJobProfileButton, { timer: true, withoutScroll: true });
  }

  isCreateJobProfileGroupButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$createJobProfileGroupButton, { timer: true, withoutScroll: true });
  }

  async navigate(): Promise<void> {
    await this.isDisplayedAssert();
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('jobFamilyMap')));
    await waitUntil(() =>  isDisplayed($('ig-job-family-map-container')), false);
  }

  async navigateToJobProfile(id: string): Promise<void> {
    const jobProfilePage = new JobProfilePage();

    await clickOnElement($(`[href$="/job-profile/${id}"]`));
    await waitUntil(() => jobProfilePage.isDisplayed(), false);
  }

  async navigateToJobProfileGroup(id: string): Promise<void> {
    const jobProfileGroupPage = new JobProfileGroupPage();

    await clickOnElement($(`[href$="/job-profile-group/${id}"]`));
    await waitUntil(() => jobProfileGroupPage.isDisplayed(), false);
  }
}
