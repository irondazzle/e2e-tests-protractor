import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed } from '@e2e/helpers/common-helper';

export class DefineJobTracksDialog {
  private readonly $container = $('ig-define-job-tracks-dialog');
  private readonly $jobTracksContainer = this.$container.$('[formarrayname="jobTracks"]');
  private readonly $nextButton = $('[e2e-id="nextButton"]');

  async clickOnJobTrack(jobTrackTitle: string) {
    await clickOnElement(this.getJobTrackSelector(jobTrackTitle));
  }

  async clickOnNextButton() {
    await clickOnElement(this.$nextButton);
  }

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  private getJobTrackSelector(jobTrackTitle: string) {
    return getElementByText('mat-checkbox', jobTrackTitle, this.$jobTracksContainer);
  }

  isDisplayed() {
    return isDisplayed(this.$container, { timer: true, withoutScroll: true });
  }

  isFinalStepDisplayed() {
    // NOTE animation duration of mat stepper is 500 ms
    return isDisplayed(this.$container.$('div.thirdStep-description'), { timer: 500, withoutScroll: true });
  }

  isJobLevelGragesDisplayed(jobTrackTitle: string) {
    // NOTE animation duration of mat stepper is 500 ms
    return isDisplayed(getElementByText('div.secondStep-jobTrack-name', jobTrackTitle), { timer: 500, withoutScroll: true });
  }

  async isJobTrackEnabled(jobTrackTitle: string) {
    return !(await this.getJobTrackSelector(jobTrackTitle).getAttribute('class')).includes('mat-checkbox-disabled');
  }

  async isJobTrackSelected(jobTrackTitle: string) {
     return (await this.getJobTrackSelector(jobTrackTitle).getAttribute('class')).includes('mat-checkbox-checked');
  }

  isJobTracksDisplayed() {
    return isDisplayed(this.$jobTracksContainer, { withoutScroll: true });
  }

  isNextButtonDisplayed() {
    return isDisplayed(this.$nextButton, { withoutScroll: true });
  }

  async isNextButtonEnabled() {
    const disabledValue = await this.$nextButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }
}
