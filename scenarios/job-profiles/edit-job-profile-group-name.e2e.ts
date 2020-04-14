import { generateName, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';

import { EditEntityNameDialog, JobFamilyGeneralPage, JobFamilyMapPage, JobProfileGroupPage, MyFamiliesPage } from '@e2e/page-objects';

describe('Edit Job Profile Group name', () => {
  const editEntityNameDialog = new EditEntityNameDialog();
  const jobProfileGroupName = generateName();
  const jobProfileGroupPage = new JobProfileGroupPage();

  it('should create job family', async () => {
    const myFamiliesPage = new MyFamiliesPage();
    const jobFamilyId = await myFamiliesPage.createAndNavigateToJobFamily();

    expect(jobFamilyId).toBeTruthy();
  });

  it('should define job tracks', async () => {
    const jobFamilyGeneralPage = new JobFamilyGeneralPage();

    await jobFamilyGeneralPage.navigate();

    const jobTracks = await jobFamilyGeneralPage.defineJobTracks();

    for (const jobTrack of jobTracks) {
      expect(await jobFamilyGeneralPage.isJobTrackDisplayed(jobTrack)).toBe(true, jobTrack);
    }
  });

  it('should create job profile group', async () => {
    const jobFamilyMapPage = new JobFamilyMapPage();
    const jobProfileGroupId = await jobFamilyMapPage.createAndNavigateToJobProfileGroup();

    expect(jobProfileGroupId).toBeTruthy();
  });

  it('additional actions should be displayed', async () => {
    expect(await jobProfileGroupPage.isAdditionalActionsDisplayed()).toBe(true);
  });

  it('edit name action should be displayed', async () => {
    await jobProfileGroupPage.clickOnAdditionalActions();

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

  it('should set the job profile group name', async () => {
    await editEntityNameDialog.setNameFieldValue(jobProfileGroupName);

    expect(await editEntityNameDialog.getNameFieldValue()).toBe(jobProfileGroupName);
  });

  it('should change the job profile group name', async () => {
    const oldHeaderName = await jobProfileGroupPage.getHeaderName();

    await editEntityNameDialog.clickOnSubmitButton();
    await waitUntil(() => editEntityNameDialog.isDisplayed(), true);
    await waitUntil(() => jobProfileGroupPage.getHeaderName(), oldHeaderName);

    expect(await jobProfileGroupPage.getHeaderName()).toBe(jobProfileGroupName);
    expect(await jobProfileGroupPage.getBreadcrumbsName()).toBe(jobProfileGroupName, 'Job Profile Group breadcrumbs name is not changed');
  });
});
