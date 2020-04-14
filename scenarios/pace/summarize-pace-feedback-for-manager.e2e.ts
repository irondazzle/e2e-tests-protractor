import { PaceStatus } from '@app/features/pace/models/pace-status.model';

import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { AlertDialog, EmployeeCurrentPacePage, MyTeamPage, SummarizedPaceFeedbackFormPage } from '@e2e/page-objects';

describe('Summarize PACE feedback', () => {
  const alertDialog = new AlertDialog();
  const employee = 'Lambert Minor';
  const employeeCurrentPacePage = new EmployeeCurrentPacePage();
  const myTeamPage = new MyTeamPage();
  const summarizedPaceFeedbackFormPage = new SummarizedPaceFeedbackFormPage();
  let marks: string;
  let paceScore: string;

  beforeAll(async () => {
    await myTeamPage.navigate();
  });

  it('employee PACEs datatable should be displayed', async () => {
    expect(await myTeamPage.isPacesDatatableDisplayed()).toBe(true);
  });

  it('employee’s PACE should be displayed', async () => {
    expect(await myTeamPage.isEmployeeDisplayed(employee)).toBe(true);
  });

  it('should open current employee’s PACE', async () => {
    await myTeamPage.clickOnEmployee(employee);

    expect(await employeeCurrentPacePage.isPaceTimelineDisplayed()).toBe(true);
  });

  it('PACE timeline should be displayed', async () => {
    expect(await employeeCurrentPacePage.isPaceTimelineDisplayed()).toBe(true);
  });

  it('PACE phase should be "Summarize"', async () => {
    expect(await employeeCurrentPacePage.getPhase()).toBe(getI18nText('SUMMARIZE'));
  });

  it('"Feedback discussion" status action button should be displayed', async () => {
    expect(await employeeCurrentPacePage.isStatusActionButtonDisplayed(PaceStatus.Evaluated)).toBe(true);
  });

  it('"Feedback discussion" status action button should be disabled', async () => {
    expect(await employeeCurrentPacePage.isStatusActionButtonEnabled(PaceStatus.Evaluated)).toBe(false);
  });

  it('reviewers datatable should be displayed', async () => {
    expect(await employeeCurrentPacePage.isReviewersDatatableDisplayed()).toBe(true);
  });

  it('"Give feedback" button should be displayed', async () => {
    expect(await employeeCurrentPacePage.isGiveFeedbackButtonDisplayed()).toBe(true);
  });

  it('should open summarized feedback form page', async () => {
    await employeeCurrentPacePage.clickOnGiveFeedbackButton();

    expect(await summarizedPaceFeedbackFormPage.isDisplayed()).toBe(true);
  });

  it('should check that calculated PACE score is correct', async () => {
    paceScore = await summarizedPaceFeedbackFormPage.getSuggestedPaceScore();

    expect(await summarizedPaceFeedbackFormPage.getPaceScore()).toBe(paceScore);
  });

  it('should set all final marks to minimal possible mark', async () => {
    marks = await summarizedPaceFeedbackFormPage.setQuestionAnswers(3);

    expect(await summarizedPaceFeedbackFormPage.getQuestionAnswers()).toBe(marks);
  });

  it('should check all that calculated PACE score is correct after evaluation', async () => {
    paceScore = await summarizedPaceFeedbackFormPage.getSuggestedPaceScore();

    expect(await summarizedPaceFeedbackFormPage.getPaceScore()).toBe(paceScore);
  });

  it('should set all final marks to maximal possible mark', async () => {
    marks = await summarizedPaceFeedbackFormPage.setQuestionAnswers(0);

    expect(await summarizedPaceFeedbackFormPage.getQuestionAnswers()).toBe(marks);
  });

  it('should check all that calculated PACE score is correct after evaluation', async () => {
    paceScore = await summarizedPaceFeedbackFormPage.getSuggestedPaceScore();

    expect(await summarizedPaceFeedbackFormPage.getPaceScore()).toBe(paceScore);
  });

  it('comment field should be displayed', async () => {
    expect(await summarizedPaceFeedbackFormPage.isFeedbackCommentDisplayed()).toBe(true);
  });

  it('should set comment', async () => {
    const comment = await summarizedPaceFeedbackFormPage.setComment();

    expect(await summarizedPaceFeedbackFormPage.getComment()).toBe(comment);
  });

  it('should summarize feedback form', async () => {
    await summarizedPaceFeedbackFormPage.clickOnSubmitButton();
    await waitUntil(() => alertDialog.isDisplayed(), false)

    await alertDialog.clickOnOkButton();
    await waitUntil(() => alertDialog.isDisplayed(), true);
    await waitUntil(() => summarizedPaceFeedbackFormPage.isDisplayed(), true);

    await waitUntil(() => employeeCurrentPacePage.isGiveFeedbackButtonDisplayed(), true);

    expect(await employeeCurrentPacePage.isStatusActionButtonEnabled(PaceStatus.Evaluated)).toBe(true);
  });
});
