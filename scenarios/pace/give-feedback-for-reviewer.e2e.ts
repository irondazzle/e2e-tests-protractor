import { browser } from 'protractor';

import { logIn, logOut } from '@e2e/helpers/authorization-helper';
import { waitUntil } from '@e2e/helpers/common-helper';
import { jobProfileAndCompetencyCoordinatorRoles } from '@e2e/helpers/users-helper';

import { AlertDialog, MyCurrentFeedbackPage, MyPastFeedbackPage, PaceFeedbackFormPage } from '@e2e/page-objects';

describe('Give feedback', () => {
  const alertDialog = new AlertDialog();
  const employee = 'Lambert Minor';
  const myCurrentFeedbackPage = new MyCurrentFeedbackPage();
  const myPastFeedbackPage = new MyPastFeedbackPage();
  const paceFeedbackFormPage = new PaceFeedbackFormPage();
  let answers: string;
  let comment: string;
  let feedbackCount: number;
  let paceId: string;

  beforeAll(async () => {
    await myCurrentFeedbackPage.navigate();
  });

  it('feedbacks datatable should be displayed', async () => {
    expect(await myCurrentFeedbackPage.isFeedbacksDatatableDisplayed()).toBe(true);
  });

  it('feedback requrest should be displayed', async () => {
    expect(await myCurrentFeedbackPage.isFeedbackRequestDisplayed(employee)).toBe(true);
  });

  it('give feedback button should be displayed', async () => {
    feedbackCount = await myCurrentFeedbackPage.getFeedbacksCount();

    expect(await myCurrentFeedbackPage.isGiveFeedbackButtonDisplayed(employee)).toBe(true);
  });

  it('should open feedback form page', async () => {
    await myCurrentFeedbackPage.clickOnGiveFeedbackButton(employee);

    expect(await paceFeedbackFormPage.isDisplayed()).toBe(true);
  });

  it('should give "Draft" feedback', async () => {
    paceId = (await browser.getCurrentUrl()).split('/').pop();

    answers = await paceFeedbackFormPage.setQuestionAnswers();
    comment = await paceFeedbackFormPage.setFeedbackComment();

    await paceFeedbackFormPage.clickOnSaveAsDraftButton();
    await waitUntil(() => paceFeedbackFormPage.isDisplayed(), true);

    await waitUntil(() => myCurrentFeedbackPage.isGiveFeedbackButtonDisplayed(employee), true);

    expect(await myCurrentFeedbackPage.isFinishFeedbackButtonDisplayed(employee)).toBe(true);
  });

  it('should give feedback', async () => {
    await myCurrentFeedbackPage.clickOnFinishFeedbackButton(employee);
    await waitUntil(() => paceFeedbackFormPage.isDisplayed(), false);

    await paceFeedbackFormPage.clickOnSubmitButton();
    await waitUntil(() => alertDialog.isDisplayed(), false);

    await alertDialog.clickOnOkButton();
    await waitUntil(() => myCurrentFeedbackPage.isFeedbacksDatatableDisplayed(), false);
    await waitUntil(() => myCurrentFeedbackPage.isFinishFeedbackButtonDisplayed(employee), true);

    await waitUntil(() => myCurrentFeedbackPage.getFeedbacksCount(), feedbackCount);

    expect(await myCurrentFeedbackPage.isFeedbackRequestDisplayed(employee)).toBe(false);
  });

  it('past feedback datatable should be displayed', async () => {
    await myPastFeedbackPage.navigate();

    expect(await myPastFeedbackPage.isFeedbacksDatatableDisplayed()).toBe(true);
  });

  it('should check that given feedback marks and comment are correct', async () => {
    await waitUntil(() => myPastFeedbackPage.isFeedbackDisplayed(paceId), false);

    await myPastFeedbackPage.clickOnFeedback(paceId);
    await waitUntil(() => paceFeedbackFormPage.isDisplayed(), false);

    expect(await paceFeedbackFormPage.getQuestionAnswers()).toBe(answers, 'Answers');
    expect(await paceFeedbackFormPage.getComment()).toBe(comment, 'Comment');
  });

  it('should give second feedback', async () => {
    await logOut();
    await logIn(jobProfileAndCompetencyCoordinatorRoles.liveId, jobProfileAndCompetencyCoordinatorRoles.password);

    await myCurrentFeedbackPage.navigate();

    expect(await myCurrentFeedbackPage.isFeedbackRequestDisplayed(employee)).toBe(true);

    await myCurrentFeedbackPage.giveFeedback(employee);

    expect(await myCurrentFeedbackPage.isFeedbackRequestDisplayed(employee)).toBe(false);
  });
});
