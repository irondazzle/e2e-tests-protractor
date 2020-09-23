import { $, ElementFinder, promise } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, isItemPresent, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { JobFamilyPage } from './job-family.po';

export class JobFamilyGeneralPage extends JobFamilyPage {
  private readonly $createJobProfileButton: ElementFinder = $('[e2e-id="createJobProfileButton"]');
  private readonly $createJobProfileGroupButton: ElementFinder = $('[e2e-id="createJobProfileGroupButton"]');
  private readonly $jobFamilyTracks: ElementFinder = $('[e2e-id="jobFamilyTracks"]');

  async clickOnCreateJobProfileButton(): Promise<void> {
    await clickOnElement(this.$createJobProfileButton);
  }

  async clickOnCreateJobProfileGroupButton(): Promise<void> {
    await clickOnElement(this.$createJobProfileGroupButton);
  }

  getJobTracksCount(): promise.Promise<number> {
    return this.$jobFamilyTracks.$$('ig-values').count();
  }

  getLastModifiedDate(): promise.Promise<string> {
    return $('ig-about-job-family [e2e-id="lastModified"]').getText();
  }

  getOwner(): promise.Promise<string> {
    return $('ig-about-job-family ig-simple-user').getText();
  }

  getRequirementsCount(): promise.Promise<string> {
    return $('[e2e-id="requirementsCount"] div.ig-info-field-value').getText();
  }

  isCreateJobProfileButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$createJobProfileButton);
  }

  isCreateJobProfileGroupButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$createJobProfileGroupButton);
  }

  async isCreateJobProfileGroupButtonEnabled(): Promise<boolean> {
    const disabledValue: string = await this.$createJobProfileGroupButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }

  isJobProfileCreated(name: string): Promise<boolean> {
    return isItemPresent('ig-job-profiles-datatable', name);
  }

  isJobProfileGroupCreated(name: string): Promise<boolean> {
    return isItemPresent('ig-job-profile-groups-datatable', name);
  }

  isJobProfileGroupsDataTableDisplayed(): Promise<boolean> {
    return isDisplayed($('ig-job-profile-groups-datatable'));
  }

  isJobProfilesDataTableDisplayed(): Promise<boolean> {
    return isDisplayed($('ig-job-profiles-datatable'));
  }

  isJobTrackDisplayed(jobTrackTitle: string): Promise<boolean> {
    return isDisplayed($(`[e2e-id="${jobTrackTitle}"]`));
  }

  isJobTracksFieldDisplayed(): Promise<boolean> {
    return isDisplayed(this.$jobFamilyTracks);
  }

  async navigate(): Promise<void> {
    await this.isDisplayedAssert();
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('general')));
    await waitUntil(() =>  isDisplayed($('ig-general-container')), false);
  }
}
