import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { generateName, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import {
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodePage,
  EditEntityRequirementPage,
  JobFamilyGeneralPage,
  JobFamilyRequirementsPage,
  MyCompetenciesGroupsPage,
  MyFamiliesPage
} from '@e2e/page-objects';

describe('Assign Job Family requirement', () => {
  const competencyGeneralPage = new CompetenciesNodeGeneralPage();
  const competencyGroupName = generateName();
  const competencyPage = new CompetenciesNodePage();
  const editEntityRequirementPage  = new EditEntityRequirementPage();
  const firstCompetencyName = generateName();
  const firstRequirementAssignment: Map<string, string> = new Map();
  const groupMapPage = new CompetenciesGroupMapPage();
  const jobFamilyGeneralPage = new JobFamilyGeneralPage();
  const jobFamilyRequirementsPage = new JobFamilyRequirementsPage();
  const jobTracks = ['Functional Leadership', 'Management'];
  const secondCompetencyName = generateName();
  const secondRequirementAssignment: Map<string, string> = new Map();
  const thirdCompetencyName = generateName();
  let jobTrack: string;
  let requirementAssignmentHash: string;

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

    // NOTE Nothing to check(because of allowedMutations)
    expect(true).toBe(true);
  });

  it('should mark first competency as ready', async () => {
    expect(await competencyGeneralPage.markAsReady()).toBe(getI18nText('READY'));
  });

  it('should create second competency', async () => {
    await competencyPage.navigateToParent();

    const secondCompetencyId = await groupMapPage.createAndNavigateToCompetency(
      ProficiencyScaleDefinitionMode.Extended,
      secondCompetencyName
    );

    expect(secondCompetencyId).toBeTruthy();

    await competencyGeneralPage.navigate();
  });

  it('should describe second competency’s proficiency scale', async () => {
    await competencyGeneralPage.describePS(ProficiencyScaleDefinitionMode.Extended);

    // NOTE Nothing to check(because of allowedMutations)
    expect(true).toBe(true);
  });

  it('should mark second competency as ready', async () => {
    expect(await competencyGeneralPage.markAsReady()).toBe(getI18nText('READY'));
  });

  it('should create third competency', async () => {
    await competencyPage.navigateToParent();

    const thirdCompetencyId = await groupMapPage.createAndNavigateToCompetency(
      ProficiencyScaleDefinitionMode.Basic,
      thirdCompetencyName
    );

    expect(thirdCompetencyId).toBeTruthy();

    await competencyGeneralPage.navigate();
  });

  it('should describe third competency’s proficiency scales', async () => {
    await competencyGeneralPage.describePS(ProficiencyScaleDefinitionMode.Basic);

    // NOTE Nothing to check(because of allowedMutations)
    expect(true).toBe(true);
  });

  it('should mark third competency as ready', async () => {
    expect(await competencyGeneralPage.markAsReady()).toBe(getI18nText('READY'));
  });

  it('should create job family', async () => {
    const myFamiliesPage = new MyFamiliesPage();
    const jobFamilyId = await myFamiliesPage.createAndNavigateToJobFamily();

    expect(jobFamilyId).toBeTruthy();
  });

  it('should define job tracks', async () => {
    await jobFamilyGeneralPage.navigate();

    await jobFamilyGeneralPage.defineJobTracks(jobTracks);

    for (const jobTrack of jobTracks) {
      expect(await jobFamilyGeneralPage.isJobTrackDisplayed(jobTrack)).toBe(true, jobTrack);
    }
  });

  describe('assign requirement with basic proficiency scale mode', () => {
    it('should add job family requirement', async () => {
      await jobFamilyRequirementsPage.navigate();

      jobTrack = await jobFamilyRequirementsPage.addRequirement(jobTracks[0], [competencyGroupName, firstCompetencyName]);

      expect(true).toBe(true);
    });

    commonTests([
      getI18nText('notRequired'),
      getI18nText('QUALIFIED'),
      getI18nText('COMPETENT'),
      getI18nText('EXPERT')
    ], firstCompetencyName, firstRequirementAssignment, requirementAssignmentHash);
  });

  describe('assign requirement with extended proficiency scale mode', () => {
    it('should add job family requirement', async () => {
      await jobFamilyRequirementsPage.navigate();

      jobTrack = await jobFamilyRequirementsPage.addRequirement(jobTracks[1], [competencyGroupName, secondCompetencyName]);

      expect(true).toBe(true);
    });

    commonTests([
      getI18nText('notRequired'),
      getI18nText('QUALIFIED'),
      getI18nText('UPPER_QUALIFIED'),
      getI18nText('COMPETENT'),
      getI18nText('UPPER_COMPETENT'),
      getI18nText('EXPERT')
    ], secondCompetencyName, secondRequirementAssignment, requirementAssignmentHash);
  });

  describe('bug: https://dev.azure.com/IntelliasTS/IntelliGrowth/_workitems/edit/1219/', () => {
    it('should add job family requirement into the first job track', async () => {
      await jobFamilyRequirementsPage.navigate();

      await jobFamilyRequirementsPage.addRequirement(jobTracks[0], [competencyGroupName, thirdCompetencyName]);

      expect(true).toBe(true);
    });

    it('should add job family requirement into the second job track', async () => {
      await jobFamilyRequirementsPage.addRequirement(jobTracks[1], [competencyGroupName, thirdCompetencyName]);

      expect(true).toBe(true);
    });

    it('first requirement assignment should be the same as before', async () => {
      for (const [jobLevelTitle, psLevelTitle] of firstRequirementAssignment) {
        expect(await jobFamilyRequirementsPage.getRequirementPSLevel(jobTracks[0], firstCompetencyName, jobLevelTitle))
          .toBe(psLevelTitle, 'PS level is not correct');
      }
    });

    it('second requirement assignment should be the same as before', async () => {
      for (const [jobLevelTitle, psLevelTitle] of secondRequirementAssignment) {
        expect(await jobFamilyRequirementsPage.getRequirementPSLevel(jobTracks[1], secondCompetencyName, jobLevelTitle))
          .toBe(psLevelTitle, 'PS level is not correct');
      }
    });
  });

  describe('requirements assignment remains the same after define a new job track', () => {
    it('should define job tracks', async () => {
      await jobFamilyGeneralPage.navigate();

      const oldJobTracksCount = await jobFamilyGeneralPage.getJobTracksCount();

      await jobFamilyGeneralPage.defineJobTracks(['Professional']);
      await waitUntil(() => jobFamilyGeneralPage.getJobTracksCount(), oldJobTracksCount);

      expect(await jobFamilyGeneralPage.isJobTrackDisplayed('Professional')).toBe(true);
    });

    it('first requirement assignment should be the same as before', async () => {
      await jobFamilyRequirementsPage.navigate();

      for (const [jobLevelTitle, psLevelTitle] of firstRequirementAssignment) {
        expect(await jobFamilyRequirementsPage.getRequirementPSLevel(jobTracks[0], firstCompetencyName, jobLevelTitle))
          .toBe(psLevelTitle, 'PS level is not correct');
      }
    });

    it('second requirement assignment should be the same as before', async () => {
      for (const [jobLevelTitle, psLevelTitle] of secondRequirementAssignment) {
        expect(await jobFamilyRequirementsPage.getRequirementPSLevel(jobTracks[1], secondCompetencyName, jobLevelTitle))
          .toBe(psLevelTitle, 'PS level is not correct');
      }
    });
  });

  function commonTests(psLevels: string[], requirement: string, requirementAssignment: Map<string, string>, requirementAssignmentHash: string) {
    it('assign button should be displayed', async () => {
      expect(await jobFamilyRequirementsPage.isAssignButtonDisplayed(jobTrack, requirement)).toBe(true);
    });

    it('should open assign requirements page', async () => {
      requirementAssignmentHash = await jobFamilyRequirementsPage.getRequirementAssignmentHash(jobTrack, requirement);

      await jobFamilyRequirementsPage.clickOnAssignButton(jobTrack, requirement);

      expect(await editEntityRequirementPage.isDisplayed()).toBe(true);
    });

    it('should mark requirement as core', async () => {
      await editEntityRequirementPage.clickOnCoreToggle();

      expect(await editEntityRequirementPage.isCoreRequirement()).toBe(true);
    });

    it('should assign "Qualified" proficiency level to all job levels', async () => {
      await editEntityRequirementPage.clickOnNextPSLevel(0);

      const psLevelTitles = await editEntityRequirementPage.getPSLevelTitles();

      expect(psLevelTitles).toEqual(new Array(psLevelTitles.length).fill(getI18nText('QUALIFIED')));
    });

    it('should assign "Not required" proficiency level to all job levels', async () => {
      const jobLevelsCount = await editEntityRequirementPage.getJobLevelsCount();

      await editEntityRequirementPage.clickOnPreviousPSLevel(jobLevelsCount - 1);

      const psLevelTitles = await editEntityRequirementPage.getPSLevelTitles();

      expect(psLevelTitles).toEqual(new Array(psLevelTitles.length).fill(getI18nText('notRequired')));
    });

    it('should check that auto assign works correctly', async () => {
      const jobLevelsCount = await editEntityRequirementPage.getJobLevelsCount();
      const lastJobLevelIndex = jobLevelsCount - 1;
      const startPSLevelIndex = psLevels.indexOf(getI18nText('QUALIFIED'));

      for (let psLevelIndex = startPSLevelIndex; psLevelIndex < psLevels.length; psLevelIndex++) {
        await editEntityRequirementPage.clickOnNextPSLevel(lastJobLevelIndex);

        for (let jobLevelIndex = lastJobLevelIndex; jobLevelIndex >= 0; jobLevelIndex--) {
          const jobLevelPSLevelIndex = Math.max(psLevelIndex - (lastJobLevelIndex - jobLevelIndex), 0);

          expect(await editEntityRequirementPage.getPSLevelTitle(jobLevelIndex)).toBe(psLevels[jobLevelPSLevelIndex]);
        }
      }
    });

    it('should assign job family requirement', async () => {
      const jobLevelsCount = await editEntityRequirementPage.getJobLevelsCount();

      for (let i = 0; i < jobLevelsCount; i++) {
        requirementAssignment.set(
          await editEntityRequirementPage.getJobLevelTitle(i),
          await editEntityRequirementPage.getPSLevelTitle(i)
        );
      }

      await editEntityRequirementPage.clickOnSubmitButton();
      await waitUntil(() => editEntityRequirementPage.isDisplayed(), true);

      await waitUntil(() => jobFamilyRequirementsPage.getRequirementAssignmentHash(jobTrack, requirement), requirementAssignmentHash);

      for (const [jobLevelTitle, psLevelTitle] of requirementAssignment) {
        expect(await jobFamilyRequirementsPage.getRequirementPSLevel(jobTrack, requirement, jobLevelTitle)).toBe(psLevelTitle, 'PS level is not correct')
      }

      expect(await jobFamilyRequirementsPage.isCoreRequirement(jobTrack, requirement)).toBe(true);
    });
  }
});
