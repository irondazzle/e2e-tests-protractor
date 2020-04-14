import { PaceStatus } from '@app/features/pace/models/pace-status.model';

import { pressEscKey, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed, isMenuItemEnabled } from '@e2e/helpers/menu-helper';

import { EmployeeCurrentPacePage, MyTeamPage, SummarizePaceDialog } from '@e2e/page-objects';

describe('Summarize PACE', () => {
  const employee = 'Lambert Minor';
  const employeeCurrentPacePage = new EmployeeCurrentPacePage();
  const myTeamPage = new MyTeamPage();
  const summarizePaceDialog = new SummarizePaceDialog();
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

  it('employee’s PACE status should be "Approved"', async () => {
    expect(await myTeamPage.getEmployeePaceStatus(employee)).toBe(getI18nText('APPROVED'));
  });

  it('employee’s additional actions should be displayed', async () => {
    expect(await myTeamPage.isEmployeeAdditionalActionsDisplayed(employee)).toBe(true);
  });

  it('summarize PACE action should be displayed', async () => {
    await myTeamPage.clickOnEmployeeAdditionalActions(employee);

    expect(await isMenuItemDisplayed(getI18nText('SUMMARIZE'))).toBe(true);
  });

  it('summarize PACE action should be enabled', async () => {
    expect(await isMenuItemEnabled(getI18nText('SUMMARIZE'))).toBe(true);
  });

  it('should open summarize PACE modal window', async () => {
    await clickOnMenuItem(getI18nText('SUMMARIZE'));

    expect(await summarizePaceDialog.isDisplayed()).toBe(true);
  });

  it('should open current employee’s PACE', async () => {
    await pressEscKey();
    await myTeamPage.clickOnEmployee(employee);

    expect(await employeeCurrentPacePage.isPaceTimelineDisplayed()).toBe(true);
  });

  it('PACE phase should be "Evaluation"', async () => {
    phase = await employeeCurrentPacePage.getPhase();

    expect(phase).toBe(getI18nText('EVALUATION'));
  });

  it('summarize PACE button should be displayed', async () => {
    expect(await employeeCurrentPacePage.isStatusActionButtonDisplayed(PaceStatus.Approved)).toBe(true);
  });

  it('summarize PACE button should be enabled', async () => {
    expect(await employeeCurrentPacePage.isStatusActionButtonEnabled(PaceStatus.Approved)).toBe(true);
  });

  it('should open summarize PACE modal window', async () => {
    await employeeCurrentPacePage.clickOnStatusActionButton(PaceStatus.Approved);

    expect(await summarizePaceDialog.isDisplayed()).toBe(true);
  });

  it('should summarize PACE', async () => {
    await summarizePaceDialog.clickOnSubmitButton();
    await waitUntil(() => summarizePaceDialog.isDisplayed(), true);
    await waitUntil(() => employeeCurrentPacePage.getPhase(), phase);

    expect(await employeeCurrentPacePage.getPhase()).toBe(getI18nText('SUMMARIZE'));
    expect(await employeeCurrentPacePage.isStatusActionButtonDisplayed(PaceStatus.Approved)).toBe(false);
  });
});
