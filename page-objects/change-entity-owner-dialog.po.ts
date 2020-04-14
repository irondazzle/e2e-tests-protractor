import { $, $$ } from 'protractor';

import { clearTextField, clickOnElement, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

export class ChangeEntityOwnerDialog {
  private readonly $container = $('ig-change-entity-owner-dialog');
  private readonly $firstAutoCompleteItem = $$('[role="option"]').first();
  private readonly $ownerField = this.$container.$('ig-users-autocomplete input');
  private readonly $ownerFieldError = this.$container.$('ig-users-autocomplete mat-error');

  async clearOwnerField() {
    await clearTextField(this.$ownerField);
    await pressEnterKey();
  }

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  getOwnerFieldErrorText() {
    return this.$ownerFieldError.getText();
  }

  getOwnerFieldValue() {
    return this.$ownerField.getAttribute('value');
  }

  isDisplayed() {
    return isDisplayed(this.$container, { timer: true, withoutScroll: true });
  }

  isOwnerFieldDisplayed() {
    return isDisplayed(this.$ownerField, { withoutScroll: true });
  }

  isOwnerFieldErrorDisplayed() {
    return isDisplayed(this.$ownerFieldError, { withoutScroll: true });
  }

  async setOwnerFieldValue(name: string) {
    await this.$ownerField.click();
    await this.$ownerField.clear();
    await this.$ownerField.sendKeys(name);
    await this.$firstAutoCompleteItem.click();
  }
}
