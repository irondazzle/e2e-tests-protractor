import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, isItemPresent, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { JobFamilyPage } from './job-family.po';

export class JobFamilyGeneralPage extends JobFamilyPage {
  private readonly $createJobProfileButton = $('[e2e-id="createJobProfileButton"]');
  private readonly $createJobProfileGroupButton = $('[e2e-id="createJobProfileGroupButton"]');
  private readonly $jobFamilyTracks = $('[e2e-id="jobFamilyTracks"]');

  async clickOnCreateJobProfileButton() {
    await clickOnElement(this.$createJobProfileButton);
  }

  async clickOnCreateJobProfileGroupButton() {
    await clickOnElement(this.$createJobProfileGroupButton);
  }

  getJobTracksCount() {
    return this.$jobFamilyTracks.$$('ig-values').count();
  }

  getLastModifiedDate() {
    return $('ig-about-job-family [e2e-id="lastModified"]').getText();
  }

  getOwner() {
    return $('ig-about-job-family ig-simple-user').getText();
  }

  getRequirementsCount() {
    return $('[e2e-id="requirementsCount"] div.ig-info-field-value').getText();
  }

  isCreateJobProfileButtonDisplayed() {
    return isDisplayed(this.$createJobProfileButton);
  }

  isCreateJobProfileGroupButtonDisplayed() {
    return isDisplayed(this.$createJobProfileGroupButton);
  }

  async isCreateJobProfileGroupButtonEnabled() {
    const disabledValue = await this.$createJobProfileGroupButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }

  isJobProfileCreated(name: string) {
    return isItemPresent('ig-job-profiles-datatable', name);
  }

  isJobProfileGroupCreated(name: string) {
    return isItemPresent('ig-job-profile-groups-datatable', name);
  }

  isJobProfileGroupsDataTableDisplayed() {
    return isDisplayed($('ig-job-profile-groups-datatable'));
  }

  isJobProfilesDataTableDisplayed() {
    return isDisplayed($('ig-job-profiles-datatable'));
  }

  isJobTrackDisplayed(jobTrackTitle: string){
    return isDisplayed($(`[e2e-id="${jobTrackTitle}"]`));
  }

  isJobTracksFieldDisplayed() {
    return isDisplayed(this.$jobFamilyTracks);
  }

  async navigate() {
    await this.isDisplayedAssert();
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('general')));
    await waitUntil(() =>  isDisplayed($('ig-general-container')), false);
  }
}
