import { $, $$ } from 'protractor';

import { clearTextField, clickOnElement, getElementByText, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

export class CreateJobProfileDialog {
  private readonly $container = $('ig-create-job-profile-dialog');
  private readonly $firstAutoCompleteItem = $$('mat-option[role="option"]').first();
  private readonly $jobTracks = this.$container.$('[formcontrolname="jobFamilyTrackId"]');
  private readonly $jobTracksFieldError = this.$container.$('[e2e-id="jobTracksField"] mat-error');
  private readonly $nameField = this.$container.$('[e2e-id="nameField"] input');
  private readonly $nameFieldError = this.$container.$('[e2e-id="nameField"] mat-error');
  private readonly $ownerField = this.$container.$('ig-users-autocomplete input');
  private readonly $ownerFieldError = this.$container.$('ig-users-autocomplete mat-error');

  async clearOwnerField() {
    await clearTextField(this.$ownerField);
    await pressEnterKey();
  }

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  private getJobTrackSelector(jobTrackTitle: string) {
    return getElementByText('ig-chips ig-chip', jobTrackTitle, this.$jobTracks);
  }

  getJobTracksFieldErrorText() {
    return this.$jobTracksFieldError.getText();
  }

  getNameFieldErrorText() {
    return this.$nameFieldError.getText();
  }

  getNameFieldValue() {
    return this.$nameField.getAttribute('value');
  }

  getOwnerFieldValue() {
    return this.$ownerField.getAttribute('value');
  }

  getOwnerFieldErrorText() {
    return this.$ownerFieldError.getText();
  }

  isDisplayed() {
    return isDisplayed(this.$container, { timer: true, withoutScroll: true });
  }

  isJobTracksDisplayed() {
    return isDisplayed(this.$jobTracks, { withoutScroll: true });
  }

  isJobTracksFieldErrorDisplayed() {
    return isDisplayed(this.$jobTracksFieldError, { withoutScroll: true });
  }

  async isJobTrackSelected(jobTrackTitle: string) {
    return (await this.getJobTrackSelector(jobTrackTitle).getAttribute('class')).includes('selected');
  }

  isNameFieldDisplayed() {
    return isDisplayed(this.$nameField, { withoutScroll: true });
  }

  isNameFieldErrorDisplayed() {
    return isDisplayed(this.$nameFieldError, { withoutScroll: true });
  }

  isOwnerFieldDisplayed() {
    return isDisplayed(this.$ownerField, { withoutScroll: true });
  }

  isOwnerFieldErrorDisplayed() {
    return isDisplayed(this.$ownerFieldError, { withoutScroll: true });
  }

  async setJobTrack(jobTrackTitle: string) {
    await this.getJobTrackSelector(jobTrackTitle).click();
  }

  async setNameFieldValue(name: string) {
    await this.$nameField.clear();
    await this.$nameField.sendKeys(name);
  }

  async setOwnerFieldValue(name: string) {
    await this.$ownerField.clear();
    await this.$ownerField.sendKeys(name);
    await this.$firstAutoCompleteItem.click();
  }
}
