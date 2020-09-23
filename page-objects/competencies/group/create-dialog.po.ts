import { $, $$, ElementFinder, promise } from 'protractor';

import { clearTextField, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

import { BaseDialog } from '../../base-dialog.po';

export class CreateGroupDialog extends BaseDialog {
  private readonly $coeField: ElementFinder = this.$container.$('[formcontrolname="excellenceCenter"] input');
  private readonly $coeFieldError: ElementFinder = this.$container.$('[formcontrolname="excellenceCenter"] mat-error');
  private readonly $firstAutoCompleteItem: ElementFinder = $$('[role="option"]').first();
  private readonly $nameField: ElementFinder = this.$container.$('[e2e-id="nameField"] input');
  private readonly $nameFieldError: ElementFinder = this.$container.$('[e2e-id="nameField"] mat-error');
  private readonly $ownerField: ElementFinder = this.$container.$('ig-users-autocomplete input');
  private readonly $ownerFieldError: ElementFinder = this.$container.$('ig-users-autocomplete mat-error');

  constructor() {
    super($('ig-create-competencies-group-dialog'));
  }

  async clearNameField(): Promise<void> {
    await clearTextField(this.$nameField);
    await pressEnterKey();
  }

  async clearOwnerField(): Promise<void> {
    await clearTextField(this.$ownerField);
    await pressEnterKey();
  }

  getCoeFieldError(): promise.Promise<string> {
    return this.$coeFieldError.getText();
  }

  getCoeFieldValue(): promise.Promise<string> {
    return this.$coeField.getAttribute('value');
  }

  getNameFieldErrorText(): promise.Promise<string> {
    return this.$nameFieldError.getText();
  }

  getNameFieldValue(): promise.Promise<string> {
    return this.$nameField.getAttribute('value');
  }

  getOwnerFieldErrorText(): promise.Promise<string> {
    return this.$ownerFieldError.getText();
  }

  getOwnerFieldValue(): promise.Promise<string> {
    return this.$ownerField.getAttribute('value');
  }

  isCoEFieldDisplayed(): Promise<boolean> {
    return isDisplayed(this.$coeField, { withoutScroll: true });
  }

  isCoEFieldErrorDisplayed(): Promise<boolean> {
    return isDisplayed(this.$coeFieldError, { withoutScroll: true });
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

  async setCoEFieldValue(name: string): Promise<void> {
    await this.$coeField.sendKeys(name);
    await this.$firstAutoCompleteItem.click();
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
