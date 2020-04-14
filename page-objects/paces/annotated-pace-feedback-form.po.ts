import { $ } from 'protractor';

import { clearTextField, clickOnElement, isDisplayed, getElementByText } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { randomNumber, randomText } from '@e2e/helpers/random-helper';

import { PaceFeedbackStatus } from '@pace/models';

export class AnnotatedPaceFeedbackFormPage {
  private readonly $container = $('ig-annotated-pace-feedback-form');
  private readonly $commentField = this.$container.$('ig-comment-control textarea');

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  getComment() {
    return this.$commentField.getAttribute('value');
  }

  async getStatus() {
    const $statuses = await this.$container.$$('mat-radio-button');

    for (const $status of $statuses) {
      if ((await $status.getAttribute('class')).includes('mat-radio-checked')) {
        return $status.$('.mat-radio-label-content').getText();
      }
    }

    return null;
  }

  isDisplayed() {
    return isDisplayed(this.$container);
  }

  async setComment() {
    const comment = randomText(randomNumber(10, 50));

    await this.$commentField.click();
    await clearTextField(this.$commentField);
    await this.$commentField.sendKeys(comment);

    return comment;
  }

  async setStatus(status: PaceFeedbackStatus) {
    if (status === PaceFeedbackStatus.Useful) {
      await clickOnElement(getElementByText('mat-radio-button', getI18nText('useful'), this.$container));
    }

    if (status === PaceFeedbackStatus.NotUseful) {
      await clickOnElement(getElementByText('mat-radio-button', getI18nText('notUseful'), this.$container));
    }
  }
}
