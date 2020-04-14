import { PaceFeedbackStatus } from '@app/features/pace/models';

import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { AnnotatedPaceFeedbackFormPage, EmployeeCurrentPacePage, MyTeamPage } from '@e2e/page-objects';

describe('Annotate PACE feedback', () => {
  const annotatedPaceFeedbackFormPage = new AnnotatedPaceFeedbackFormPage();
  const employee = 'Lambert Minor';
  const employeeCurrentPacePage = new EmployeeCurrentPacePage();
  const firstReviewer = 'Zoltan Chivay';
  const myTeamPage = new MyTeamPage();
  const secondReviewer = 'Triss Merigold';

  beforeAll(async () => {
    await myTeamPage.navigate();
  });

  it('employee PACEs datatable should be displayed', async () => {
    expect(await myTeamPage.isPacesDatatableDisplayed()).toBe(true);
  });

  it('employee’s PACE should be displayed', async () => {
    expect(await myTeamPage.isEmployeeDisplayed(employee)).toBe(true);
  });

  it('employee’s PACE status should be "Evaluated"', async () => {
    expect(await myTeamPage.getEmployeePaceStatus(employee)).toBe(getI18nText('EVALUATED'));
  });

  it('should open current employee’s PACE', async () => {
    await myTeamPage.clickOnEmployee(employee);

    expect(await employeeCurrentPacePage.isPaceTimelineDisplayed()).toBe(true);
  });

  it('reviewers datatable should be displayed', async () => {
    expect(await employeeCurrentPacePage.isReviewersDatatableDisplayed()).toBe(true);
  });

  describe('Mark as "Useful"', () => {
    let annotatedFeedbackStatus: string;
    let feedbackStatus: string;

    it('first reviewer’s feedback should be displayed', async () => {
      expect(await employeeCurrentPacePage.isReviewerDisplayed(firstReviewer)).toBe(true);
    });

    it('first reviewer’s feedback status should be "Not rated"', async () => {
      expect(await employeeCurrentPacePage.getReviewerFeedbackStatus(firstReviewer)).toBe(getI18nText('notRated'));
    });

    it('should open annotate feedback form page', async () => {
      feedbackStatus = await employeeCurrentPacePage.getReviewerFeedbackStatus(firstReviewer);

      await employeeCurrentPacePage.clickOnReviewerFeedback(firstReviewer);

      expect(await annotatedPaceFeedbackFormPage.isDisplayed()).toBe(true);
    });

    it('should set comment', async () => {
      const comment = await annotatedPaceFeedbackFormPage.setComment();

      expect(await annotatedPaceFeedbackFormPage.getComment()).toBe(comment);
    });

    it('should set feedback status to "Useful"', async () => {
      await annotatedPaceFeedbackFormPage.setStatus(PaceFeedbackStatus.Useful);

      annotatedFeedbackStatus = await annotatedPaceFeedbackFormPage.getStatus();

      expect(annotatedFeedbackStatus).toBe(getI18nText('useful'), 'status');
    });

    it('should annotate first reviewer’s feedback', async () => {
      await annotatedPaceFeedbackFormPage.clickOnSubmitButton();
      await waitUntil(() => annotatedPaceFeedbackFormPage.isDisplayed(), true);

      await waitUntil(() => employeeCurrentPacePage.getReviewerFeedbackStatus(firstReviewer), feedbackStatus);

      expect(await employeeCurrentPacePage.getReviewerFeedbackStatus(firstReviewer)).toBe(annotatedFeedbackStatus, 'changed status');
    });
  })

  describe('Mark as "Not useful"', async () => {
    let annotatedFeedbackStatus: string;
    let feedbackStatus: string;

    it('second reviewer’s feedback should be displayed', async () => {
      expect(await employeeCurrentPacePage.isReviewerDisplayed(secondReviewer)).toBe(true);
    });

    it('second reviewer’s feedback status should be "Not rated"', async () => {
      expect(await employeeCurrentPacePage.getReviewerFeedbackStatus(secondReviewer)).toBe(getI18nText('notRated'));
    });

    it('should open annotate feedback form page', async () => {
      feedbackStatus = await employeeCurrentPacePage.getReviewerFeedbackStatus(secondReviewer);

      await employeeCurrentPacePage.clickOnReviewerFeedback(secondReviewer);

      expect(await annotatedPaceFeedbackFormPage.isDisplayed()).toBe(true);
    });

    it('should set comment', async () => {
      const comment = await annotatedPaceFeedbackFormPage.setComment();

      expect(await annotatedPaceFeedbackFormPage.getComment()).toBe(comment);
    });

    it('should set feedback status to "Not useful"', async () => {
      await annotatedPaceFeedbackFormPage.setStatus(PaceFeedbackStatus.NotUseful);

      annotatedFeedbackStatus = await annotatedPaceFeedbackFormPage.getStatus();

      expect(annotatedFeedbackStatus).toBe(getI18nText('notUseful'), 'status');
    });

    it('should annotate second reviewer’s feedback', async () => {
      await annotatedPaceFeedbackFormPage.clickOnSubmitButton();
      await waitUntil(() => annotatedPaceFeedbackFormPage.isDisplayed(), true);

      await waitUntil(() => employeeCurrentPacePage.getReviewerFeedbackStatus(secondReviewer), feedbackStatus);

      expect(await employeeCurrentPacePage.getReviewerFeedbackStatus(secondReviewer)).toBe(annotatedFeedbackStatus, 'changed status');
    });
  })

  describe('Reverse status change', () => {
    it('should set the first reviewer’s feedback status to "Not useful"', async () => {
      const reviewerFeedbackStatus = await employeeCurrentPacePage.getReviewerFeedbackStatus(firstReviewer);

      await employeeCurrentPacePage.clickOnReviewerFeedback(firstReviewer)
      await waitUntil(() => annotatedPaceFeedbackFormPage.isDisplayed(), false);

      await annotatedPaceFeedbackFormPage.setStatus(PaceFeedbackStatus.NotUseful);

      await annotatedPaceFeedbackFormPage.clickOnSubmitButton();
      await waitUntil(() => annotatedPaceFeedbackFormPage.isDisplayed(), true);

      await waitUntil(() => employeeCurrentPacePage.getReviewerFeedbackStatus(firstReviewer), reviewerFeedbackStatus);

      expect(await employeeCurrentPacePage.getReviewerFeedbackStatus(firstReviewer)).toBe(getI18nText('notUseful'));
    });

    it('should set the second reviewer’s feedback status to "Useful"', async () => {
      const reviewerFeedbackStatus = await employeeCurrentPacePage.getReviewerFeedbackStatus(secondReviewer);

      await employeeCurrentPacePage.clickOnReviewerFeedback(secondReviewer)
      await waitUntil(() => annotatedPaceFeedbackFormPage.isDisplayed(), false);

      await annotatedPaceFeedbackFormPage.setStatus(PaceFeedbackStatus.Useful);

      await annotatedPaceFeedbackFormPage.clickOnSubmitButton();
      await waitUntil(() => annotatedPaceFeedbackFormPage.isDisplayed(), true);

      await waitUntil(() => employeeCurrentPacePage.getReviewerFeedbackStatus(secondReviewer), reviewerFeedbackStatus);

      expect(await employeeCurrentPacePage.getReviewerFeedbackStatus(secondReviewer)).toBe(getI18nText('useful'));
    });
  })
});
