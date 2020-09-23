import { $, ElementFinder, promise } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { AlertDialog } from '../alert-dialog-po';
import { PaceFeedbackFormPage } from '../pace-feedback-form.po';

import { OugoingFeedbackPage } from './outgoing-feedback.po';

export class MyCurrentFeedbackPage extends OugoingFeedbackPage {
  private readonly $container: ElementFinder = $('ig-current-container');
  private readonly $feedbacksDatatable: ElementFinder = this.$container.$('ig-reviewer-pace-feedbacks-datatable');
  private readonly finishFeedbackButton: string = '[e2e-id="finishFeedbackButton"]';
  private readonly giveFeedbackButton: string = '[e2e-id="giveFeedbackButton"]';

  async clickOnFinishFeedbackButton(employee: string): Promise<void> {
    await clickOnElement(this.getEmployeeSelector(employee).$(this.finishFeedbackButton));
  }

  async clickOnGiveFeedbackButton(employee: string): Promise<void> {
    await clickOnElement(this.getEmployeeSelector(employee).$(this.giveFeedbackButton));
  }

  private getEmployeeSelector(employee: string): ElementFinder {
    return getElementByText('tr', employee, this.$feedbacksDatatable);
  }

  getFeedbacksCount(): promise.Promise<number> {
    return this.$container.$$('ig-user').count();
  }

  async giveFeedback(employee: string): Promise<void> {
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

  isFeedbackRequestDisplayed(employee: string): Promise<boolean> {
    return isDisplayed(this.getEmployeeSelector(employee));
  }

  isFeedbacksDatatableDisplayed(): Promise<boolean> {
    return isDisplayed(this.$feedbacksDatatable);
  }

  isFinishFeedbackButtonDisplayed(employee: string): Promise<boolean> {
    return isDisplayed(this.getEmployeeSelector(employee).$(this.finishFeedbackButton));
  }

  isGiveFeedbackButtonDisplayed(employee: string): Promise<boolean> {
    return isDisplayed(this.getEmployeeSelector(employee).$(this.giveFeedbackButton));
  }

  async navigate(): Promise<void> {
    await super.navigate();

    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('inProgress')));
    await waitUntil(() => isDisplayed(this.$container), false);
  }
}
