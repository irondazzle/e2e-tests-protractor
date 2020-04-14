import { pressEscKey, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed, isMenuItemEnabled } from '@e2e/helpers/menu-helper';
import { randomNumber } from '@e2e/helpers/random-helper';

import { DefineJobTracksDialog, JobFamilyGeneralPage, MyFamiliesPage } from '@e2e/page-objects';

describe('Define Job Family tracks', () => {
  const defineJobTracksDialog = new DefineJobTracksDialog();
  const jobFamilyGeneralPage = new JobFamilyGeneralPage();
  const jobTrackIndex = randomNumber(0, 4);
  const jobTracks = [
    'Functional Leadership',
    'Management',
    'Professional',
    'Software Architecture',
    'Solution Architecture'
  ].slice(jobTrackIndex, randomNumber(jobTrackIndex, 4) + 1);

  it('should create job family', async () => {
    const myFamiliesPage = new MyFamiliesPage();
    const jobFamilyId = await myFamiliesPage.createAndNavigateToJobFamily();

    expect(jobFamilyId).toBeTruthy();

    await jobFamilyGeneralPage.navigate();
  });

  it('additional actions should be displayed', async () => {
    expect(await jobFamilyGeneralPage.isAdditionalActionsDisplayed()).toBe(true);
  });

  it('"define job tracks" action should be displayed', async () => {
    await jobFamilyGeneralPage.clickOnAdditionalActions();

    expect(await isMenuItemDisplayed(getI18nText('defineJobTrack'))).toBe(true);
  });

  it('"define job tracks" action should be disabled', async () => {
    expect(await isMenuItemEnabled(getI18nText('defineJobTrack'))).toBe(false);
    await pressEscKey();
  });

  it('"define job tracks" button should be displayed', async () => {
    expect(await jobFamilyGeneralPage.isDefineJobTracksButtonDisplayed()).toBe(true);
  });

  it('should open define job tracks modal window', async () => {
    await jobFamilyGeneralPage.clickOnDefineJobTracksButton();

    expect(await defineJobTracksDialog.isDisplayed()).toBe(true);
  });

  it('job tracks should be displayed', async () => {
    expect(await defineJobTracksDialog.isJobTracksDisplayed()).toBe(true);
  });

  it('"next" button should be disabled', async () => {
    expect(await defineJobTracksDialog.isNextButtonEnabled()).toBe(false);
  });

  it('should select job tracks', async () => {
    for (const jobTrack of jobTracks) {
      await defineJobTracksDialog.clickOnJobTrack(jobTrack);

      expect(await defineJobTracksDialog.isJobTrackSelected(jobTrack)).toBe(true, jobTrack);
    }
  });

  it('"next" button should be enabled', async () => {
    expect(await defineJobTracksDialog.isNextButtonEnabled()).toBe(true);
  });

  it('change job level grades step should be displayed', async () => {
    await defineJobTracksDialog.clickOnNextButton();

    for (const jobTrack of jobTracks) {
      expect(await defineJobTracksDialog.isJobLevelGragesDisplayed(jobTrack)).toBe(true, jobTrack);
    }
  });

  it('final step should be displayed', async () => {
    await defineJobTracksDialog.clickOnNextButton();

    expect(await defineJobTracksDialog.isFinalStepDisplayed()).toBe(true);
  });

  it('should add job tracks to the job family', async () => {
    await defineJobTracksDialog.clickOnSubmitButton();
    await waitUntil(() => defineJobTracksDialog.isDisplayed(), true);

    await waitUntil(() => jobFamilyGeneralPage.isJobTracksFieldDisplayed(), false);

    for (const jobTrack of jobTracks) {
      expect(await jobFamilyGeneralPage.isJobTrackDisplayed(jobTrack)).toBe(true, jobTrack);
    }
  });

  it('"define job tracks" button should not be displayed', async () => {
    expect(await jobFamilyGeneralPage.isDefineJobTracksButtonDisplayed()).toBe(false);
  });

  it('"define job tracks" action should be enabled', async () => {
    await jobFamilyGeneralPage.clickOnAdditionalActions();

    expect(await isMenuItemEnabled(getI18nText('defineJobTrack'))).toBe(true);
  });

  it('added job track should be disabled', async () => {
    await clickOnMenuItem(getI18nText('defineJobTrack'));
    await waitUntil(() => defineJobTracksDialog.isDisplayed(), false);

    for (const jobTrack of jobTracks) {
      expect(await defineJobTracksDialog.isJobTrackEnabled(jobTrack)).toBe(false, 'Job Track is enabled');
      expect(await defineJobTracksDialog.isJobTrackSelected(jobTrack)).toBe(true, 'Job Track is not selected');
    }

    expect(await defineJobTracksDialog.isNextButtonEnabled()).toBe(false, '"Next" button is enabled');

    await pressEscKey();
    await waitUntil(() => defineJobTracksDialog.isDisplayed(), true);
  });
});
