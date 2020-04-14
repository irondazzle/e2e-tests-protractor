import { $, $$ } from 'protractor';

import { clearTextField, clickOnElement, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

export class CreateGroupDialog {
  private readonly $container = $('ig-create-competencies-group-dialog');
  private readonly $coeField = this.$container.$('[formcontrolname="excellenceCenter"] input');
  private readonly $coeFieldError = this.$container.$('[formcontrolname="excellenceCenter"] mat-error');
  private readonly $firstAutoCompleteItem = $$('[role="option"]').first();
  private readonly $nameField = this.$container.$('[e2e-id="nameField"] input');
  private readonly $nameFieldError = this.$container.$('[e2e-id="nameField"] mat-error');
  private readonly $ownerField = this.$container.$('ig-users-autocomplete input');
  private readonly $ownerFieldError = this.$container.$('ig-users-autocomplete mat-error');

  async clearNameField() {
    await clearTextField(this.$nameField);
    await pressEnterKey();
  }

  async clearOwnerField() {
    await clearTextField(this.$ownerField);
    await pressEnterKey();
  }

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  getCoeFieldError() {
    return this.$coeFieldError.getText();
  }

  getCoeFieldValue() {
    return this.$coeField.getAttribute('value');
  }

  getNameFieldErrorText() {
    return this.$nameFieldError.getText();
  }

  getNameFieldValue() {
    return this.$nameField.getAttribute('value');
  }

  getOwnerFieldErrorText() {
    return this.$ownerFieldError.getText();
  }

  getOwnerFieldValue() {
    return this.$ownerField.getAttribute('value');
  }

  isCoEFieldDisplayed() {
    return isDisplayed(this.$coeField, { withoutScroll: true });
  }

  isCoEFieldErrorDisplayed() {
    return isDisplayed(this.$coeFieldError, { withoutScroll: true });
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

  async setCoEFieldValue(name: string) {
    await this.$coeField.sendKeys(name);
    await this.$firstAutoCompleteItem.click();
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
