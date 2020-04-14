import { $ } from 'protractor';

import { PaceStatus } from '@app/features/pace/models/pace-status.model';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { AddReviewerDialog, RemoveReviewerDialog } from '@e2e/page-objects';

import { MyPacesPage } from './my-paces.po';

export class EmployeeCurrentPacePage extends MyPacesPage {
  private readonly $container = $('ig-current-container');
  private readonly $addReviewerButton = this.$container.$('[e2e-id="addReviewerButton"]');
  private readonly $reviewersDatatable = this.$container.$('ig-employee-pace-feedbacks-datatable');
  private readonly $evaluateYourselfButton = this.$reviewersDatatable.$('[e2e-id="evaluateYourselfButton"]');
  private readonly $finishEvaluationButton = this.$reviewersDatatable.$('[e2e-id="finishEvaluationButton"]');
  private readonly $giveFeedbackButton = this.$reviewersDatatable.$('[e2e-id="giveFeedbackButton"]');
  private readonly $showFeedbackButton = this.$reviewersDatatable.$('[e2e-id="showFeedbackButton"]');
  private readonly $timeline = this.$container.$('ig-pace-timeline');

  async addReviewer(reviewer: string) {
    const addReviewerDialog = new AddReviewerDialog();
    const reviewersCount = await this.getReviewersCount();

    await this.clickOnAddReviewerButton();
    await waitUntil(() => addReviewerDialog.isDisplayed(), false);

    await addReviewerDialog.setReviewerFieldValue(reviewer);

    await addReviewerDialog.clickOnSubmitButton();
    await waitUntil(() => addReviewerDialog.isDisplayed(), true);

    await waitUntil(() => this.getReviewersCount(), reviewersCount);
  }

  async clickOnAddReviewerButton() {
    await clickOnElement(this.$addReviewerButton);
  }

  async clickOnEvaluateYourselfButton() {
    await clickOnElement(this.$evaluateYourselfButton);
  }

  async clickOnFinishEvaluationButton() {
    await clickOnElement(this.$finishEvaluationButton);
  }

  async clickOnGiveFeedbackButton() {
    await clickOnElement(this.$giveFeedbackButton);
  }

  async clickOnRemoveReviewerButton(reviewer: string) {
    await clickOnElement(this.getReviewerSelector(reviewer).$('[e2e-id="removeReviewerButton"]'));
  }

  async clickOnReviewerFeedback(reviewer: string) {
    await clickOnElement(this.getReviewerSelector(reviewer));
  }

  async clickOnShowFeedbackButton() {
    await clickOnElement(this.$showFeedbackButton);
  }

  async clickOnStatusActionButton(status: PaceStatus) {
    await clickOnElement(this.getStatusActionButtonSelector(status));
  }

  async getPhase() {
    const $statuses = this.$timeline.$$('ig-pace-timeline-status');

    for(let i = 0; i < await $statuses.count(); i++) {
      if ((await $statuses.get(i).getAttribute('class')).includes('current')) {
        return $statuses.get(i).$('span.title').getText();
      }
    }

    return null;
  }

  getReviewerFeedbackStatus(reviewer: string) {
    return this.getReviewerSelector(reviewer).$('ig-pace-feedback-status .title').getText();
  }

  private getReviewerSelector(reviewer: string) {
    return getElementByText('tr', reviewer, this.$reviewersDatatable);
  }

  private getStatusActionButtonSelector(status: PaceStatus) {
    return this.$container.$(`[e2e-id="${status}"]`);
  }

  getReviewersCount() {
    return this.$reviewersDatatable.$$('tr').count();
  }

  isAddReviewerButtonDisplayed() {
    return isDisplayed(this.$addReviewerButton);
  }

  isEvaluateYourselfButtonDisplayed() {
    return isDisplayed(this.$evaluateYourselfButton);
  }

  isFinishEvaluationButtonDisplayed() {
    return isDisplayed(this.$finishEvaluationButton);
  }

  isGiveFeedbackButtonDisplayed() {
    return isDisplayed(this.$giveFeedbackButton);
  }

  isPaceTimelineDisplayed() {
    return isDisplayed(this.$timeline);
  }

  isRemoveReviewerButtonDisplayed(reviewer: string) {
    return isDisplayed(this.getReviewerSelector(reviewer).$('[e2e-id="removeReviewerButton"]'))
  }

  isReviewerDisplayed(reviewer: string) {
    return isDisplayed(this.getReviewerSelector(reviewer));
  }

  isShowFeedbackButtonDisplayed() {
    return isDisplayed(this.$showFeedbackButton);
  }

  isStatusActionButtonDisplayed(status: PaceStatus) {
    return isDisplayed(this.getStatusActionButtonSelector(status));
  }

  async isStatusActionButtonEnabled(status: PaceStatus) {
    const disabledValue = await this.getStatusActionButtonSelector(status).getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }

  isReviewersDatatableDisplayed() {
    return isDisplayed(this.$reviewersDatatable);
  }

  async navigate() {
    await super.navigate();
    await this.navigateToCurrentPaceTab();
  }

  async navigateToCurrentPaceTab() {
    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('inProgress')));
    await waitUntil(() => isDisplayed(this.$container), false);
  }

  async removeReviewer(reviewer: string) {
    const removeReviewerDialog = new RemoveReviewerDialog();
    const reviewersCount = await this.getReviewersCount();

    await this.clickOnRemoveReviewerButton(reviewer);
    await waitUntil(() => removeReviewerDialog.isDisplayed(), false);

    await removeReviewerDialog.clickOnSubmitButton();
    await waitUntil(() => removeReviewerDialog.isDisplayed(), true);

    await waitUntil(() => this.getReviewersCount(), reviewersCount);
  }
}
