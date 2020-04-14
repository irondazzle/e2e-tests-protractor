import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { generateName, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { randomNumber } from '@e2e/helpers/random-helper';

import {
  AddJobProfileRequirementsDialog,
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodeMapPage,
  CompetenciesNodePage,
  JobFamilyGeneralPage,
  JobFamilyMapPage,
  JobProfileGeneralPage,
  JobProfileRequirementsPage,
  MyCompetenciesGroupsPage,
  MyFamiliesPage
} from '@e2e/page-objects';

describe('Add Requirements to Job Profile', () => {
  const addJobProfileRequirementsDialog = new AddJobProfileRequirementsDialog();
  const competencyGeneralPage = new CompetenciesNodeGeneralPage();
  const competencyGroupName = generateName();
  const competencyMapPage = new CompetenciesNodeMapPage();
  const competencyName = generateName();
  const firstSkillName = generateName();
  const jobProfileGeneralPage = new JobProfileGeneralPage();
  const jobProfileRequirementsPage = new JobProfileRequirementsPage();
  const secondSkillName = generateName();
  const skillGeneralPage = new CompetenciesNodeGeneralPage();
  let jobTracks: string[];
  let oldRequirementsCount: string;

  it('should create competencies group', async () => {
    const myGroupsPage = new MyCompetenciesGroupsPage();
    const competencyGroupId = await myGroupsPage.createAndNavigateToCompetencyGroup(competencyGroupName);

    expect(competencyGroupId).toBeTruthy();
  });

  it('should create competency', async () => {
    const groupMapPage = new CompetenciesGroupMapPage();
    const competencyId = await groupMapPage.createAndNavigateToCompetency(ProficiencyScaleDefinitionMode.Basic, competencyName);

    expect(competencyId).toBeTruthy();

    await competencyGeneralPage.navigate();
  });

  it('should describe competency’s proficiency scale', async () => {
    await competencyGeneralPage.describePS(ProficiencyScaleDefinitionMode.Basic);

    // NOTE Nothing to check(because of allowedMutations)
    expect(true).toBe(true);
  });

  it('should mark competency as ready', async () => {
    expect(await competencyGeneralPage.markAsReady()).toBe(getI18nText('READY'));
  });

  it('should create first skill', async () => {
    const firstSkillId = await competencyMapPage.createAndNavigateToChild(ProficiencyScaleDefinitionMode.Basic, firstSkillName);

    expect(firstSkillId).toBeTruthy();

    await skillGeneralPage.navigate();
  });

  it('should describe first skill’s proficiency scale', async () => {
    await skillGeneralPage.describePS(ProficiencyScaleDefinitionMode.Basic);

    // NOTE Nothing to check(because of allowedMutations)
    expect(true).toBe(true);
  });

  it('should mark first skill as ready', async () => {
    expect(await skillGeneralPage.markAsReady()).toBe(getI18nText('READY'));
  });

  it('should create second skill', async () => {
    const skillPage = new CompetenciesNodePage();

    await skillPage.navigateToParent();

    const secondSkillId = await competencyMapPage.createAndNavigateToChild(ProficiencyScaleDefinitionMode.Extended, secondSkillName);

    expect(secondSkillId).toBeTruthy();

    await skillGeneralPage.navigate();
  });

  it('should describe second skill’s proficiency scale', async () => {
    await skillGeneralPage.describePS(ProficiencyScaleDefinitionMode.Extended);

    // NOTE Nothing to check(because of allowedMutations)
    expect(true).toBe(true);
  });

  it('should mark second skill as ready', async () => {
    expect(await skillGeneralPage.markAsReady()).toBe(getI18nText('READY'));
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

  it('should create job profile', async () => {
    const jobFamilyMapPage = new JobFamilyMapPage();
    const jobProfileId = await jobFamilyMapPage.createAndNavigateToJobProfile(jobTracks[randomNumber(0, jobTracks.length - 1)]);

    expect(jobProfileId).toBeTruthy();

    await jobProfileGeneralPage.navigate();
    oldRequirementsCount = await jobProfileGeneralPage.getRequirementsCount();
  });

  it('add requirements button should be displayed', async () => {
    await jobProfileRequirementsPage.navigate();

    expect(await jobProfileRequirementsPage.isAddRequirementsButtonDisplayed()).toBe(true);
  });

  it('should open modal window', async () => {
    await jobProfileRequirementsPage.clickOnAddRequirementsButton();

    expect(await addJobProfileRequirementsDialog.isDisplayed()).toBe(true);
  });

  it('current drill down level should be groups list level', async () => {
    expect(await addJobProfileRequirementsDialog.getNavigationSuffixText()).toBe(getI18nText('competenciesGroups'));
  });

  it('competencies group should be displayed', async () => {
    expect(await addJobProfileRequirementsDialog.isRequirementDisplayed(competencyGroupName)).toBe(true);
  });

  it('should drill down to competencies group level', async () => {
    await addJobProfileRequirementsDialog.clickOnRequirement(competencyGroupName);

    expect(await addJobProfileRequirementsDialog.getNavigationText()).toBe(`${competencyGroupName} (${getI18nText('competenciesGroup')})`);
  });

  it('competency should be displayed', async () => {
    expect(await addJobProfileRequirementsDialog.isRequirementDisplayed(competencyName)).toBe(true);
  });

  it('should drill down to competency level', async () => {
    await addJobProfileRequirementsDialog.clickOnRequirement(competencyName);

    expect(await addJobProfileRequirementsDialog.getNavigationText()).toBe(`${competencyName} (${getI18nText('competency')})`);
  });

  it('competency’s proficiency scale should be displayed', async () => {
    expect(await addJobProfileRequirementsDialog.isRequirementDisplayed(getI18nText('competencyProficiencyScale'))).toBe(true);
  });

  it('skills should be displayed', async () => {
    expect(await addJobProfileRequirementsDialog.isRequirementDisplayed(firstSkillName)).toBe(true, 'First skill');
    expect(await addJobProfileRequirementsDialog.isRequirementDisplayed(secondSkillName)).toBe(true, 'Second skill');
  });

  it('should select competency’s proficiency scale', async () => {
    await addJobProfileRequirementsDialog.clickOnRequirement(getI18nText('competencyProficiencyScale'));
    expect(await addJobProfileRequirementsDialog.isRequirementSelected(getI18nText('competencyProficiencyScale')))
      .toBe(true, getI18nText('competencyProficiencyScale'));

    expect(await addJobProfileRequirementsDialog.isRequirementEnabled(firstSkillName)).toBe(false, 'First skill');
    expect(await addJobProfileRequirementsDialog.isRequirementEnabled(secondSkillName)).toBe(false, 'Second skill');
  });

  it('should select skills proficiency scale', async () => {
    await addJobProfileRequirementsDialog.clickOnRequirement(getI18nText('competencyProficiencyScale'));
    expect(await addJobProfileRequirementsDialog.isRequirementSelected(getI18nText('competencyProficiencyScale')))
      .toBe(false, getI18nText('competencyProficiencyScale'));

    await addJobProfileRequirementsDialog.clickOnRequirement(firstSkillName);
    await addJobProfileRequirementsDialog.clickOnRequirement(secondSkillName);

    expect(await addJobProfileRequirementsDialog.isRequirementSelected(firstSkillName)).toBe(true, firstSkillName);
    expect(await addJobProfileRequirementsDialog.isRequirementSelected(secondSkillName)).toBe(true, secondSkillName);
  });

  it('should add skills as requirements', async () => {
    await addJobProfileRequirementsDialog.clickOnSubmitButton();
    await waitUntil(() => addJobProfileRequirementsDialog.isDisplayed(), true);

    await jobProfileGeneralPage.navigate();
    await waitUntil(() => jobProfileGeneralPage.getRequirementsCount(), oldRequirementsCount);
    await jobProfileRequirementsPage.navigate();

    expect(await jobProfileRequirementsPage.isRequirementDisplayed(firstSkillName)).toBe(true, 'First skill');
    expect(await jobProfileRequirementsPage.isRequirementDisplayed(secondSkillName)).toBe(true, 'Second skill');
  });
});
