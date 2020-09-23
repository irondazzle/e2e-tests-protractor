import { $, promise } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { JobProfilePage } from './job-profile.po';

export class JobProfileGeneralPage extends JobProfilePage {
  getLastCareerMatrixUpdate(): promise.Promise<string> {
    return $('[e2e-id="lastCareerMatrixUpdated"] div.ig-info-field-value').getText();
  }

  getOwner(): promise.Promise<string> {
    return $('ig-about-job-profile ig-simple-user').getText();
  }

  getRequirementsCount(): promise.Promise<string> {
    return $('[e2e-id="requirementsCount"] div.ig-info-field-value').getText();
  }

  async navigate(): Promise<void> {
    await this.isDisplayedAssert();
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('general')));
    await waitUntil(() =>  isDisplayed($('ig-general-container')), false);
  }
}
