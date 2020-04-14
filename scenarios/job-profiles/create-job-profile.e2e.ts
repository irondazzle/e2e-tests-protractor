import { generateName, getCurrentUsername, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { randomNumber } from '@e2e/helpers/random-helper';

import {
  CreateJobProfileDialog,
  JobFamilyGeneralPage,
  JobFamilyMapPage,
  JobProfileGroupGeneralPage,
  JobProfileGroupMapPage,
  MyFamiliesPage
} from '@e2e/page-objects';

describe('Create Job Profile', () => {
  const createJobProfileDialog = new CreateJobProfileDialog();
  const jobFamilyGeneralPage = new JobFamilyGeneralPage();
  const jobFamilyMapPage = new JobFamilyMapPage();
  const myFamiliesPage = new MyFamiliesPage();
  let jobFamilyId: string;
  let jobTracks: string[];

  function commonTests(jobProfileName: string) {
    it('job profile name field should be displayed', async () => {
      expect(await createJobProfileDialog.isNameFieldDisplayed()).toBe(true);
    });

    it('owner field should be displayed', async () => {
      expect(await createJobProfileDialog.isOwnerFieldDisplayed()).toBe(true);
    });

    it('job tracks should be displayed', async () => {
      expect(await createJobProfileDialog.isJobTracksDisplayed()).toBe(true);
    });

    it('should display errors that name, owner and job track fields are required', async () => {
      await createJobProfileDialog.clearOwnerField();
      await createJobProfileDialog.clickOnSubmitButton();

      expect(await createJobProfileDialog.isNameFieldErrorDisplayed()).toBe(true, 'Name ');
      expect(await createJobProfileDialog.isOwnerFieldErrorDisplayed()).toBe(true, 'Owner');
      expect(await createJobProfileDialog.isJobTracksFieldErrorDisplayed()).toBe(true, 'Job Track');

      expect(await createJobProfileDialog.getNameFieldErrorText())
        .toBe(getI18nText('errorCodes.Required'), 'Name error incorrect text');
      expect(await createJobProfileDialog.getOwnerFieldErrorText())
        .toBe(getI18nText('errorCodes.Required'), 'Owner error incorrect text');
      expect(await createJobProfileDialog.getJobTracksFieldErrorText())
        .toBe(getI18nText('errorCodes.JobTrackRequired'), 'Job Track error incorrect text');
    });

    it('should display error that job profile name is longer than 64 symbols', async () => {
      await createJobProfileDialog.setNameFieldValue('Curabitur blandit enim vel consectetur pharetra arcu lacus malesuada');
      await createJobProfileDialog.clickOnSubmitButton();

      expect(await createJobProfileDialog.isNameFieldErrorDisplayed()).toBe(true);
      expect(await createJobProfileDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.StringLength', { length: 64 }));
    });

    it('should set the job profile name', async () => {
      await createJobProfileDialog.setNameFieldValue(jobProfileName);

      expect(await createJobProfileDialog.getNameFieldValue()).toBe(jobProfileName);
    });

    it('should set the job profile owner', async () => {
      const ownerName = await getCurrentUsername();

      await createJobProfileDialog.setOwnerFieldValue(ownerName);

      expect(await createJobProfileDialog.getOwnerFieldValue()).toBe(ownerName);
    });

    it('should select the job track', async () => {
      const jobTrack = jobTracks[randomNumber(0, jobTracks.length - 1)];

      await createJobProfileDialog.setJobTrack(jobTrack);

      expect(await createJobProfileDialog.isJobTrackSelected(jobTrack)).toBe(true);
    });
  }

  it('should create job family', async () => {
    jobFamilyId = await myFamiliesPage.createAndNavigateToJobFamily();

    expect(jobFamilyId).toBeTruthy();
  });

  it('should define job tracks', async () => {
    await jobFamilyGeneralPage.navigate();

    jobTracks = await jobFamilyGeneralPage.defineJobTracks();

    for (const jobTrack of jobTracks) {
      expect(await jobFamilyGeneralPage.isJobTrackDisplayed(jobTrack)).toBe(true, jobTrack);
    }
  });

  describe('from "my families"', () => {
    const jobProfileName = generateName();

    beforeAll(async () => {
      await myFamiliesPage.navigate();
    });

    it('create job profile button should be displayed', async () => {
      expect(await myFamiliesPage.isCreateJobProfileButtonDisplayed(jobFamilyId)).toBe(true);
    });

    it('create job profile button should be enabled', async () => {
      expect(await myFamiliesPage.isCreateJobProfileButtonEnabled(jobFamilyId)).toBe(true);
    });

    it('should open create job profile modal window', async () => {
      await myFamiliesPage.clickOnCreateJobProfileButton(jobFamilyId);

      expect(await createJobProfileDialog.isDisplayed()).toBe(true);
    });

    commonTests(jobProfileName);

    it('should create job profile', async () => {
      await createJobProfileDialog.clickOnSubmitButton();
      await waitUntil(() => createJobProfileDialog.isDisplayed(), true);

      expect(await myFamiliesPage.getJobProfileId(jobProfileName)).toBeTruthy();
    });
  });

  describe('from job family', () => {
    describe('from "general" tab', () => {
      const jobProfileName = generateName();

      beforeAll(async () => {
        await myFamiliesPage.navigateToJobFamily(jobFamilyId);
        await jobFamilyGeneralPage.navigate();
      });

      it('job profiles datatable should be displayed', async () => {
        expect(await jobFamilyGeneralPage.isJobProfilesDataTableDisplayed()).toBe(true);
      });

      it('create job profile button should be displayed', async () => {
        expect(await jobFamilyGeneralPage.isCreateJobProfileButtonDisplayed()).toBe(true);
      });

      it('create job profile modal window should be shown', async () => {
        await jobFamilyGeneralPage.clickOnCreateJobProfileButton();

        expect(await createJobProfileDialog.isDisplayed()).toBe(true);
      });

      commonTests(jobProfileName);

      it('should create job profile', async () => {
        await createJobProfileDialog.clickOnSubmitButton();
        await waitUntil(() => createJobProfileDialog.isDisplayed(), true);

        expect(await jobFamilyGeneralPage.isJobProfileCreated(jobProfileName)).toBeTruthy();
      });
    });

    describe('from "map" tab', () => {
      const jobProfileName = generateName();

      beforeAll(async () => {
        await jobFamilyMapPage.navigate();
      });

      it('create job profile button should be displayed', async () => {
        await jobFamilyMapPage.clickOnCreateChildButton();

        expect(await jobFamilyMapPage.isCreateJobProfileButtonDisplayed()).toBe(true);
      });

      it('create job profile modal window should be shown', async () => {
        await jobFamilyMapPage.clickOnСreateJobProfileButton()

        expect(await createJobProfileDialog.isDisplayed()).toBe(true);
      });

      commonTests(jobProfileName);

      it('should create job profile', async () => {
        await createJobProfileDialog.clickOnSubmitButton();
        await waitUntil(() => createJobProfileDialog.isDisplayed(), true);

        expect(await jobFamilyMapPage.getJobProfileId(jobProfileName)).toBeTruthy();
      });
    });
  });

  describe('from job profile group', () => {
    it('should create job profile group', async () => {
      const jobProfileGroupId = await jobFamilyMapPage.createAndNavigateToJobProfileGroup();

      expect(jobProfileGroupId).toBeTruthy();
    });

    describe('from "map" tab', () => {
      const jobProfileGroupMapPage = new JobProfileGroupMapPage();
      const jobProfileName = generateName();

      beforeAll(async () => {
        await jobProfileGroupMapPage.navigate();
      });

      it('create job profile button should be displayed', async () => {
        expect(await jobProfileGroupMapPage.isCreateJobProfileButtonDisplayed()).toBe(true);
      });

      it('create job profile modal window should be shown', async () => {
        await jobProfileGroupMapPage.clickOnCreateJobProfileButton();

        expect(await createJobProfileDialog.isDisplayed()).toBe(true);
      });

      commonTests(jobProfileName);

      it('should create job profile', async () => {
        await createJobProfileDialog.clickOnSubmitButton();
        await waitUntil(() => createJobProfileDialog.isDisplayed(), true);

        expect(await jobProfileGroupMapPage.getJobProfileId(jobProfileName)).toBeTruthy();
      });
    });

    describe('from "general" tab', () => {
      const jobProfileGroupGeneralPage = new JobProfileGroupGeneralPage();
      const jobProfileName = generateName();

      beforeAll(async () => {
        await jobProfileGroupGeneralPage.navigate();
      });

      it('job profiles datatable should be displayed', async () => {
        expect(await jobProfileGroupGeneralPage.isJobProfilesDataTableDisplayed()).toBe(true);
      });

      it('create job profile button should be displayed', async () => {
        expect(await jobProfileGroupGeneralPage.isCreateJobProfileButtonDisplayed()).toBe(true);
      });

      it('create job profile modal window should be shown', async () => {
        await jobProfileGroupGeneralPage.clickOnCreateJobProfileButton();

        expect(await createJobProfileDialog.isDisplayed()).toBe(true);
      });

      commonTests(jobProfileName);

      it('should create job profile', async () => {
        await createJobProfileDialog.clickOnSubmitButton();
        await waitUntil(() => createJobProfileDialog.isDisplayed(), true);

        expect(await jobProfileGroupGeneralPage.isJobProfileCreated(jobProfileName)).toBeTruthy();
      });
    });
  });
});
