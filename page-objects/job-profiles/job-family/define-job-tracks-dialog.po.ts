import { $, ElementFinder } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed } from '@e2e/helpers/common-helper';

import { BaseDialog } from '../../base-dialog.po';

export class DefineJobTracksDialog extends BaseDialog {
  private readonly $jobTracksContainer: ElementFinder = this.$container.$('[formarrayname="jobTracks"]');
  private readonly $nextButton: ElementFinder = $('[e2e-id="nextButton"]');

  constructor() {
    super($('ig-define-job-tracks-dialog'))
  }

  async clickOnJobTrack(jobTrackTitle: string): Promise<void> {
    await clickOnElement(this.getJobTrackSelector(jobTrackTitle));
  }

  async clickOnNextButton(): Promise<void> {
    await clickOnElement(this.$nextButton);
  }

  private getJobTrackSelector(jobTrackTitle: string): ElementFinder {
    return getElementByText('mat-checkbox', jobTrackTitle, this.$jobTracksContainer);
  }

  isFinalStepDisplayed(): Promise<boolean> {
    // NOTE animation duration of mat stepper is 500 ms
    return isDisplayed(this.$container.$('div.thirdStep-description'), { timer: 500, withoutScroll: true });
  }

  isJobLevelGragesDisplayed(jobTrackTitle: string): Promise<boolean> {
    // NOTE animation duration of mat stepper is 500 ms
    return isDisplayed(getElementByText('div.secondStep-jobTrack-name', jobTrackTitle), { timer: 500, withoutScroll: true });
  }

  async isJobTrackEnabled(jobTrackTitle: string): Promise<boolean> {
    return !(await this.getJobTrackSelector(jobTrackTitle).getAttribute('class')).includes('mat-checkbox-disabled');
  }

  async isJobTrackSelected(jobTrackTitle: string): Promise<boolean> {
     return (await this.getJobTrackSelector(jobTrackTitle).getAttribute('class')).includes('mat-checkbox-checked');
  }

  isJobTracksDisplayed(): Promise<boolean> {
    return isDisplayed(this.$jobTracksContainer, { withoutScroll: true });
  }

  isNextButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$nextButton, { withoutScroll: true });
  }

  async isNextButtonEnabled(): Promise<boolean> {
    const disabledValue: string = await this.$nextButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }
}
