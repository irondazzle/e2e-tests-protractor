import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { generateName, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed, isMenuItemEnabled } from '@e2e/helpers/menu-helper';

import {
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodePage,
  JobFamilyGeneralPage,
  JobFamilyRequirementsPage,
  MyCompetenciesGroupsPage,
  MyFamiliesPage,
  RemoveEntityRequirementDialog
} from '@e2e/page-objects';

describe('Remove Job Family requirement', () => {
  const competencyGeneralPage = new CompetenciesNodeGeneralPage();
  const competencyGroupName = generateName();
  const firstCompetencyName = generateName();
  const groupMapPage = new CompetenciesGroupMapPage();
  const jobFamilyRequirementsPage = new JobFamilyRequirementsPage();
  const removeEntityRequirementDialog = new RemoveEntityRequirementDialog();
  const secondCompetencyName = generateName();
  let jobTracks: string[];

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
    const competencyPage = new CompetenciesNodePage();

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

    expect(true).toBe(true);
  });

  it('should mark second competency as ready', async () => {
    expect(await competencyGeneralPage.markAsReady()).toBe(getI18nText('READY'));
  });

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

  describe('remove not assigned requirement', () => {
    let oldRequirementsCount: number;

    it('should add first requirement to the first job track', async () => {
      await jobFamilyRequirementsPage.navigate();

      await jobFamilyRequirementsPage.addRequirement(jobTracks[0], [competencyGroupName, firstCompetencyName]);

      oldRequirementsCount = await jobFamilyRequirementsPage.getRequirementsCount(jobTracks[0]);

      expect(true).toBe(true);
    });

    it('first requirement additional actions should be displayed', async () => {
      expect(await jobFamilyRequirementsPage.isRequirementAdditionalActionsDisplayed(jobTracks[0], firstCompetencyName)).toBe(true);
    });

    it('first requirement remove action should be displayed', async () => {
      await jobFamilyRequirementsPage.clickOnRequirementAdditionalActions(jobTracks[0], firstCompetencyName);

      expect(await isMenuItemDisplayed(getI18nText('remove'))).toBe(true)
    });

    it('first requirement remove action should be enabled', async () => {
      expect(await isMenuItemEnabled(getI18nText('remove'))).toBe(true);
    });

    it('should open remove requirement modal window', async () => {
      await clickOnMenuItem(getI18nText('remove'));

      expect(await removeEntityRequirementDialog.isDisplayed()).toBe(true);
    });

    it('should remove first requirement from the first job track', async () => {
      await removeEntityRequirementDialog.clickOnSubmitButton();
      await waitUntil(() => removeEntityRequirementDialog.isDisplayed(), true);

      await waitUntil(() => jobFamilyRequirementsPage.getRequirementsCount(jobTracks[0]), oldRequirementsCount);

      expect(await jobFamilyRequirementsPage.isRequirementDisplayed(jobTracks[0], firstCompetencyName)).toBe(false);
    });
  });

  describe('remove assigned requirement', () => {
    let oldRequirementsCount: number;

    it('should add first requirement to the first job track', async () => {
      await jobFamilyRequirementsPage.navigate();

      await jobFamilyRequirementsPage.addRequirement(jobTracks[0], [competencyGroupName, firstCompetencyName]);

      oldRequirementsCount = await jobFamilyRequirementsPage.getRequirementsCount(jobTracks[0]);

      expect(true).toBe(true);
    });

    it('should assign first requirement in the first job track', async () => {
      const jobLevelsToPSLevelsMap = await jobFamilyRequirementsPage.assignRequirement(jobTracks[0], firstCompetencyName);

      for (const [jobLevelTitle, psLevelTitle] of jobLevelsToPSLevelsMap) {
        expect(await jobFamilyRequirementsPage.getRequirementPSLevel(jobTracks[0], firstCompetencyName, jobLevelTitle))
          .toBe(psLevelTitle, 'PS level is not correct');
      }
    });

    it('first requirement additional actions should be displayed', async () => {
      expect(await jobFamilyRequirementsPage.isRequirementAdditionalActionsDisplayed(jobTracks[0], firstCompetencyName)).toBe(true);
    });

    it('first requirement remove action should be displayed', async () => {
      await jobFamilyRequirementsPage.clickOnRequirementAdditionalActions(jobTracks[0], firstCompetencyName);

      expect(await isMenuItemDisplayed(getI18nText('remove'))).toBe(true)
    });

    it('first requirement remove action should be enabled', async () => {
      expect(await isMenuItemEnabled(getI18nText('remove'))).toBe(true);
    });

    it('should open remove requirement modal window', async () => {
      await clickOnMenuItem(getI18nText('remove'));

      expect(await removeEntityRequirementDialog.isDisplayed()).toBe(true);
    });

    it('should remove first requirement from the first job track', async () => {
      await removeEntityRequirementDialog.clickOnSubmitButton();
      await waitUntil(() => removeEntityRequirementDialog.isDisplayed(), true);

      await waitUntil(() => jobFamilyRequirementsPage.getRequirementsCount(jobTracks[0]), oldRequirementsCount);

      expect(await jobFamilyRequirementsPage.isRequirementDisplayed(jobTracks[0], firstCompetencyName)).toBe(false);
    });
  });

  describe('bug: https://dev.azure.com/IntelliasTS/IntelliGrowth/_workitems/edit/1219/', () => {
    let firstJobTrackRequirementsCount: number;
    let requirementAssignment: Map<string, string> = new Map();
    let secondJobTrackRequirementsCount: number;

    it('should add first requirement to the first job track', async () => {
      await jobFamilyRequirementsPage.navigate();

      await jobFamilyRequirementsPage.addRequirement(jobTracks[0], [competencyGroupName, firstCompetencyName]);

      expect(true).toBe(true);
    });

    it('should assign first requirement in the first job track', async () => {
      requirementAssignment = await jobFamilyRequirementsPage.assignRequirement(jobTracks[0], firstCompetencyName);

      for (const [jobLevelTitle, psLevelTitle] of requirementAssignment) {
        expect(await jobFamilyRequirementsPage.getRequirementPSLevel(jobTracks[0], firstCompetencyName, jobLevelTitle))
          .toBe(psLevelTitle, 'PS level is not correct');
      }
    });

    it('should add second requirement to the first job track', async () => {
      await jobFamilyRequirementsPage.addRequirement(jobTracks[0], [competencyGroupName, secondCompetencyName]);

      firstJobTrackRequirementsCount = await jobFamilyRequirementsPage.getRequirementsCount(jobTracks[0]);

      expect(true).toBe(true);
    });

    it('should add second requirement to the second job track', async () => {
      await jobFamilyRequirementsPage.addRequirement(jobTracks[1], [competencyGroupName, secondCompetencyName]);

      secondJobTrackRequirementsCount = await jobFamilyRequirementsPage.getRequirementsCount(jobTracks[1]);

      expect(true).toBe(true);
    });

    it('should remove second requirement from the first job track', async () => {
      await jobFamilyRequirementsPage.clickOnRequirementAdditionalActions(jobTracks[0], secondCompetencyName);

      await clickOnMenuItem(getI18nText('remove'));
      await waitUntil(() => removeEntityRequirementDialog.isDisplayed(), false);

      await removeEntityRequirementDialog.clickOnSubmitButton();
      await waitUntil(() => removeEntityRequirementDialog.isDisplayed(), true);

      await waitUntil(() => jobFamilyRequirementsPage.getRequirementsCount(jobTracks[0]), firstJobTrackRequirementsCount);

      expect(await jobFamilyRequirementsPage.isRequirementDisplayed(jobTracks[0], secondCompetencyName)).toBe(false);
    });

    it('first requirement assignment should be the same as before', async () => {
      for (const [jobLevelTitle, psLevelTitle] of requirementAssignment) {
        expect(await jobFamilyRequirementsPage.getRequirementPSLevel(jobTracks[0], firstCompetencyName, jobLevelTitle))
          .toBe(psLevelTitle, 'PS level is not correct');
      }
    });

    it('should remove second requirement from the second job track', async () => {
      await jobFamilyRequirementsPage.clickOnRequirementAdditionalActions(jobTracks[1], secondCompetencyName);

      await clickOnMenuItem(getI18nText('remove'));
      await waitUntil(() => removeEntityRequirementDialog.isDisplayed(), false);

      await removeEntityRequirementDialog.clickOnSubmitButton();
      await waitUntil(() => removeEntityRequirementDialog.isDisplayed(), true);

      await waitUntil(() => jobFamilyRequirementsPage.getRequirementsCount(jobTracks[1]), secondJobTrackRequirementsCount);

      expect(await jobFamilyRequirementsPage.isRequirementDisplayed(jobTracks[1], secondCompetencyName)).toBe(false);
    });

    it('first requirement assignment should be the same as before', async () => {
      for (const [jobLevelTitle, psLevelTitle] of requirementAssignment) {
        expect(await jobFamilyRequirementsPage.getRequirementPSLevel(jobTracks[0], firstCompetencyName, jobLevelTitle))
          .toBe(psLevelTitle, 'PS level is not correct');
      }
    });
  });
});
