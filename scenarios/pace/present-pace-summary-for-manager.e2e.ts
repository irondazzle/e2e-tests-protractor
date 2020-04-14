import { PaceStatus } from '@app/features/pace/models/pace-status.model';

import { pressEscKey, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed, isMenuItemEnabled } from '@e2e/helpers/menu-helper';

import { EmployeeCurrentPacePage, MyTeamPage, PresentPaceSummaryDialog, SummarizedPaceFeedbackFormPage } from '@e2e/page-objects';

describe('Present PACE summary', () => {
  const employee = 'Lambert Minor';
  const employeeCurrentPacePage = new EmployeeCurrentPacePage();
  const myTeamPage = new MyTeamPage();
  const presentPaceSummaryDialog = new PresentPaceSummaryDialog();
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

  it('employee’s PACE status should be "Evaluated"', async () => {
    expect(await myTeamPage.getEmployeePaceStatus(employee)).toBe(getI18nText('EVALUATED'));
  });

  it('employee’s additional actions should be displayed', async () => {
    expect(await myTeamPage.isEmployeeAdditionalActionsDisplayed(employee)).toBe(true);
  });

  it('present PACE summary action should be displayed', async () => {
    await myTeamPage.clickOnEmployeeAdditionalActions(employee);

    expect(await isMenuItemDisplayed(getI18nText('feedbackDiscussion'))).toBe(true);
  });

  it('present PACE summary action should be enabled', async () => {
    expect(await isMenuItemEnabled(getI18nText('feedbackDiscussion'))).toBe(true);
  });

  it('should open present PACE summary modal window', async () => {
    await clickOnMenuItem(getI18nText('feedbackDiscussion'));

    expect(await presentPaceSummaryDialog.isDisplayed()).toBe(true);
  });

  it('should open current employee’s PACE', async () => {
    await pressEscKey();
    await myTeamPage.clickOnEmployee(employee);

    expect(await employeeCurrentPacePage.isPaceTimelineDisplayed()).toBe(true);
  });

  it('PACE phase should be "Summarize"', async () => {
    phase = await employeeCurrentPacePage.getPhase();

    expect(phase).toBe(getI18nText('SUMMARIZE'));
  });

  it('present PACE summary button should be displayed', async () => {
    expect(await employeeCurrentPacePage.isStatusActionButtonDisplayed(PaceStatus.Evaluated)).toBe(true);
  });

  it('present PACE summary button should be enabled', async () => {
    expect(await employeeCurrentPacePage.isStatusActionButtonEnabled(PaceStatus.Evaluated)).toBe(true);
  });

  it('should open present PACE summary modal window', async () => {
    await employeeCurrentPacePage.clickOnStatusActionButton(PaceStatus.Evaluated);

    expect(await presentPaceSummaryDialog.isDisplayed()).toBe(true);
  });

  it('should present PACE summary', async () => {
    await presentPaceSummaryDialog.clickOnSubmitButton();
    await waitUntil(() => presentPaceSummaryDialog.isDisplayed(), true);
    await waitUntil(() => employeeCurrentPacePage.getPhase(), phase);

    expect(await employeeCurrentPacePage.getPhase()).toBe(getI18nText('FEEDBACK'));
    expect(await employeeCurrentPacePage.isStatusActionButtonDisplayed(PaceStatus.Summarized)).toBe(true);

    expect(await employeeCurrentPacePage.isShowFeedbackButtonDisplayed()).toBe(true);
  });

  it('should check that PACE score is correct', async () => {
    const paceScore = 'Exceeds expectations';
    const summarizedPaceFeedbackFormPage = new SummarizedPaceFeedbackFormPage();

    await employeeCurrentPacePage.clickOnShowFeedbackButton();
    await waitUntil(() => summarizedPaceFeedbackFormPage.isDisplayed(), false);

    expect(await summarizedPaceFeedbackFormPage.getSummarizedPaceScore()).toBe(paceScore);
  });
});
