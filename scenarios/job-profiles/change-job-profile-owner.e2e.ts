import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';
import { randomNumber } from '@e2e/helpers/random-helper';

import { ChangeEntityOwnerDialog, JobFamilyGeneralPage, JobFamilyMapPage, JobProfileGeneralPage, MyFamiliesPage } from '@e2e/page-objects';

describe('Change Job Profile owner', () => {
  const changeEntityOwnerDialog = new ChangeEntityOwnerDialog();
  const jobProfileGeneralPage = new JobProfileGeneralPage();
  const ownerName = 'Roman Berezin';
  let jobTracks: string[];

  it('should create job family', async () => {
    const myFamiliesPage = new MyFamiliesPage();
    const jobFamilyId = await myFamiliesPage.createAndNavigateToJobFamily();

    expect(jobFamilyId).toBeTruthy();
  });

  it('should define job tracks', async () => {
    const jobFamilyGeneralPage = new JobFamilyGeneralPage();

    await jobFamilyGeneralPage.navigate();

    jobTracks = await jobFamilyGeneralPage.defineJobTracks();

    for (const jobTrack of jobTracks) {
      expect(await jobFamilyGeneralPage.isJobTrackDisplayed(jobTrack)).toBe(true, jobTrack);
    }
  });

  it('should create job profile', async () => {
    const jobFamilyMapPage = new JobFamilyMapPage();
    const jobProfileId = await jobFamilyMapPage.createAndNavigateToJobProfile(jobTracks[randomNumber(0, jobTracks.length - 1)]);

    expect(jobProfileId).toBeTruthy();

    await jobProfileGeneralPage.navigate();
  });

  it('additional actions should be displayed', async () => {
    expect(await jobProfileGeneralPage.isAdditionalActionsDisplayed()).toBe(true);
  });

  it('change owner action should be displayed', async () => {
    await jobProfileGeneralPage.clickOnAdditionalActions();

    expect(await isMenuItemDisplayed(getI18nText('changeOwner'))).toBe(true);
  });

  it('should open change owner modal window', async () => {
    await clickOnMenuItem(getI18nText('changeOwner'));

    expect(await changeEntityOwnerDialog.isDisplayed()).toBe(true);
  });

  it('owner field should be displayed', async () => {
    expect(await changeEntityOwnerDialog.isOwnerFieldDisplayed()).toBe(true);
  });

  it('should display error that owner field is required', async () => {
    await changeEntityOwnerDialog.clearOwnerField();
    await changeEntityOwnerDialog.clickOnSubmitButton();

    expect(await changeEntityOwnerDialog.isOwnerFieldDisplayed()).toBe(true);

    expect(await changeEntityOwnerDialog.getOwnerFieldErrorText()).toBe(getI18nText('errorCodes.Required'));
  });

  it('should set the job profile owner', async () => {
    await changeEntityOwnerDialog.setOwnerFieldValue(ownerName);

    expect(await changeEntityOwnerDialog.getOwnerFieldValue()).toBe(ownerName);
  });

  it('should change the job profile owner', async () => {
    const oldProfileOwner = await jobProfileGeneralPage.getOwner();

    await changeEntityOwnerDialog.clickOnSubmitButton();
    await waitUntil(() => changeEntityOwnerDialog.isDisplayed(), true);
    await waitUntil(() => jobProfileGeneralPage.getOwner(), oldProfileOwner);

    expect(await jobProfileGeneralPage.getOwner()).toBe(ownerName);
  });
});
