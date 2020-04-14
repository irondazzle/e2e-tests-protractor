import { $ } from 'protractor';

import { clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';

export class CreateJobProfileGroupDialog {
  private readonly $container = $('ig-create-job-profile-group-dialog');
  private readonly $nameField = this.$container.$('[e2e-id="nameField"] input');
  private readonly $nameFieldError = this.$container.$('[e2e-id="nameField"] mat-error');

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  getNameFieldErrorText() {
    return this.$nameFieldError.getText();
  }

  getNameFieldValue() {
    return this.$nameField.getAttribute('value');
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

  async setNameFieldValue(name: string) {
    await this.$nameField.clear();
    await this.$nameField.sendKeys(name);
  }
}
