import { $, ElementFinder } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, isItemPresent, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { JobProfileGroupPage } from './job-profile-group.po';

export class JobProfileGroupGeneralPage extends JobProfileGroupPage {
  private readonly $createJobProfileButton: ElementFinder = $('[e2e-id="createJobProfileButton"]');

  async clickOnCreateJobProfileButton(): Promise<void> {
    await clickOnElement(this.$createJobProfileButton);
  }

  isCreateJobProfileButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$createJobProfileButton);
  }

  isJobProfileCreated(name: string): Promise<boolean> {
    return isItemPresent('ig-job-profiles-datatable', name);
  }

  isJobProfilesDataTableDisplayed(): Promise<boolean> {
    return isDisplayed($('ig-job-profiles-datatable'));
  }

  async navigate(): Promise<void> {
    await this.isDisplayedAssert();
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('general')));
    await waitUntil(() =>  isDisplayed($('ig-general-container')), false);
  }
}
