import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { generateName, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import {
  CareerMatrixFamiliesPage,
  CareerMatrixFamilyPage,
  CareerMatrixPage,
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  JobFamilyGeneralPage,
  JobFamilyMapPage,
  JobFamilyRequirementsPage,
  JobProfileGeneralPage,
  JobProfileRequirementsPage,
  MyCompetenciesGroupsPage,
  MyFamiliesPage,
  UpdateCareerMatrixDialog
} from '@e2e/page-objects';

describe('Create career matrix', () => {
  const careerMatrixFamiliesPage = new CareerMatrixFamiliesPage();
  const careerMatrixFamilyPage = new CareerMatrixFamilyPage();
  const careerMatrixPage = new CareerMatrixPage();
  const competencyGeneralPage = new CompetenciesNodeGeneralPage();
  const competencyGroupName = generateName();
  const firstCompetencyName = generateName();
  const groupMapPage = new CompetenciesGroupMapPage();
  const jobFamilyName = generateName();
  const jobFamilyRequirementsPage = new JobFamilyRequirementsPage();
  const jobProfileGeneralPage = new JobProfileGeneralPage();
  const jobProfileName = generateName();
  const jobProfileRequirementsPage = new JobProfileRequirementsPage();
  const secondCompetencyName = generateName();
  const updateCareerMatrixDialog = new UpdateCareerMatrixDialog();
  let firstRequirementAssignment: Map<string, string> = new Map();
  let jobTracks: string[];
  let oldLastCareerMatrixUpdate: string;
  let secondRequirementAssignment: Map<string, string> = new Map();

  it('should create competencies group', async () => {
    const myGroupsPage = new MyCompetenciesGroupsPage();
    const competencyGroupId = await myGroupsPage.createAndNavigateToCompetencyGroup(competencyGroupName);

    expect(competencyGroupId).toBeTruthy();
  });

  it('should create first competency', async () => {
    const firstCompetencyId = await groupMapPage.createAndNavigateToCompetency(ProficiencyScaleDefinitionMode.Basic, firstCompetencyName);

    expect(firstCompetencyId).toBeTruthy();

    await competencyGeneralPage.navigate();
  });

  it('should describe first competency’s proficiency scale', async () => {
    await competencyGeneralPage.describePS(ProficiencyScaleDefinitionMode.Basic);

    expect(true).toBe(true);
  });

  it('should mark first competency as ready', async () => {
    expect(await competencyGeneralPage.markAsReady()).toBe(getI18nText('READY'));
  });

  it('should create second competency', async () => {
    await competencyGeneralPage.navigateToParent();

    const secondCompetencyId = await groupMapPage.createAndNavigateToCompetency(
      ProficiencyScaleDefinitionMode.Extended,
      secondCompetencyName
    );

    expect(secondCompetencyId).toBeTruthy();

    await competencyGeneralPage.navigate();
  });

  it('should describe second competency’s proficiency scale', async () => {
    await competencyGeneralPage.describePS(ProficiencyScaleDefinitionMode.Extended);

    expect(true).toBe(true);
  });

  it('should mark second competency as ready', async () => {
    expect(await competencyGeneralPage.markAsReady()).toBe(getI18nText('READY'));
  });

  it('should create job family', async () => {
    const myFamiliesPage = new MyFamiliesPage();
    const jobFamilyId = await myFamiliesPage.createAndNavigateToJobFamily(jobFamilyName);

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

  it('should add job family requirement to the first job track', async () => {
    await jobFamilyRequirementsPage.navigate();

    await jobFamilyRequirementsPage.addRequirement(jobTracks[0], [competencyGroupName, firstCompetencyName]);

    expect(true).toBe(true);
  });

  it('should assign job family requirement in the first job track', async () => {
    firstRequirementAssignment = await jobFamilyRequirementsPage.assignRequirement(jobTracks[0], firstCompetencyName);

    for (const [jobLevelTitle, psLevelTitle] of firstRequirementAssignment) {
      expect(await jobFamilyRequirementsPage.getRequirementPSLevel(jobTracks[0], firstCompetencyName, jobLevelTitle))
        .toBe(psLevelTitle, 'PS level is not correct');
    }
  });

  it('should create job profile in the first job track', async () => {
    const jobFamilyMapPage = new JobFamilyMapPage();
    const jobProfileId = await jobFamilyMapPage.createAndNavigateToJobProfile(jobTracks[0], jobProfileName);

    expect(jobProfileId).toBeTruthy();
  });

  it('should add second requirement', async () => {
    await jobProfileRequirementsPage.navigate();

    await jobProfileRequirementsPage.addRequirement([competencyGroupName, secondCompetencyName]);

    expect(true).toBe(true);
  });

  it('should assign second requirement', async () => {
    secondRequirementAssignment = await jobProfileRequirementsPage.assignRequirement(secondCompetencyName);

    for (const [jobLevelTitle, psLevelTitle] of secondRequirementAssignment) {
      expect(await jobProfileRequirementsPage.getRequirementPSLevel(secondCompetencyName, jobLevelTitle))
        .toBe(psLevelTitle, 'PS level is not correct');
    }
  });

  it('create career matrix button should be displayed', async () => {
    await jobProfileGeneralPage.navigate();

    oldLastCareerMatrixUpdate = await jobProfileGeneralPage.getLastCareerMatrixUpdate();

    expect(await jobProfileGeneralPage.isCreateCareerMatrixButtonDisplayed()).toBe(true);
  });

  it('should open create career matrix modal window', async () => {
    await jobProfileGeneralPage.clickOnCreateCareerMatrixButton();

    expect(await updateCareerMatrixDialog.isDisplayed()).toBe(true);
  });

  it('should create career matrix', async () => {
    await updateCareerMatrixDialog.clickOnSubmitButton();
    await waitUntil(() => updateCareerMatrixDialog.isDisplayed(), true);
    await waitUntil(() => jobProfileGeneralPage.getLastCareerMatrixUpdate(), oldLastCareerMatrixUpdate);

    expect(await jobProfileGeneralPage.isCreateCareerMatrixButtonDisplayed()).toBe(false, 'Create');
    expect(await jobProfileGeneralPage.isReloadCareerMatrixButtonDisplayed()).toBe(true, 'Reload');
  });

  it('career matrix family should be displayed', async () => {
    await careerMatrixFamiliesPage.navigate();

    expect(await careerMatrixFamiliesPage.isFamilyDisplayed(jobFamilyName)).toBe(true);
  });

  it('career matrix should be displayed', async () => {
    const jobFamilyId = await careerMatrixFamiliesPage.getFamilyId(jobFamilyName);

    await careerMatrixFamiliesPage.navigateToFamily(jobFamilyId);

    expect(await careerMatrixFamilyPage.isMatrixDisplayed(jobProfileName)).toBe(true);
  });

  it('career matrix assignment should be displayed', async () => {
    const jobProfileId = await careerMatrixFamilyPage.getMatrixId(jobProfileName);

    await careerMatrixFamilyPage.navigateToMatrix(jobProfileId);

    expect(await careerMatrixPage.isDisplayed()).toBe(true);
  });

  it('career matrix assignment should be the same as in job profile', async () => {
    const firstMatrixRequirementAssignment: Map<string, string> = new Map();
    const jobLevelsCount = await careerMatrixPage.getJobLevelsCount();
    const secondMatrixRequirementAssignment: Map<string, string> = new Map();

    for (let i = 0; i < jobLevelsCount; i++) {
      firstMatrixRequirementAssignment.set(
        await careerMatrixPage.getJobLevelTitle(i),
        await careerMatrixPage.getPSLevelTitle(firstCompetencyName, i)
      );

      secondMatrixRequirementAssignment.set(
        await careerMatrixPage.getJobLevelTitle(i),
        await careerMatrixPage.getPSLevelTitle(secondCompetencyName, i)
      );
    }

    for (const [jobLevelTitle, psLevelTitle] of firstRequirementAssignment) {
      expect(firstMatrixRequirementAssignment.get(jobLevelTitle)).toBe(psLevelTitle, 'First requirement');
    }

    for (const [jobLevelTitle, psLevelTitle] of secondRequirementAssignment) {
      expect(secondMatrixRequirementAssignment.get(jobLevelTitle)).toBe(psLevelTitle, 'Second requirement');
    }
  });
});
