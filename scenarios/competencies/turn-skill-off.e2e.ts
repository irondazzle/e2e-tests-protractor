import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import {
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodeMapPage,
  CompetenciesNodePage,
  MyCompetenciesGroupsPage,
  TurnOffDialog
} from '@e2e/page-objects';

describe('Turn off Skill', () => {
  const skillGeneralPage = new CompetenciesNodeGeneralPage();
  const skillMapPage = new CompetenciesNodeMapPage();
  const subSkillGeneralPage = new CompetenciesNodeGeneralPage();
  const subSkillPage = new CompetenciesNodePage();
  const turnOffDialog = new TurnOffDialog();
  let oldLastModified: string;

  it('should create competencies group', async () => {
    const myGroupsPage = new MyCompetenciesGroupsPage();
    const competencyGroupId = await myGroupsPage.createAndNavigateToCompetencyGroup();

    expect(competencyGroupId).toBeTruthy();
  });

  it('should create competency', async () => {
    const groupMapPage = new CompetenciesGroupMapPage();
    const competencyId = await groupMapPage.createAndNavigateToCompetency();

    expect(competencyId).toBeTruthy();
  });

  it('should create skill', async () => {
    const competencyMapPage = new CompetenciesNodeMapPage();
    const skillId = await competencyMapPage.createAndNavigateToChild();

    expect(skillId).toBeTruthy();

    await skillGeneralPage.navigate();
  });

  it('turn off button should be displayed', async () => {
    expect(await skillGeneralPage.isTurnOffButtonDisplayed()).toBe(true);
  });

  it('turn off button should be disabled', async () => {
    expect(await skillGeneralPage.isTurnOffButtonEnabled()).toBe(false);
  });

  it('should create first sub skill', async () => {
    const firstSubSkillId = await skillMapPage.createAndNavigateToChild();

    expect(firstSubSkillId).toBeTruthy();

    await subSkillGeneralPage.navigate();
  });

  it('should describe first sub skill’s proficiency scale', async () => {
    await subSkillGeneralPage.describePS(ProficiencyScaleDefinitionMode.Basic);

    expect(true).toBe(true);
  });

  it('should mark first sub skill as ready', async () => {
    expect(await subSkillGeneralPage.markAsReady()).toBe(getI18nText('READY'));
  });

  it('turn off button should be disabled', async () => {
    await subSkillPage.navigateToParent();
    await skillGeneralPage.navigate();

    expect(await skillGeneralPage.isTurnOffButtonEnabled()).toBe(false);
  });

  it('should create second sub skill', async () => {
    const secondSubSkillId = await skillMapPage.createAndNavigateToChild(ProficiencyScaleDefinitionMode.Extended);

    expect(secondSubSkillId).toBeTruthy();

    await subSkillGeneralPage.navigate();
  });

  it('should describe second sub skill’s proficiency scale', async () => {
    await subSkillGeneralPage.describePS(ProficiencyScaleDefinitionMode.Extended);

    expect(true).toBe(true);
  });

  it('should mark second sub skill as ready', async () => {
    expect(await subSkillGeneralPage.markAsReady()).toBe(getI18nText('READY'));
  });

  it('turn off button should be enabled', async () => {
    await subSkillPage.navigateToParent();
    await skillGeneralPage.navigate();

    expect(await skillGeneralPage.isTurnOffButtonEnabled()).toBe(true);
  });

  it('should open turn off modal window', async () => {
    oldLastModified = await skillGeneralPage.getLastModified();

    await skillGeneralPage.clickOnTurnOffButton();

    expect(await turnOffDialog.isDisplayed()).toBe(true);
  });

  it('should turn off skill', async () => {
    await turnOffDialog.clickOnSubmitButton();

    await waitUntil(() => turnOffDialog.isDisplayed(), true);
    await waitUntil(() => skillGeneralPage.getLastModified(), oldLastModified);

    expect(await skillGeneralPage.isPSContainerDisplayed()).toBe(false);
    expect(await skillGeneralPage.getStatus()).toBe(getI18nText('BY_SUB_SKILLS'));
  });
});
