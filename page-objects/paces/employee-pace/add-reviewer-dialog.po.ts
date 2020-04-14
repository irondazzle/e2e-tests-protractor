import { $, $$ } from 'protractor';

import { clearTextField, clickOnElement, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

export class AddReviewerDialog {
  private readonly $container = $('ig-request-pace-feedback-dialog');
  private readonly $firstAutoCompleteItem = $$('[role="option"]').first();
  private readonly $reviewerField = this.$container.$('ig-users-autocomplete input');
  private readonly $reviewerFieldError = this.$container.$('ig-users-autocomplete mat-error');

  async clearReviewerField() {
    await clearTextField(this.$reviewerField);
    await pressEnterKey();
  }

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  getReviewerFieldErrorText() {
    return this.$reviewerFieldError.getText();
  }

  getReviewerFieldValue() {
    return this.$reviewerField.getAttribute('value');
  }

  isDisplayed() {
    return isDisplayed(this.$container, { timer: true, withoutScroll: true });
  }

  isReviewerFieldDisplayed() {
    return isDisplayed(this.$reviewerField, { withoutScroll: true });
  }

  isReviewerFieldErrorDisplayed() {
    return isDisplayed(this.$reviewerFieldError, { withoutScroll: true });
  }

  async setReviewerFieldValue(name: string) {
    await this.$reviewerField.click();
    await this.$reviewerField.clear();
    await this.$reviewerField.sendKeys(name);
    await this.$firstAutoCompleteItem.click();
  }
}
