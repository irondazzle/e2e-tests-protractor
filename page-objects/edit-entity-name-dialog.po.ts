import { $, ElementFinder, promise } from 'protractor';

import { clearTextField, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

import { BaseDialog } from './base-dialog.po';

export class EditEntityNameDialog extends BaseDialog {
  private readonly $nameField: ElementFinder = this.$container.$('[e2e-id="nameField"] input');
  private readonly $nameFieldError: ElementFinder = this.$container.$('[e2e-id="nameField"] mat-error');

  constructor() {
    super($('ig-edit-entity-name-dialog'));
  }

  async clearNameField(): Promise<void> {
    await clearTextField(this.$nameField);
    await pressEnterKey();
  }

  getNameFieldErrorText(): promise.Promise<string> {
    return this.$nameFieldError.getText();
  }

  getNameFieldValue(): promise.Promise<string> {
    return this.$nameField.getAttribute('value');
  }

  isNameFieldDisplayed(): Promise<boolean> {
    return isDisplayed(this.$nameField, { withoutScroll: true });
  }

  isNameFieldErrorDisplayed(): Promise<boolean> {
    return isDisplayed(this.$nameFieldError, { withoutScroll: true });
  }

  async setNameFieldValue(name: string): Promise<void> {
    await this.$nameField.clear();
    await this.$nameField.sendKeys(name);
  }
}
