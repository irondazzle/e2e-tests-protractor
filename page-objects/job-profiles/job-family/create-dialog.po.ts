import { $, $$, ElementFinder, promise } from 'protractor';

import { clearTextField, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

import { BaseDialog } from '../../base-dialog.po';

export class CreateJobFamilyDialog extends BaseDialog {
  private readonly $firstAutoCompleteItem: ElementFinder = $$('[role="option"]').first();
  private readonly $nameField: ElementFinder = this.$container.$('[e2e-id="nameField"] input');
  private readonly $nameFieldError: ElementFinder = this.$container.$('[e2e-id="nameField"] mat-error');
  private readonly $ownerField: ElementFinder = this.$container.$('ig-users-autocomplete input');
  private readonly $ownerFieldError: ElementFinder = this.$container.$('ig-users-autocomplete mat-error');

  constructor() {
    super($('ig-create-job-family-dialog'));
  }

  async clearOwnerField(): Promise<void> {
    await clearTextField(this.$ownerField);
    await pressEnterKey();
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
