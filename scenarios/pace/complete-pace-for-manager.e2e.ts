import { PaceStatus } from '@app/features/pace/models/pace-status.model';

import { pressEscKey, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed, isMenuItemEnabled } from '@e2e/helpers/menu-helper';

import { CompletePaceDialog, EmployeeCurrentPacePage, EmployeePastPacesPage, MyTeamPage } from '@e2e/page-objects';

describe('Complete PACE', () => {
  const completePaceDialog = new CompletePaceDialog();
  const employee = 'Lambert Minor';
  const employeeCurrentPacePage = new EmployeeCurrentPacePage();
  const employeePastPacesPage = new EmployeePastPacesPage();
  const myTeamPage = new MyTeamPage();
  let pastPacesCount: number;
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

  it('employee’s PACE status should be "Summarized"', async () => {
    expect(await myTeamPage.getEmployeePaceStatus(employee)).toBe(getI18nText('SUMMARIZED'));
  });

  it('employee’s additional actions should be displayed', async () => {
    expect(await myTeamPage.isEmployeeAdditionalActionsDisplayed(employee)).toBe(true);
  });

  it('complete PACE action should be displayed', async () => {
    await myTeamPage.clickOnEmployeeAdditionalActions(employee);

    expect(await isMenuItemDisplayed(getI18nText('complete'))).toBe(true);
  });

  it('complete PACE action should be enabled', async () => {
    expect(await isMenuItemEnabled(getI18nText('complete'))).toBe(true);
  });

  it('should open complete PACE modal window', async () => {
    await clickOnMenuItem(getI18nText('complete'));

    expect(await completePaceDialog.isDisplayed()).toBe(true);
  });

  it('should open current employee’s PACE', async () => {
    await pressEscKey();
    await myTeamPage.clickOnEmployee(employee);

    expect(await employeeCurrentPacePage.isPaceTimelineDisplayed()).toBe(true);
  });

  it('PACE phase should be "Feedback"', async () => {
    await employeePastPacesPage.navigateToPastPacesTab();

    pastPacesCount = await employeePastPacesPage.getPastPacesCount();

    await employeeCurrentPacePage.navigateToCurrentPaceTab();

    phase = await employeeCurrentPacePage.getPhase();

    expect(phase).toBe(getI18nText('FEEDBACK'));
  });

  it('complete PACE button should be displayed', async () => {
    expect(await employeeCurrentPacePage.isStatusActionButtonDisplayed(PaceStatus.Summarized)).toBe(true);
  });

  it('complete PACE button should be enabled', async () => {
    expect(await employeeCurrentPacePage.isStatusActionButtonEnabled(PaceStatus.Summarized)).toBe(true);
  });

  it('should open complete PACE modal window', async () => {
    await employeeCurrentPacePage.clickOnStatusActionButton(PaceStatus.Summarized);

    expect(await completePaceDialog.isDisplayed()).toBe(true);
  });

  it('should complete  PACE', async () => {
    await completePaceDialog.clickOnSubmitButton();
    await waitUntil(() => completePaceDialog.isDisplayed(), true);
    await waitUntil(() => employeeCurrentPacePage.getPhase(), phase);

    expect(await employeeCurrentPacePage.isStatusActionButtonDisplayed(PaceStatus.Summarized)).toBe(false);

    await employeePastPacesPage.navigateToPastPacesTab();

    expect(await employeePastPacesPage.getPastPacesCount()).toBe(pastPacesCount + 1);
  });
});
