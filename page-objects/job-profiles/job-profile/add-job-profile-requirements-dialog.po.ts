import { $, ElementFinder, promise } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed } from '@e2e/helpers/common-helper';

import { BaseDialog } from '../../base-dialog.po';

export class AddJobProfileRequirementsDialog extends BaseDialog {
  constructor() {
    super($('ig-add-job-profile-requirements-dialog'));
  }

  async clickOnRequirement(requirementTitle: string): Promise<void> {
    await clickOnElement(this.getRequirementSelector(requirementTitle));
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

  isRequirementDisplayed(requirementTitle: string): Promise<boolean> {
    return isDisplayed(this.getRequirementSelector(requirementTitle));
  }

  async isRequirementEnabled(requirementTitle: string): Promise<boolean> {
    return !(await getElementByText('ig-selectable-requirement',requirementTitle).$('mat-checkbox').getAttribute('class')).includes('mat-checkbox-disabled');
  }

  async isRequirementSelected(requirementTitle: string): Promise<boolean> {
    return (await getElementByText('ig-selectable-requirement',requirementTitle).$('mat-checkbox').getAttribute('class')).includes('mat-checkbox-checked');
  }

  async isSubmitButtonEnabled(): Promise<boolean> {
    const disabledValue: string = await this.$submitButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }
}
