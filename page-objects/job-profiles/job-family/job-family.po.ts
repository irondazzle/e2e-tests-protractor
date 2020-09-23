import { $, ElementFinder, promise } from 'protractor';

import { clickOnElement, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem } from '@e2e/helpers/menu-helper';
import { randomNumber } from '@e2e/helpers/random-helper';

import { DefineJobTracksDialog } from './define-job-tracks-dialog.po';

export class JobFamilyPage {
  private readonly $container: ElementFinder = $('ig-job-family-container');
  private readonly $additionalActions: ElementFinder = this.$container.$('ig-additional-actions');
  private readonly $defineJobTracksButton: ElementFinder = this.$container.$('[e2e-id="defineJobTracksButton"]')

  async clickOnAdditionalActions(): Promise<void> {
    await clickOnElement(this.$additionalActions);
  }

  async clickOnDefineJobTracksButton(): Promise<void> {
    await clickOnElement(this.$defineJobTracksButton);
  }

  async defineJobTracks(jobTracks?: string[]): Promise<string[]> {
    const defineJobTracksDialog = new DefineJobTracksDialog();
    const startJobTrackIndex: number = randomNumber(0, 3);
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

  getBreadcrumbsName(): promise.Promise<string> {
    return this.$container.$('ig-breadcrumbs span').getText();
  }

  getHeaderName(): promise.Promise<string> {
    return this.$container.$('ig-page-title').getText();
  }

  isAdditionalActionsDisplayed(): Promise<boolean> {
    return isDisplayed(this.$additionalActions, { withoutScroll: true });
  }

  isDefineJobTracksButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$defineJobTracksButton, { withoutScroll: true });
  }

  isDisplayed(): Promise<boolean> {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  async isDisplayedAssert(): Promise<void> {
    const isDisplayed = await this.isDisplayed();

    if (!isDisplayed) {
      throw new Error('You are not on Job Family');
    }
  }
}
