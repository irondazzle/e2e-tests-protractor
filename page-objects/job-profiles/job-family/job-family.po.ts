import { $ } from 'protractor';

import { clickOnElement, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem } from '@e2e/helpers/menu-helper';
import { randomNumber } from '@e2e/helpers/random-helper';

import { DefineJobTracksDialog } from './define-job-tracks-dialog.po';

export class JobFamilyPage {
  private readonly $container = $('ig-job-family-container');
  private readonly $additionalActions = this.$container.$('ig-additional-actions');
  private readonly $defineJobTracksButton = this.$container.$('[e2e-id="defineJobTracksButton"]')

  async clickOnAdditionalActions() {
    await clickOnElement(this.$additionalActions);
  }

  async clickOnDefineJobTracksButton() {
    await clickOnElement(this.$defineJobTracksButton);
  }

  async defineJobTracks(jobTracks?: string[]) {
    const defineJobTracksDialog = new DefineJobTracksDialog();
    const startJobTrackIndex = randomNumber(0, 3);
    let jobTracksList: string[];

    if (jobTracks) {
      jobTracksList = jobTracks;
    } else {
      jobTracksList = [
        'Functional Leadership',
        'Management',
        'Professional',
        'Software Architecture',
        'Solution Architecture'
      ].slice(startJobTrackIndex, randomNumber(startJobTrackIndex, 4) + 2);
    }

    if (await this.isDefineJobTracksButtonDisplayed()) {
      await this.clickOnDefineJobTracksButton();
    } else {
      await this.clickOnAdditionalActions();
      await clickOnMenuItem(getI18nText('defineJobTrack'));
    }

    await waitUntil(() => defineJobTracksDialog.isDisplayed(), false);

    for (const jobTrack of jobTracksList) {
      await defineJobTracksDialog.clickOnJobTrack(jobTrack);
    }

    await defineJobTracksDialog.clickOnNextButton();

    for (const jobTrack of jobTracksList) {
      await waitUntil(() => defineJobTracksDialog.isJobLevelGragesDisplayed(jobTrack), false);
    }

    await defineJobTracksDialog.clickOnNextButton();
    await waitUntil(() => defineJobTracksDialog.isFinalStepDisplayed(), false);

    await defineJobTracksDialog.clickOnSubmitButton();
    await waitUntil(() => defineJobTracksDialog.isDisplayed(), true);

    await waitUntil(() => this.isDefineJobTracksButtonDisplayed(), true);

    return jobTracksList;
  }

  getBreadcrumbsName() {
    return this.$container.$('ig-breadcrumbs span').getText();
  }

  getHeaderName() {
    return this.$container.$('ig-page-title').getText();
  }

  isAdditionalActionsDisplayed() {
    return isDisplayed(this.$additionalActions, { withoutScroll: true });
  }

  isDefineJobTracksButtonDisplayed() {
    return isDisplayed(this.$defineJobTracksButton, { withoutScroll: true });
  }

  isDisplayed() {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  async isDisplayedAssert() {
    const isDisplayed = await this.isDisplayed();

    if (!isDisplayed) {
      throw new Error('You are not on Job Family');
    }
  }
}
