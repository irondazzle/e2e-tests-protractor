import { $, $$ } from 'protractor';

import { clearTextField, clickOnElement, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

export class CreateJobFamilyDialog {
  private readonly $container = $('ig-create-job-family-dialog');
  private readonly $firstAutoCompleteItem = $$('[role="option"]').first();
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
