import { $, ElementFinder, promise } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed } from '@e2e/helpers/common-helper';

import { BaseDialog } from '../../base-dialog.po';

export class AddJobFamilyRequirementsDialog extends BaseDialog {
  private readonly $jobTracksContainer: ElementFinder = this.$container.$('mat-dialog-content');
  private readonly $nextButton: ElementFinder = this.$container.$('[e2e-id="nextButton"]');

  constructor() {
    super($('ig-add-job-family-requirements-dialog'));
  }

  async clickOnJobTrack(jobTrackTitle: string): Promise<void> {
    await clickOnElement(this.getJobTrackSelector(jobTrackTitle));
  }

  async clickOnNextButton(): Promise<void> {
    await clickOnElement(this.$nextButton);
  }

  async clickOnRequirement(requirementTitle: string): Promise<void> {
    await clickOnElement(this.getRequirementSelector(requirementTitle));
  }

  private getJobTrackSelector(jobTrackTitle: string): ElementFinder {
    return getElementByText('mat-radio-button', jobTrackTitle, this.$jobTracksContainer);
  }

  getNavigationText(): promise.Promise<string> {
    return this.$container.$('ig-navigation span.requirement-body-name').getText();
  }

  getNavigationSuffixText(): promise.Promise<string> {
    return this.$container.$('ig-navigation span.type').getText();
  }

  private getRequirementSelector(requirementTitle: string): ElementFinder {
    return getElementByText('[e2e-type="requirement"] span.requirement-body-name', requirementTitle, this.$container);
  }

  async isJobTrackSelected(jobTrackTitle: string): Promise<boolean> {
     return (await this.getJobTrackSelector(jobTrackTitle).getAttribute('class')).includes('mat-radio-checked');
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

  isRequirementDisplayed(requirementTitle: string): Promise<boolean> {
    return isDisplayed(this.getRequirementSelector(requirementTitle));
  }

  async isRequirementEnabled(requirementTitle: string): Promise<boolean> {
    return !(await getElementByText('ig-selectable-requirement', requirementTitle).$('mat-checkbox').getAttribute('class')).includes('mat-checkbox-disabled');
  }

  async isRequirementSelected(requirementTitle: string): Promise<boolean> {
    return (await getElementByText('ig-selectable-requirement', requirementTitle).$('mat-checkbox').getAttribute('class')).includes('mat-checkbox-checked');
  }

  async isSubmitButtonEnabled(): Promise<boolean> {
    const disabledValue: string = await this.$submitButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }
}
