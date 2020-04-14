import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { generateName, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { randomNumber } from '@e2e/helpers/random-helper';

import {
  AddJobFamilyRequirementsDialog,
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodeMapPage,
  CompetenciesNodePage,
  JobFamilyGeneralPage,
  JobFamilyRequirementsPage,
  MyCompetenciesGroupsPage,
  MyFamiliesPage
} from '@e2e/page-objects';

describe('Add Requirements to Job Family', () => {
  const addJobFamilyRequirementsDialog = new AddJobFamilyRequirementsDialog();
  const competencyGeneralPage = new CompetenciesNodeGeneralPage();
  const competencyGroupName = generateName();
  const competencyMapPage = new CompetenciesNodeMapPage();
  const competencyName = generateName();
  const firstSkillName = generateName();
  const jobFamilyGeneralPage = new JobFamilyGeneralPage();
  const jobFamilyRequirementsPage = new JobFamilyRequirementsPage();
  const secondSkillName = generateName();
  const skillGeneralPage = new CompetenciesNodeGeneralPage();
  let jobTrack: string;
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
    await jobFamilyGeneralPage.navigate();

    oldRequirementsCount = await jobFamilyGeneralPage.getRequirementsCount();
    jobTracks = await jobFamilyGeneralPage.defineJobTracks();

    for (const jobTrack of jobTracks) {
      expect(await jobFamilyGeneralPage.isJobTrackDisplayed(jobTrack)).toBe(true, jobTrack);
    }
  });

  it('add requirements button should be displayed', async () => {
    await jobFamilyRequirementsPage.navigate();

    expect(await jobFamilyRequirementsPage.isAddRequirementsButtonDisplayed()).toBe(true);
  });

  it('should open modal window', async () => {
    await jobFamilyRequirementsPage.clickOnAddRequirementsButton();

    expect(await addJobFamilyRequirementsDialog.isDisplayed()).toBe(true);
  });

  it('job tracks should be displayed', async () => {
    expect(await addJobFamilyRequirementsDialog.isJobTracksDisplayed()).toBe(true);
  });

  it('next button should be disabled', async () => {
    expect(await addJobFamilyRequirementsDialog.isNextButtonEnabled()).toBe(false);
  });

  it('should select job track', async () => {
    jobTrack = jobTracks[randomNumber(0, jobTracks.length - 1)];

    await addJobFamilyRequirementsDialog.clickOnJobTrack(jobTrack);

    expect(await addJobFamilyRequirementsDialog.isJobTrackSelected(jobTrack)).toBe(true);
  });

  it('next button should be enabled', async () => {
    expect(await addJobFamilyRequirementsDialog.isNextButtonEnabled()).toBe(true);
  });

  it('current drill down level should be groups list level', async () => {
    await addJobFamilyRequirementsDialog.clickOnNextButton();

    expect(await addJobFamilyRequirementsDialog.getNavigationSuffixText()).toBe(getI18nText('competenciesGroups'));
  });

  it('competencies group should be displayed', async () => {
    expect(await addJobFamilyRequirementsDialog.isRequirementDisplayed(competencyGroupName)).toBe(true);
  });

  it('should drill down to competencies group level', async () => {
    await addJobFamilyRequirementsDialog.clickOnRequirement(competencyGroupName);

    expect(await addJobFamilyRequirementsDialog.getNavigationText()).toBe(`${competencyGroupName} (${getI18nText('competenciesGroup')})`);
  });

  it('competency should be displayed', async () => {
    expect(await addJobFamilyRequirementsDialog.isRequirementDisplayed(competencyName)).toBe(true);
  });

  it('should drill down to competency level', async () => {
    await addJobFamilyRequirementsDialog.clickOnRequirement(competencyName);

    expect(await addJobFamilyRequirementsDialog.getNavigationText()).toBe(`${competencyName} (${getI18nText('competency')})`);
  });

  it('competency’s proficiency scale should be displayed', async () => {
    expect(await addJobFamilyRequirementsDialog.isRequirementDisplayed(getI18nText('competencyProficiencyScale'))).toBe(true);
  });

  it('skills should be displayed', async () => {
    expect(await addJobFamilyRequirementsDialog.isRequirementDisplayed(firstSkillName)).toBe(true, 'First skill');
    expect(await addJobFamilyRequirementsDialog.isRequirementDisplayed(secondSkillName)).toBe(true, 'Second skill');
  });

  it('should select competency’s proficiency scale', async () => {
    await addJobFamilyRequirementsDialog.clickOnRequirement(getI18nText('competencyProficiencyScale'));
    expect(await addJobFamilyRequirementsDialog.isRequirementSelected(getI18nText('competencyProficiencyScale')))
      .toBe(true, getI18nText('competencyProficiencyScale'));

    expect(await addJobFamilyRequirementsDialog.isRequirementEnabled(firstSkillName)).toBe(false, 'First skill');
    expect(await addJobFamilyRequirementsDialog.isRequirementEnabled(secondSkillName)).toBe(false, 'Second skill');
  });

  it('should select skills proficiency scale', async () => {
    await addJobFamilyRequirementsDialog.clickOnRequirement(getI18nText('competencyProficiencyScale'));
    expect(await addJobFamilyRequirementsDialog.isRequirementSelected(getI18nText('competencyProficiencyScale')))
      .toBe(false, getI18nText('competencyProficiencyScale'));

    await addJobFamilyRequirementsDialog.clickOnRequirement(firstSkillName);
    await addJobFamilyRequirementsDialog.clickOnRequirement(secondSkillName);

    expect(await addJobFamilyRequirementsDialog.isRequirementSelected(firstSkillName)).toBe(true, firstSkillName);
    expect(await addJobFamilyRequirementsDialog.isRequirementSelected(secondSkillName)).toBe(true, secondSkillName);
  });

  it('should add skills as requirements', async () => {
    await addJobFamilyRequirementsDialog.clickOnSubmitButton();
    await waitUntil(() => addJobFamilyRequirementsDialog.isDisplayed(), true);

    await jobFamilyGeneralPage.navigate();
    await waitUntil(() => jobFamilyGeneralPage.getRequirementsCount(), oldRequirementsCount);
    await jobFamilyRequirementsPage.navigate();

    expect(await jobFamilyRequirementsPage.isRequirementDisplayed(jobTrack, firstSkillName)).toBe(true, 'First skill');
    expect(await jobFamilyRequirementsPage.isRequirementDisplayed(jobTrack, secondSkillName)).toBe(true, 'Second skill');
  });
});
