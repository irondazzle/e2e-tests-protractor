import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { AlertDialog } from '../alert-dialog-po';
import { PaceFeedbackFormPage } from '../pace-feedback-form.po';

import { OugoingFeedbackPage } from './outgoing-feedback.po';

export class MyCurrentFeedbackPage extends OugoingFeedbackPage {
  private readonly $container = $('ig-current-container');
  private readonly $feedbacksDatatable = this.$container.$('ig-reviewer-pace-feedbacks-datatable');
  private readonly finishFeedbackButton = '[e2e-id="finishFeedbackButton"]';
  private readonly giveFeedbackButton = '[e2e-id="giveFeedbackButton"]';

  async clickOnFinishFeedbackButton(employee: string) {
    await clickOnElement(this.getEmployeeSelector(employee).$(this.finishFeedbackButton));
  }

  async clickOnGiveFeedbackButton(employee: string) {
    await clickOnElement(this.getEmployeeSelector(employee).$(this.giveFeedbackButton));
  }

  private getEmployeeSelector(employee: string) {
    return getElementByText('tr', employee, this.$feedbacksDatatable);
  }

  getFeedbacksCount() {
    return this.$container.$$('ig-user').count();
  }

  async giveFeedback(employee: string) {
    const alertDialog = new AlertDialog();
    const paceFeedbackFormPage = new PaceFeedbackFormPage();

    await this.clickOnGiveFeedbackButton(employee);
    await waitUntil(() => paceFeedbackFormPage.isDisplayed(), false);

    await paceFeedbackFormPage.setQuestionAnswers();
    await paceFeedbackFormPage.setFeedbackComment();

    await paceFeedbackFormPage.clickOnSubmitButton();
    await waitUntil(() => alertDialog.isDisplayed(), false)

    await alertDialog.clickOnOkButton();
    await waitUntil(() => this.isFeedbacksDatatableDisplayed(), false);

    await waitUntil(() => this.isFeedbackRequestDisplayed(employee), true);
  }

  isFeedbackRequestDisplayed(employee: string) {
    return isDisplayed(this.getEmployeeSelector(employee));
  }

  isFeedbacksDatatableDisplayed() {
    return isDisplayed(this.$feedbacksDatatable);
  }

  isFinishFeedbackButtonDisplayed(employee: string) {
    return isDisplayed(this.getEmployeeSelector(employee).$(this.finishFeedbackButton));
  }

  isGiveFeedbackButtonDisplayed(employee: string) {
    return isDisplayed(this.getEmployeeSelector(employee).$(this.giveFeedbackButton));
  }

  async navigate() {
    await super.navigate();

    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('inProgress')));
    await waitUntil(() => isDisplayed(this.$container), false);
  }
}
