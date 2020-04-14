import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { AlertDialog, EmployeeCurrentPacePage, PaceFeedbackFormPage } from '@e2e/page-objects';

describe('Give feedback', () => {
  const alertDialog = new AlertDialog();
  const employee = 'Lambert Minor';
  const employeeCurrentPacePage = new EmployeeCurrentPacePage();
  const paceFeedbackFormPage = new PaceFeedbackFormPage();
  let answers: string;
  let comment: string;

  beforeAll(async () => {
    await employeeCurrentPacePage.navigate();
  });

  it('PACE timeline should be displayed', async () => {
    expect(await employeeCurrentPacePage.isPaceTimelineDisplayed()).toBe(true);
  });

  it('PACE phase should be "Evaluation"', async () => {
    expect(await employeeCurrentPacePage.getPhase()).toBe(getI18nText('EVALUATION'));
  });

  it('reviewers datatable should be displayed', async () => {
    expect(await employeeCurrentPacePage.isReviewersDatatableDisplayed()).toBe(true);
  });

  it('evaluate yourself button should be displayed', async () => {
    expect(await employeeCurrentPacePage.isEvaluateYourselfButtonDisplayed()).toBe(true);
  });

  it('should open feedback form page', async () => {
    await employeeCurrentPacePage.clickOnEvaluateYourselfButton();

    expect(await paceFeedbackFormPage.isDisplayed()).toBe(true);
  });

  it('should give "Draft" feedback', async () => {
    answers = await paceFeedbackFormPage.setQuestionAnswers();
    comment = await paceFeedbackFormPage.setFeedbackComment();

    await paceFeedbackFormPage.clickOnSaveAsDraftButton();
    await waitUntil(() => paceFeedbackFormPage.isDisplayed(), true);

    await waitUntil(() => employeeCurrentPacePage.isEvaluateYourselfButtonDisplayed(), true);

    expect(await employeeCurrentPacePage.isFinishEvaluationButtonDisplayed()).toBe(true);
  });

  it('should give feedback', async () => {
    await employeeCurrentPacePage.clickOnFinishEvaluationButton();
    await waitUntil(() => paceFeedbackFormPage.isDisplayed(), false);

    await paceFeedbackFormPage.clickOnSubmitButton();
    await waitUntil(() => alertDialog.isDisplayed(), false)

    await alertDialog.clickOnOkButton();
    await waitUntil(() => employeeCurrentPacePage.isFinishEvaluationButtonDisplayed(), true);

    expect(await employeeCurrentPacePage.getReviewerFeedbackStatus(employee)).toBe(getI18nText('notRated'));
  });

  it('should check that given feedback marks and comment are correct', async () => {
    await employeeCurrentPacePage.clickOnReviewerFeedback(employee);
    await waitUntil(() => paceFeedbackFormPage.isDisplayed(), false);

    expect(await paceFeedbackFormPage.getQuestionAnswers()).toBe(answers, 'Answers');
    expect(await paceFeedbackFormPage.getComment()).toBe(comment, 'Comment');
  });
});
