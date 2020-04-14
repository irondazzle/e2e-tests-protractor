import { PaceStatus } from '@app/features/pace/models/pace-status.model';

import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { EmployeeCurrentPacePage, SubmitPaceDialog } from '@e2e/page-objects';

describe('Submit PACE', () => {
  const employeeCurrentPacePage = new EmployeeCurrentPacePage();
  const submitPaceDialog = new SubmitPaceDialog();
  let phase: string;

  beforeAll(async () => {
    await employeeCurrentPacePage.navigate();
  });

  it('PACE timeline should be displayed', async () => {
    expect(await employeeCurrentPacePage.isPaceTimelineDisplayed()).toBe(true);
  });

  it('PACE phase should be "Initiation by employee"', async () => {
    phase = await employeeCurrentPacePage.getPhase();

    expect(phase).toBe(getI18nText('initiationByEmployee'));
  });

  it('submit PACE button should be displayed', async () => {
    expect(await employeeCurrentPacePage.isStatusActionButtonDisplayed(PaceStatus.Started)).toBe(true);
  });

  it('submit PACE button should be enabled', async () => {
    expect(await employeeCurrentPacePage.isStatusActionButtonEnabled(PaceStatus.Started)).toBe(true);
  });

  it('should open submit PACE modal window', async () => {
    await employeeCurrentPacePage.clickOnStatusActionButton(PaceStatus.Started);

    expect(await submitPaceDialog.isDisplayed()).toBe(true);
  });

  it('should submit PACE', async () => {
    await submitPaceDialog.clickOnSubmitButton();
    await waitUntil(() => submitPaceDialog.isDisplayed(), true);
    await waitUntil(() => employeeCurrentPacePage.getPhase(), phase);

    expect(await employeeCurrentPacePage.getPhase()).toBe(getI18nText('initiationByManager'));
    expect(await employeeCurrentPacePage.isStatusActionButtonDisplayed(PaceStatus.Started)).toBe(false);
  });
});
