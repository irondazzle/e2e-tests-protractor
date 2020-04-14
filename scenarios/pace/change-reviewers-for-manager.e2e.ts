import { getI18nText } from '@e2e/helpers/i18n-helper';

import { EmployeeCurrentPacePage, MyTeamPage } from '@e2e/page-objects';

describe('Change reviewers', () => {
  const employee = 'Lambert Minor';
  const employeeCurrentPacePage = new EmployeeCurrentPacePage();
  const firstReviewerName = 'Zoltan Chivay';
  const myTeamPage = new MyTeamPage();
  const secondReviewerName = 'Triss Merigold';

  beforeAll(async () => {
    await myTeamPage.navigate();
  });

  it('employee PACEs datatable should be displayed', async () => {
    expect(await myTeamPage.isPacesDatatableDisplayed()).toBe(true);
  });

  it('employee’s PACE should be displayed', async () => {
    expect(await myTeamPage.isEmployeeDisplayed(employee)).toBe(true);
  });

  it('employee’s PACE status should be "Submitted"', async () => {
    expect(await myTeamPage.getEmployeePaceStatus(employee)).toBe(getI18nText('SUBMITTED'));
  });

  it('should open current employee’s PACE', async () => {
    await myTeamPage.clickOnEmployee(employee);

    expect(await employeeCurrentPacePage.isPaceTimelineDisplayed()).toBe(true);
  });

  it('reviewers datatable should be displayed', async () => {
    expect(await employeeCurrentPacePage.isReviewersDatatableDisplayed()).toBe(true);
  });

  it('add reviewer button should be displayed', async () => {
    expect(await employeeCurrentPacePage.isAddReviewerButtonDisplayed()).toBe(true);
  });

  it('should add the first reviewer', async () => {
    await employeeCurrentPacePage.addReviewer(firstReviewerName);

    expect(await employeeCurrentPacePage.isReviewerDisplayed(firstReviewerName)).toBe(true);
  });

  it('should add the second reviewer', async () => {
    await employeeCurrentPacePage.addReviewer(secondReviewerName);

    expect(await employeeCurrentPacePage.isReviewerDisplayed(secondReviewerName)).toBe(true);
  });

  it('should remove the second reviewer', async () => {
    await employeeCurrentPacePage.removeReviewer(secondReviewerName);

    expect(await employeeCurrentPacePage.isReviewerDisplayed(secondReviewerName)).toBe(false);
  });

  //NOTE: Added for future checks in tests
  it('should add the second reviewer', async () => {
    await employeeCurrentPacePage.addReviewer(secondReviewerName);

    expect(await employeeCurrentPacePage.isReviewerDisplayed(secondReviewerName)).toBe(true);
  });
});
