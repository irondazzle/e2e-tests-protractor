import { generateName, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { CreateJobProfileGroupDialog, JobFamilyGeneralPage, JobFamilyMapPage, MyFamiliesPage } from '@e2e/page-objects';

describe('Create Job Profile Group', () => {
  const createJobProfileGroupDialog = new CreateJobProfileGroupDialog();
  const jobFamilyGeneralPage = new JobFamilyGeneralPage();
  const jobFamilyMapPage = new JobFamilyMapPage();

  function commonTests(jobProfileGroupName: string) {
    it('job profile group name field should be displayed', async () => {
      expect(await createJobProfileGroupDialog.isNameFieldDisplayed()).toBe(true);
    });

    it('should display errors that name field is required', async () => {
      await createJobProfileGroupDialog.clickOnSubmitButton();

      expect(await createJobProfileGroupDialog.isNameFieldErrorDisplayed()).toBe(true);

      expect(await createJobProfileGroupDialog.getNameFieldErrorText())
        .toBe(getI18nText('errorCodes.Required'), 'Name error incorrect text');
    });

    it('should display error that job profile group name is longer than 64 symbols', async () => {
      await createJobProfileGroupDialog.setNameFieldValue('Curabitur blandit enim vel consectetur pharetra arcu lacus malesuada');
      await createJobProfileGroupDialog.clickOnSubmitButton();

      expect(await createJobProfileGroupDialog.isNameFieldErrorDisplayed()).toBe(true);
      expect(await createJobProfileGroupDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.StringLength', { length: 64 }));
    });

    it('should set the job profile group name', async () => {
      await createJobProfileGroupDialog.setNameFieldValue(jobProfileGroupName);

      expect(await createJobProfileGroupDialog.getNameFieldValue()).toBe(jobProfileGroupName);
    });
  }

  it('should create job family', async () => {
    const myFamiliesPage = new MyFamiliesPage();
    const jobFamilyId = await myFamiliesPage.createAndNavigateToJobFamily();

    expect(jobFamilyId).toBeTruthy();
  });

  it('create child button on "map" page should be disabled', async () => {
    await jobFamilyMapPage.navigate();

    expect(await jobFamilyMapPage.isCreateChildButtonDisplayed()).toBe(true, 'Button is not displayed');
    expect(await jobFamilyMapPage.isCreateChildButtonEnabled()).toBe(false, 'Button is enabled');
  });

  it('create job profile group button on "general" page should be disabled', async () => {
    await jobFamilyGeneralPage.navigate();

    expect(await jobFamilyGeneralPage.isCreateJobProfileGroupButtonDisplayed()).toBe(true, 'Button is not displayed');
    expect(await jobFamilyGeneralPage.isCreateJobProfileGroupButtonEnabled()).toBe(false, 'Button is enabled');
  });

  it('should define job tracks', async () => {
    const jobTracks = await jobFamilyGeneralPage.defineJobTracks();

    for (const jobTrack of jobTracks) {
      expect(await jobFamilyGeneralPage.isJobTrackDisplayed(jobTrack)).toBe(true, jobTrack);
    }
  });

  describe('from family "map" tab', () => {
    const jobProfileGroupName = generateName();

    beforeAll(async () => {
      await jobFamilyMapPage.navigate();
    });

    it('create child button should be enabled', async () => {
      expect(await jobFamilyMapPage.isCreateChildButtonEnabled()).toBe(true);
    });

    it('create job profile group action should be displayed', async () => {
      await jobFamilyMapPage.clickOnCreateChildButton();

      expect(await jobFamilyMapPage.isCreateJobProfileGroupButtonDisplayed()).toBe(true);
    });

    it('should open create job profile group modal window', async () => {
      await jobFamilyMapPage.clickOnСreateJobProfileGroupButton()

      expect(await createJobProfileGroupDialog.isDisplayed()).toBe(true);
    });

    commonTests(jobProfileGroupName);

    it('shoud create job profile group', async () => {
      await createJobProfileGroupDialog.clickOnSubmitButton();
      await waitUntil(() => createJobProfileGroupDialog.isDisplayed(), true);

      expect(await jobFamilyMapPage.getJobProfileGroupId(jobProfileGroupName)).toBeTruthy();
    });
  });

  describe('from family "general" tab', () => {
    const jobProfileGroupName = generateName();

    beforeAll(async () => {
      await jobFamilyGeneralPage.navigate();
    });

    it('job profile groups datatable should be displayed', async () => {
      expect(await jobFamilyGeneralPage.isJobProfileGroupsDataTableDisplayed()).toBe(true);
    });

    it('create job profile group button should be enabled', async () => {
      expect(await jobFamilyGeneralPage.isCreateJobProfileGroupButtonEnabled()).toBe(true);
    });

    it('should open create job profile group modal window', async () => {
      await jobFamilyGeneralPage.clickOnCreateJobProfileGroupButton();

      expect(await createJobProfileGroupDialog.isDisplayed()).toBe(true);
    });

    commonTests(jobProfileGroupName);

    it('should create job profile group', async () => {
      await createJobProfileGroupDialog.clickOnSubmitButton();
      await waitUntil(() => createJobProfileGroupDialog.isDisplayed(), true);

      expect(await jobFamilyGeneralPage.isJobProfileGroupCreated(jobProfileGroupName)).toBe(true);
    });
  });
});
