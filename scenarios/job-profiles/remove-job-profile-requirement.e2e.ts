import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { generateName, waitUntil, pressEscKey } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed, isMenuItemEnabled } from '@e2e/helpers/menu-helper';

import {
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodePage,
  JobFamilyGeneralPage,
  JobFamilyMapPage,
  JobFamilyRequirementsPage,
  JobProfileRequirementsPage,
  MyCompetenciesGroupsPage,
  MyFamiliesPage,
  RemoveEntityRequirementDialog
} from '@e2e/page-objects';

describe('Remove Job Profile requirement', () => {
  const competencyGeneralPage = new CompetenciesNodeGeneralPage();
  const competencyGroupName = generateName();
  const competencyPage = new CompetenciesNodePage();
  const firstCompetencyName = generateName();
  const groupMapPage = new CompetenciesGroupMapPage();
  const jobFamilyRequirementsPage = new JobFamilyRequirementsPage();
  const jobProfileRequirementsPage = new JobProfileRequirementsPage();
  const removeEntityRequirementDialog = new RemoveEntityRequirementDialog();
  const secondCompetencyName = generateName();
  const thirdCompetencyName = generateName();
  let jobFamilyRequirementAssignment: Map<string, string> = new Map();
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

  it('should create third competency', async () => {
    await competencyPage.navigateToParent();

    const thirdCompetencyId = await groupMapPage.createAndNavigateToCompetency(
      ProficiencyScaleDefinitionMode.Basic,
      thirdCompetencyName
    );

    expect(thirdCompetencyId).toBeTruthy();

    await competencyGeneralPage.navigate();
  });

  it('should describe third competency’s proficiency scale', async () => {
    await competencyGeneralPage.describePS(ProficiencyScaleDefinitionMode.Basic);

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
    jobFamilyRequirementAssignment = await jobFamilyRequirementsPage.assignRequirement(jobTracks[0], firstCompetencyName);

    for (const [jobLevelTitle, psLevelTitle] of jobFamilyRequirementAssignment) {
      expect(await jobFamilyRequirementsPage.getRequirementPSLevel(jobTracks[0], firstCompetencyName, jobLevelTitle))
        .toBe(psLevelTitle, 'PS level is not correct');
    }
  });

  it('should create job profile', async () => {
    const jobFamilyMapPage = new JobFamilyMapPage();
    const jobProfileId = await jobFamilyMapPage.createAndNavigateToJobProfile(jobTracks[0]);

    expect(jobProfileId).toBeTruthy();
  });

  describe('remove not assigned requirement', () => {
    let oldRequirementsCount: number;

    it('should add second requirement', async () => {
      await jobProfileRequirementsPage.navigate();

      await jobProfileRequirementsPage.addRequirement([competencyGroupName, secondCompetencyName]);

      oldRequirementsCount = await jobProfileRequirementsPage.getRequirementsCount();

      expect(true).toBe(true);
    });

    it('second requirement additional actions should be displayed', async () => {
      expect(await jobProfileRequirementsPage.isRequirementAdditionalActionsDisplayed(secondCompetencyName)).toBe(true);
    });

    it('second requirement remove action should be displayed', async () => {
      await jobProfileRequirementsPage.clickOnRequirementAdditionalActions(secondCompetencyName);

      expect(await isMenuItemDisplayed(getI18nText('remove'))).toBe(true)
    });

    it('second requirement remove action should be enabled', async () => {
      expect(await isMenuItemEnabled(getI18nText('remove'))).toBe(true);
    });

    it('should open remove requirement modal window', async () => {
      await clickOnMenuItem(getI18nText('remove'));

      expect(await removeEntityRequirementDialog.isDisplayed()).toBe(true);
    });

    it('should remove second requirement', async () => {
      await removeEntityRequirementDialog.clickOnSubmitButton();
      await waitUntil(() => removeEntityRequirementDialog.isDisplayed(), true);

      await waitUntil(() => jobProfileRequirementsPage.getRequirementsCount(), oldRequirementsCount);

      expect(await jobProfileRequirementsPage.isRequirementDisplayed(secondCompetencyName)).toBe(false);
    });
  });

  describe('remove assigned requirement', () => {
    let oldRequirementsCount: number;

    it('should add second requirement', async () => {
      await jobProfileRequirementsPage.navigate();

      await jobProfileRequirementsPage.addRequirement([competencyGroupName, secondCompetencyName]);

      oldRequirementsCount = await jobProfileRequirementsPage.getRequirementsCount();

      expect(true).toBe(true);
    });

    it('should assign second requirement', async () => {
      const jobLevelsToPSLevelsMap = await jobProfileRequirementsPage.assignRequirement(secondCompetencyName);

      for (const [jobLevelTitle, psLevelTitle] of jobLevelsToPSLevelsMap) {
        expect(await jobProfileRequirementsPage.getRequirementPSLevel(secondCompetencyName, jobLevelTitle))
          .toBe(psLevelTitle, 'PS level is not correct');
      }
    });

    it('second requirement additional actions should be displayed', async () => {
      expect(await jobProfileRequirementsPage.isRequirementAdditionalActionsDisplayed(secondCompetencyName)).toBe(true);
    });

    it('second requirement remove action should be displayed', async () => {
      await jobProfileRequirementsPage.clickOnRequirementAdditionalActions(secondCompetencyName);

      expect(await isMenuItemDisplayed(getI18nText('remove'))).toBe(true)
    });

    it('second requirement remove action should be enabled', async () => {
      expect(await isMenuItemEnabled(getI18nText('remove'))).toBe(true);
    });

    it('should open remove requirement modal window', async () => {
      await clickOnMenuItem(getI18nText('remove'));

      expect(await removeEntityRequirementDialog.isDisplayed()).toBe(true);
    });

    it('should remove second requirement', async () => {
      await removeEntityRequirementDialog.clickOnSubmitButton();
      await waitUntil(() => removeEntityRequirementDialog.isDisplayed(), true);

      await waitUntil(() => jobProfileRequirementsPage.getRequirementsCount(), oldRequirementsCount);

      expect(await jobProfileRequirementsPage.isRequirementDisplayed(secondCompetencyName)).toBe(false);
    });
  });

  describe('remove job family requirement in the job profile requirements page', () => {
    it('job family requirement should be displayed', async () => {
      await jobProfileRequirementsPage.navigate();

      expect(await jobProfileRequirementsPage.isRequirementDisplayed(firstCompetencyName)).toBe(true);
      expect(await jobProfileRequirementsPage.isJobFamilyRequirement(firstCompetencyName)).toBe(true, 'Span text is not correct');
    });

    it('job family requirement additional actions should be displayed', async () => {
      expect(await jobProfileRequirementsPage.isRequirementAdditionalActionsDisplayed(firstCompetencyName)).toBe(true);
    });

    it('job family requirement remove action should be displayed', async () => {
      await jobProfileRequirementsPage.clickOnRequirementAdditionalActions(firstCompetencyName);

      expect(await isMenuItemDisplayed(getI18nText('remove'))).toBe(true)
    });

    it('job family requirement remove action should be disabled', async () => {
      expect(await isMenuItemEnabled(getI18nText('remove'))).toBe(false);

      await pressEscKey();
    });
  });

  describe('bug: https://dev.azure.com/IntelliasTS/IntelliGrowth/_workitems/edit/1219/', () => {
    let oldRequirementsCount: number;
    let requirementAssignment: Map<string, string> = new Map();

    it('should add second requirement', async () => {
      await jobProfileRequirementsPage.navigate();

      await jobProfileRequirementsPage.addRequirement([competencyGroupName, secondCompetencyName]);

      expect(true).toBe(true);
    });

    it('should add third requirement', async () => {
      await jobProfileRequirementsPage.addRequirement([competencyGroupName, thirdCompetencyName]);

      oldRequirementsCount = await jobProfileRequirementsPage.getRequirementsCount();

      expect(true).toBe(true);
    });

    it('should assign second requirement', async () => {
      const requirementAssignment = await jobProfileRequirementsPage.assignRequirement(secondCompetencyName);

      for (const [jobLevelTitle, psLevelTitle] of requirementAssignment) {
        expect(await jobProfileRequirementsPage.getRequirementPSLevel(secondCompetencyName, jobLevelTitle))
          .toBe(psLevelTitle, 'PS level is not correct');
      }
    });

    it('should remove third requirement', async () => {
      await jobProfileRequirementsPage.clickOnRequirementAdditionalActions(thirdCompetencyName);

      await clickOnMenuItem(getI18nText('remove'));
      await waitUntil(() => removeEntityRequirementDialog.isDisplayed(), false);

      await removeEntityRequirementDialog.clickOnSubmitButton();
      await waitUntil(() => removeEntityRequirementDialog.isDisplayed(), true);

      await waitUntil(() => jobProfileRequirementsPage.getRequirementsCount(), oldRequirementsCount);

      expect(await jobProfileRequirementsPage.isRequirementDisplayed(thirdCompetencyName)).toBe(false);
    });

    it('job family requirement assignment should be the same as before', async () => {
      for (const [jobLevelTitle, psLevelTitle] of jobFamilyRequirementAssignment) {
        expect(await jobProfileRequirementsPage.getRequirementPSLevel(firstCompetencyName, jobLevelTitle))
          .toBe(psLevelTitle, 'PS level is not correct');
      }
    });

    it('second requirement assignment should be the same as before', async () => {
      for (const [jobLevelTitle, psLevelTitle] of requirementAssignment) {
        expect(await jobProfileRequirementsPage.getRequirementPSLevel(secondCompetencyName, jobLevelTitle))
          .toBe(psLevelTitle, 'PS level is not correct');
      }
    });
  });
});
