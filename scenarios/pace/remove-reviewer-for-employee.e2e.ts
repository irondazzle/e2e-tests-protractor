import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { EmployeeCurrentPacePage, RemoveReviewerDialog } from '@e2e/page-objects';

describe('Remove reviewer', () => {
  const employeeCurrentPacePage = new EmployeeCurrentPacePage();
  const removeReviewerDialog = new RemoveReviewerDialog();
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

  it('should add the reviewer', async () => {
    await employeeCurrentPacePage.addReviewer(reviewerName);

    expect(await employeeCurrentPacePage.isReviewerDisplayed(reviewerName));
  });

  it('remove reviewer button should be displayed', async () => {
    reviewersCount = await employeeCurrentPacePage.getReviewersCount();

    expect(await employeeCurrentPacePage.isRemoveReviewerButtonDisplayed(reviewerName)).toBe(true);
  });

  it('should open remove reviewer modal window', async () => {
    await employeeCurrentPacePage.clickOnRemoveReviewerButton(reviewerName);

    expect(await removeReviewerDialog.isDisplayed()).toBe(true);
  });

  it('should remove the reviewer', async () => {
    await removeReviewerDialog.clickOnSubmitButton();
    await waitUntil(() => removeReviewerDialog.isDisplayed(), true);
    await waitUntil(() => employeeCurrentPacePage.getReviewersCount(), reviewersCount);

    expect(await employeeCurrentPacePage.isReviewerDisplayed(reviewerName)).toBe(false);
  });
});
