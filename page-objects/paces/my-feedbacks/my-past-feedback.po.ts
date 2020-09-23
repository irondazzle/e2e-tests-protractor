import { $, ElementFinder } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { OugoingFeedbackPage } from './outgoing-feedback.po';

export class MyPastFeedbackPage extends OugoingFeedbackPage {
  private readonly $container: ElementFinder = $('ig-past-container');
  private readonly $feedbacksDatatable: ElementFinder = this.$container.$('ig-reviewer-pace-feedbacks-datatable');

  async clickOnFeedback(paceId: string): Promise<void> {
    await clickOnElement(this.getFeedbackSelector(paceId));
  }

  private getFeedbackSelector(paceId: string): ElementFinder {
    return this.$feedbacksDatatable.$(`[e2e-value="${paceId}"`);
  }

  isFeedbacksDatatableDisplayed(): Promise<boolean> {
    return isDisplayed(this.$feedbacksDatatable);
  }

  isFeedbackDisplayed(paceId: string): Promise<boolean> {
    return isDisplayed(this.getFeedbackSelector(paceId));
  }

  async navigate(): Promise<void> {
    await super.navigate();

    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('COMPLETED')));
    await waitUntil(() => isDisplayed(this.$container), false);
  }
}
