import { $, $$, ElementFinder, promise } from 'protractor';

import { clearTextField, getElementByText, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

import { BaseDialog } from '../../base-dialog.po';

export class CreateJobProfileDialog extends BaseDialog {
  private readonly $firstAutoCompleteItem: ElementFinder = $$('mat-option[role="option"]').first();
  private readonly $jobTracks: ElementFinder = this.$container.$('[formcontrolname="jobFamilyTrackId"]');
  private readonly $jobTracksFieldError: ElementFinder = this.$container.$('[e2e-id="jobTracksField"] mat-error');
  private readonly $nameField: ElementFinder = this.$container.$('[e2e-id="nameField"] input');
  private readonly $nameFieldError: ElementFinder = this.$container.$('[e2e-id="nameField"] mat-error');
  private readonly $ownerField: ElementFinder = this.$container.$('ig-users-autocomplete input');
  private readonly $ownerFieldError: ElementFinder = this.$container.$('ig-users-autocomplete mat-error');

  constructor() {
    super($('ig-create-job-profile-dialog'));
  }

  async clearOwnerField(): Promise<void> {
    await clearTextField(this.$ownerField);
    await pressEnterKey();
  }

  private getJobTrackSelector(jobTrackTitle: string): ElementFinder {
    return getElementByText('ig-chips ig-chip', jobTrackTitle, this.$jobTracks);
  }

  getJobTracksFieldErrorText(): promise.Promise<string> {
    return this.$jobTracksFieldError.getText();
  }

  getNameFieldErrorText(): promise.Promise<string> {
    return this.$nameFieldError.getText();
  }

  getNameFieldValue(): promise.Promise<string> {
    return this.$nameField.getAttribute('value');
  }

  getOwnerFieldValue(): promise.Promise<string> {
    return this.$ownerField.getAttribute('value');
  }

  getOwnerFieldErrorText(): promise.Promise<string> {
    return this.$ownerFieldError.getText();
  }

  isJobTracksDisplayed(): Promise<boolean> {
    return isDisplayed(this.$jobTracks, { withoutScroll: true });
  }

  isJobTracksFieldErrorDisplayed(): Promise<boolean>{
    return isDisplayed(this.$jobTracksFieldError, { withoutScroll: true });
  }

  async isJobTrackSelected(jobTrackTitle: string): Promise<boolean> {
    return (await this.getJobTrackSelector(jobTrackTitle).getAttribute('class')).includes('selected');
  }

  isNameFieldDisplayed(): Promise<boolean> {
    return isDisplayed(this.$nameField, { withoutScroll: true });
  }

  isNameFieldErrorDisplayed(): Promise<boolean> {
    return isDisplayed(this.$nameFieldError, { withoutScroll: true });
  }

  isOwnerFieldDisplayed(): Promise<boolean> {
    return isDisplayed(this.$ownerField, { withoutScroll: true });
  }

  isOwnerFieldErrorDisplayed(): Promise<boolean> {
    return isDisplayed(this.$ownerFieldError, { withoutScroll: true });
  }

  async setJobTrack(jobTrackTitle: string): Promise<void> {
    await this.getJobTrackSelector(jobTrackTitle).click();
  }

  async setNameFieldValue(name: string): Promise<void> {
    await this.$nameField.clear();
    await this.$nameField.sendKeys(name);
  }

  async setOwnerFieldValue(name: string): Promise<void> {
    await this.$ownerField.clear();
    await this.$ownerField.sendKeys(name);
    await this.$firstAutoCompleteItem.click();
  }
}
