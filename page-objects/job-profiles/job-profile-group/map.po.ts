import { $, ElementFinder } from 'protractor';

import { clickOnElement, getElementByText, getItemId, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { JobProfileGroupPage } from './job-profile-group.po';

export class JobProfileGroupMapPage extends JobProfileGroupPage {
  private readonly $createJobProfileButton: ElementFinder = $('[e2e-id="createJobProfileButton"] button');

  async clickOnCreateJobProfileButton(): Promise<void> {
    await clickOnElement(this.$createJobProfileButton);
  }

  getJobProfileId(name: string): Promise<string> {
    return getItemId('ig-entities-card-tile > a[href*="/job-profile/"]', name);
  }

  isCreateJobProfileButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$createJobProfileButton);
  }

  async navigate(): Promise<void> {
    await this.isDisplayedAssert();
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('groupMap')));
    await waitUntil(() =>  isDisplayed($('ig-job-profile-group-map-container')), false);
  }
}
