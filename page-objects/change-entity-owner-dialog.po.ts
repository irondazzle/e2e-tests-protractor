import { $, $$, ElementFinder, promise } from 'protractor';

import { clearTextField, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

import {  BaseDialog } from './base-dialog.po';

export class ChangeEntityOwnerDialog extends BaseDialog {
  private readonly $firstAutoCompleteItem: ElementFinder = $$('[role="option"]').first();
  private readonly $ownerField: ElementFinder = this.$container.$('ig-users-autocomplete input');
  private readonly $ownerFieldError: ElementFinder = this.$container.$('ig-users-autocomplete mat-error');

  constructor() {
    super($('ig-change-entity-owner-dialog'));
  }

  async clearOwnerField(): Promise<void> {
    await clearTextField(this.$ownerField);
    await pressEnterKey();
  }

  getOwnerFieldErrorText(): promise.Promise<string> {
    return this.$ownerFieldError.getText();
  }

  getOwnerFieldValue(): promise.Promise<string> {
    return this.$ownerField.getAttribute('value');
  }

  isOwnerFieldDisplayed(): Promise<boolean> {
    return isDisplayed(this.$ownerField, { withoutScroll: true });
  }

  isOwnerFieldErrorDisplayed(): Promise<boolean> {
    return isDisplayed(this.$ownerFieldError, { withoutScroll: true });
  }

  async setOwnerFieldValue(name: string): Promise<void> {
    await this.$ownerField.click();
    await this.$ownerField.clear();
    await this.$ownerField.sendKeys(name);
    await this.$firstAutoCompleteItem.click();
  }
}
