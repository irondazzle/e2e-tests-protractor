import { $, ElementArrayFinder, ElementFinder, promise } from 'protractor';

import { PaceStatus } from '@app/features/pace/models/pace-status.model';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { AddReviewerDialog, RemoveReviewerDialog } from '@e2e/page-objects';

import { MyPacesPage } from './my-paces.po';

export class EmployeeCurrentPacePage extends MyPacesPage {
  private readonly $container: ElementFinder = $('ig-current-container');
  private readonly $addReviewerButton: ElementFinder = this.$container.$('[e2e-id="addReviewerButton"]');
  private readonly $reviewersDatatable: ElementFinder = this.$container.$('ig-employee-pace-feedbacks-datatable');
  private readonly $evaluateYourselfButton: ElementFinder = this.$reviewersDatatable.$('[e2e-id="evaluateYourselfButton"]');
  private readonly $finishEvaluationButton: ElementFinder = this.$reviewersDatatable.$('[e2e-id="finishEvaluationButton"]');
  private readonly $giveFeedbackButton: ElementFinder = this.$reviewersDatatable.$('[e2e-id="giveFeedbackButton"]');
  private readonly $showFeedbackButton: ElementFinder = this.$reviewersDatatable.$('[e2e-id="showFeedbackButton"]');
  private readonly $timeline: ElementFinder = this.$container.$('ig-pace-timeline');

  async addReviewer(reviewer: string): Promise<void> {
    const addReviewerDialog = new AddReviewerDialog();
    const reviewersCount = await this.getReviewersCount();

    await this.clickOnAddReviewerButton();
    await waitUntil(() => addReviewerDialog.isDisplayed(), false);

    await addReviewerDialog.setReviewerFieldValue(reviewer);

    await addReviewerDialog.clickOnSubmitButton();
    await waitUntil(() => addReviewerDialog.isDisplayed(), true);

    await waitUntil(() => this.getReviewersCount(), reviewersCount);
  }

  async clickOnAddReviewerButton(): Promise<void> {
    await clickOnElement(this.$addReviewerButton);
  }

  async clickOnEvaluateYourselfButton(): Promise<void> {
    await clickOnElement(this.$evaluateYourselfButton);
  }

  async clickOnFinishEvaluationButton(): Promise<void> {
    await clickOnElement(this.$finishEvaluationButton);
  }

  async clickOnGiveFeedbackButton(): Promise<void> {
    await clickOnElement(this.$giveFeedbackButton);
  }

  async clickOnRemoveReviewerButton(reviewer: string): Promise<void> {
    await clickOnElement(this.getReviewerSelector(reviewer).$('[e2e-id="removeReviewerButton"]'));
  }

  async clickOnReviewerFeedback(reviewer: string): Promise<void> {
    await clickOnElement(this.getReviewerSelector(reviewer));
  }

  async clickOnShowFeedbackButton(): Promise<void> {
    await clickOnElement(this.$showFeedbackButton);
  }

  async clickOnStatusActionButton(status: PaceStatus): Promise<void> {
    await clickOnElement(this.getStatusActionButtonSelector(status));
  }

  async getPhase(): Promise<string> {
    const $phases: ElementArrayFinder = this.$timeline.$$('ig-pace-timeline-status');

    for(const $phase of await $phases) {
      const isCurrentPhase: boolean = (await $phase.getAttribute('class')).includes('current');

      if (isCurrentPhase) {
        return $phase.$('span.title').getText();
      }
    }

    return null;
  }

  getReviewerFeedbackStatus(reviewer: string): promise.Promise<string> {
    return this.getReviewerSelector(reviewer).$('ig-pace-feedback-status .title').getText();
  }

  private getReviewerSelector(reviewer: string): ElementFinder {
    return getElementByText('tr', reviewer, this.$reviewersDatatable);
  }

  private getStatusActionButtonSelector(status: PaceStatus): ElementFinder {
    return this.$container.$(`[e2e-id="${status}"]`);
  }

  getReviewersCount(): promise.Promise<number> {
    return this.$reviewersDatatable.$$('tr').count();
  }

  isAddReviewerButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$addReviewerButton);
  }

  isEvaluateYourselfButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$evaluateYourselfButton);
  }

  isFinishEvaluationButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$finishEvaluationButton);
  }

  isGiveFeedbackButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$giveFeedbackButton);
  }

  isPaceTimelineDisplayed(): Promise<boolean> {
    return isDisplayed(this.$timeline);
  }

  isRemoveReviewerButtonDisplayed(reviewer: string): Promise<boolean> {
    return isDisplayed(this.getReviewerSelector(reviewer).$('[e2e-id="removeReviewerButton"]'))
  }

  isReviewerDisplayed(reviewer: string): Promise<boolean> {
    return isDisplayed(this.getReviewerSelector(reviewer));
  }

  isShowFeedbackButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$showFeedbackButton);
  }

  isStatusActionButtonDisplayed(status: PaceStatus): Promise<boolean> {
    return isDisplayed(this.getStatusActionButtonSelector(status));
  }

  async isStatusActionButtonEnabled(status: PaceStatus): Promise<boolean> {
    const disabledValue: string = await this.getStatusActionButtonSelector(status).getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }

  isReviewersDatatableDisplayed(): Promise<boolean> {
    return isDisplayed(this.$reviewersDatatable);
  }

  async navigate(): Promise<void> {
    await super.navigate();
    await this.navigateToCurrentPaceTab();
  }

  async navigateToCurrentPaceTab(): Promise<void> {
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('inProgress')));
    await waitUntil(() => isDisplayed(this.$container), false);
  }

  async removeReviewer(reviewer: string): Promise<void> {
    const removeReviewerDialog = new RemoveReviewerDialog();
    const reviewersCount: number = await this.getReviewersCount();

    await this.clickOnRemoveReviewerButton(reviewer);
    await waitUntil(() => removeReviewerDialog.isDisplayed(), false);

    await removeReviewerDialog.clickOnSubmitButton();
    await waitUntil(() => removeReviewerDialog.isDisplayed(), true);

    await waitUntil(() => this.getReviewersCount(), reviewersCount);
  }
}
