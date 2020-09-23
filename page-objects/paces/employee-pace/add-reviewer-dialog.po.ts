import { $, $$, ElementFinder, promise } from 'protractor';

import { clearTextField, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

import { BaseDialog } from '../../base-dialog.po';

export class AddReviewerDialog extends BaseDialog {
  private readonly $firstAutoCompleteItem: ElementFinder = $$('[role="option"]').first();
  private readonly $reviewerField: ElementFinder = this.$container.$('ig-users-autocomplete input');
  private readonly $reviewerFieldError: ElementFinder = this.$container.$('ig-users-autocomplete mat-error');

  constructor() {
    super($('ig-request-pace-feedback-dialog'));
  }

  async clearReviewerField(): Promise<void> {
    await clearTextField(this.$reviewerField);
    await pressEnterKey();
  }

  getReviewerFieldErrorText(): promise.Promise<string> {
    return this.$reviewerFieldError.getText();
  }

  getReviewerFieldValue(): promise.Promise<string> {
    return this.$reviewerField.getAttribute('value');
  }

  isReviewerFieldDisplayed(): Promise<boolean> {
    return isDisplayed(this.$reviewerField, { withoutScroll: true });
  }

  isReviewerFieldErrorDisplayed(): Promise<boolean> {
    return isDisplayed(this.$reviewerFieldError, { withoutScroll: true });
  }

  async setReviewerFieldValue(name: string): Promise<void> {
    await this.$reviewerField.click();
    await this.$reviewerField.clear();
    await this.$reviewerField.sendKeys(name);
    await this.$firstAutoCompleteItem.click();
  }
}
