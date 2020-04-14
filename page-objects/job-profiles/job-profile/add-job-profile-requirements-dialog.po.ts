import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed } from '@e2e/helpers/common-helper';

export class AddJobProfileRequirementsDialog {
  private readonly $container = $('ig-add-job-profile-requirements-dialog');
  private readonly $submitButton = this.$container.$('[type="submit"]');

  async clickOnRequirement(requirementTitle: string) {
    await clickOnElement(this.getRequirementSelector(requirementTitle));
  }

  async clickOnSubmitButton() {
    await clickOnElement(this.$submitButton);
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

  isRequirementDisplayed(requirementTitle: string) {
    return isDisplayed(this.getRequirementSelector(requirementTitle));
  }

  async isRequirementEnabled(requirementTitle: string) {
    return !(await getElementByText('ig-selectable-requirement',requirementTitle).$('mat-checkbox').getAttribute('class')).includes('mat-checkbox-disabled');
  }

  async isRequirementSelected(requirementTitle: string) {
    return (await getElementByText('ig-selectable-requirement',requirementTitle).$('mat-checkbox').getAttribute('class')).includes('mat-checkbox-checked');
  }

  async isSubmitButtonEnabled() {
    const disabledValue = await this.$submitButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }
}
