import { generateName, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';
import { randomNumber } from '@e2e/helpers/random-helper';

import { EditEntityNameDialog, JobFamilyGeneralPage, JobFamilyMapPage, JobProfilePage, MyFamiliesPage } from '@e2e/page-objects';

describe('Edit Job Profile name', () => {
  const editEntityNameDialog = new EditEntityNameDialog();
  const jobProfileName = generateName();
  const jobProfilePage = new JobProfilePage();
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
  });

  it('additional actions should be displayed', async () => {
    expect(await jobProfilePage.isAdditionalActionsDisplayed()).toBe(true);
  });

  it('edit name action should be displayed', async () => {
    await jobProfilePage.clickOnAdditionalActions();

    expect(await isMenuItemDisplayed(getI18nText('editName'))).toBe(true);
  });

  it('should open edit name modal window', async () => {
    await clickOnMenuItem(getI18nText('editName'));

    expect(await editEntityNameDialog.isDisplayed()).toBe(true);
  });

  it('name field should be displayed', async () => {
    expect(await editEntityNameDialog.isNameFieldDisplayed()).toBe(true);
  });

  it('should display error that name field is required', async () => {
    await editEntityNameDialog.clearNameField();
    await editEntityNameDialog.clickOnSubmitButton();

    expect(await editEntityNameDialog.isNameFieldErrorDisplayed()).toBe(true);

    expect(await editEntityNameDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.Required'));
  });

  it('should display error that name is longer than 64 symbols', async () => {
    await editEntityNameDialog.setNameFieldValue('Curabitur blandit enim vel consectetur pharetra arcu lacus malesuada');
    await editEntityNameDialog.clickOnSubmitButton();

    expect(await editEntityNameDialog.isNameFieldErrorDisplayed()).toBe(true);
    expect(await editEntityNameDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.StringLength', { length: 64 }));
  });

  it('should set the job profile name', async () => {
    await editEntityNameDialog.setNameFieldValue(jobProfileName);

    expect(await editEntityNameDialog.getNameFieldValue()).toBe(jobProfileName);
  });

  it('should change the job profile name', async () => {
    const oldHeaderName = await jobProfilePage.getHeaderName();

    await editEntityNameDialog.clickOnSubmitButton();
    await waitUntil(() => editEntityNameDialog.isDisplayed(), true);
    await waitUntil(() => jobProfilePage.getHeaderName(), oldHeaderName);

    expect(await jobProfilePage.getHeaderName()).toBe(jobProfileName);
    expect(await jobProfilePage.getBreadcrumbsName()).toBe(jobProfileName, 'Job Profile breadcrumbs name is not changed');
  });
});
