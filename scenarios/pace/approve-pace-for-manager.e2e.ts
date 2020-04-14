import { PaceStatus } from '@app/features/pace/models/pace-status.model';

import { pressEscKey, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed, isMenuItemEnabled } from '@e2e/helpers/menu-helper';

import { ApprovePaceDialog, EmployeeCurrentPacePage, MyTeamPage } from '@e2e/page-objects';

describe('Approve PACE', () => {
  const approvePaceDialog = new ApprovePaceDialog();
  const employee = 'Lambert Minor';
  const employeeCurrentPacePage = new EmployeeCurrentPacePage();
  const myTeamPage = new MyTeamPage();
  let phase: string;

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

  it('employee’s additional actions should be displayed', async () => {
    expect(await myTeamPage.isEmployeeAdditionalActionsDisplayed(employee)).toBe(true);
  });

  it('approve PACE action should be displayed', async () => {
    await myTeamPage.clickOnEmployeeAdditionalActions(employee);

    expect(await isMenuItemDisplayed(getI18nText('approve'))).toBe(true);
  });

  it('approve PACE action should be enabled', async () => {
    expect(await isMenuItemEnabled(getI18nText('approve'))).toBe(true);
  });

  it('should open approve PACE modal window', async () => {
    await clickOnMenuItem(getI18nText('approve'));

    expect(await approvePaceDialog.isDisplayed()).toBe(true);
  });

  it('should open current employee’s PACE', async () => {
    await pressEscKey();
    await myTeamPage.clickOnEmployee(employee);

    expect(await employeeCurrentPacePage.isPaceTimelineDisplayed()).toBe(true);
  });

  it('PACE phase should be "Initiation by Manager"', async () => {
    phase = await employeeCurrentPacePage.getPhase();

    expect(phase).toBe(getI18nText('initiationByManager'));
  });

  it('approve PACE button should be displayed', async () => {
    expect(await employeeCurrentPacePage.isStatusActionButtonDisplayed(PaceStatus.Submitted)).toBe(true);
  });

  it('approve PACE button should be enabled', async () => {
    expect(await employeeCurrentPacePage.isStatusActionButtonEnabled(PaceStatus.Submitted)).toBe(true);
  });

  it('should open approve PACE modal window', async () => {
    await employeeCurrentPacePage.clickOnStatusActionButton(PaceStatus.Submitted);

    expect(await approvePaceDialog.isDisplayed()).toBe(true);
  });

  it('should approve PACE', async () => {
    await approvePaceDialog.clickOnSubmitButton();
    await waitUntil(() => approvePaceDialog.isDisplayed(), true);
    await waitUntil(() => employeeCurrentPacePage.getPhase(), phase);

    expect(await employeeCurrentPacePage.getPhase()).toBe(getI18nText('EVALUATION'));
    expect(await employeeCurrentPacePage.isStatusActionButtonDisplayed(PaceStatus.Submitted)).toBe(false);
  });
});
