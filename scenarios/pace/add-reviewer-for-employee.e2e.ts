import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { AddReviewerDialog, EmployeeCurrentPacePage } from '@e2e/page-objects';

describe('Add reviewer', () => {
  const addReviewerDialog = new AddReviewerDialog();
  const employeeCurrentPacePage = new EmployeeCurrentPacePage();
  const reviewerName = 'Zoltan Chivay';
  let reviewersCount: number;

  beforeAll(async () => {
    await employeeCurrentPacePage.navigate();
  });

  it('PACE timeline should be displayed', async () => {
    expect(await employeeCurrentPacePage.isPaceTimelineDisplayed()).toBe(true);
  });

  it('PACE phase should be "Initiation by employee"', async () => {
    expect(await employeeCurrentPacePage.getPhase()).toBe(getI18nText('initiationByEmployee'));
  });

  it('reviewers datatable should be displayed', async () => {
    expect(await employeeCurrentPacePage.isReviewersDatatableDisplayed()).toBe(true);
  });

  it('add reviewer button should be displayed', async () => {
    expect(await employeeCurrentPacePage.isAddReviewerButtonDisplayed()).toBe(true);
  });

  it('should open add reviewer modal window', async () => {
    reviewersCount = await employeeCurrentPacePage.getReviewersCount();

    await employeeCurrentPacePage.clickOnAddReviewerButton();

    expect(await addReviewerDialog.isDisplayed()).toBe(true);
  });

  it('reviewer field should be displayed', async () => {
    expect(await addReviewerDialog.isReviewerFieldDisplayed()).toBe(true);
  });

  it('should display error that reviewer field is required', async () => {
    await addReviewerDialog.clearReviewerField();
    await addReviewerDialog.clickOnSubmitButton();

    expect(await addReviewerDialog.isReviewerFieldErrorDisplayed()).toBe(true);

    expect(await addReviewerDialog.getReviewerFieldErrorText()).toBe(getI18nText('errorCodes.Required'));
  });

  it('should set the reviewer', async () => {
    await addReviewerDialog.setReviewerFieldValue(reviewerName);

    expect(await addReviewerDialog.getReviewerFieldValue()).toBe(reviewerName);
  });

  it('should add the reviewer', async () => {
    await addReviewerDialog.clickOnSubmitButton();
    await waitUntil(() => addReviewerDialog.isDisplayed(), true);
    await waitUntil(() => employeeCurrentPacePage.getReviewersCount(), reviewersCount);

    expect(await employeeCurrentPacePage.isReviewerDisplayed(reviewerName));
  });

  afterAll(async () => {
    await employeeCurrentPacePage.removeReviewer(reviewerName);
  });
});
