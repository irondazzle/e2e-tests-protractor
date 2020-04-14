import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed } from '@e2e/helpers/common-helper';

export class AddJobFamilyRequirementsDialog {
  private readonly $container = $('ig-add-job-family-requirements-dialog');
  private readonly $jobTracksContainer = this.$container.$('mat-dialog-content');
  private readonly $nextButton = this.$container.$('[e2e-id="nextButton"]');
  private readonly $submitButton = this.$container.$('[type="submit"]');

  async clickOnJobTrack(jobTrackTitle: string) {
    await clickOnElement(this.getJobTrackSelector(jobTrackTitle));
  }

  async clickOnNextButton() {
    await clickOnElement(this.$nextButton);
  }

  async clickOnRequirement(requirementTitle: string) {
    await clickOnElement(this.getRequirementSelector(requirementTitle));
  }

  async clickOnSubmitButton() {
    await clickOnElement(this.$submitButton);
  }

  private getJobTrackSelector(jobTrackTitle: string) {
    return getElementByText('mat-radio-button', jobTrackTitle, this.$jobTracksContainer);
  }

  getNavigationText() {
    return this.$container.$('ig-navigation span.requirement-body-name').getText();
  }

  getNavigationSuffixText() {
    return this.$container.$('ig-navigation span.type').getText();
  }

  private getRequirementSelector(requirementTitle: string) {
    return getElementByText('[e2e-type="requirement"] span.requirement-body-name', requirementTitle, this.$container);
  }

  isDisplayed() {
    return isDisplayed(this.$container, { timer: true, withoutScroll: true });
  }

  async isJobTrackSelected(jobTrackTitle: string) {
     return (await this.getJobTrackSelector(jobTrackTitle).getAttribute('class')).includes('mat-radio-checked');
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

  isRequirementDisplayed(requirementTitle: string) {
    return isDisplayed(this.getRequirementSelector(requirementTitle));
  }

  async isRequirementEnabled(requirementTitle: string) {
    return !(await getElementByText('ig-selectable-requirement', requirementTitle).$('mat-checkbox').getAttribute('class')).includes('mat-checkbox-disabled');
  }

  async isRequirementSelected(requirementTitle: string) {
    return (await getElementByText('ig-selectable-requirement', requirementTitle).$('mat-checkbox').getAttribute('class')).includes('mat-checkbox-checked');
  }

  async isSubmitButtonEnabled() {
    const disabledValue = await this.$submitButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }
}
