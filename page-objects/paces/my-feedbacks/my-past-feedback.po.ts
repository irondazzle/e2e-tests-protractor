import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { OugoingFeedbackPage } from './outgoing-feedback.po';

export class MyPastFeedbackPage extends OugoingFeedbackPage {
  private readonly $container = $('ig-past-container');
  private readonly $feedbacksDatatable = this.$container.$('ig-reviewer-pace-feedbacks-datatable');

  async clickOnEmployeeFeedback(employee: string) {
    await clickOnElement(this.getEmployeeSelector(employee));
  }

  private getEmployeeSelector(employee: string) {
    return getElementByText('tr', employee, this.$feedbacksDatatable);
  }

  isFeedbacksDatatableDisplayed() {
    return isDisplayed(this.$feedbacksDatatable);
  }

  isFeedbackDisplayed(employee: string) {
    return isDisplayed(this.getEmployeeSelector(employee));
  }

  async navigate() {
    await super.navigate();

    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('COMPLETED')));
    await waitUntil(() => isDisplayed(this.$container), false);
  }
}
