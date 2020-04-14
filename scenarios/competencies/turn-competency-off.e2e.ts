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

describe('Turn off Competency', () => {
  const competencyGeneralPage = new CompetenciesNodeGeneralPage();
  const competencyMapPage = new CompetenciesNodeMapPage();
  const skillGeneralPage = new CompetenciesNodeGeneralPage();
  const skillPage = new CompetenciesNodePage();
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

    await competencyGeneralPage.navigate();
  });

  it('turn off button should be displayed', async () => {
    expect(await competencyGeneralPage.isTurnOffButtonDisplayed()).toBe(true);
  });

  it('turn off button should be disabled', async () => {
    expect(await competencyGeneralPage.isTurnOffButtonEnabled()).toBe(false);
  });

  it('should create first skill', async () => {
    const firstSkillId = await competencyMapPage.createAndNavigateToChild();

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

  it('turn off button should be disabled', async () => {
    await skillPage.navigateToParent();
    await competencyGeneralPage.navigate();

    expect(await competencyGeneralPage.isTurnOffButtonEnabled()).toBe(false);
  });

  it('should create second skill', async () => {
    const secondSkillId = await competencyMapPage.createAndNavigateToChild(ProficiencyScaleDefinitionMode.Extended);

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

  it('turn off button should be enabled', async () => {
    await skillPage.navigateToParent();
    await competencyGeneralPage.navigate();

    expect(await competencyGeneralPage.isTurnOffButtonEnabled()).toBe(true);
  });

  it('should open turn off modal window', async () => {
    oldLastModified = await competencyGeneralPage.getLastModified();

    await competencyGeneralPage.clickOnTurnOffButton();

    expect(await turnOffDialog.isDisplayed()).toBe(true);
  });

  it('should turn off competency', async () => {
    await turnOffDialog.clickOnSubmitButton();

    await waitUntil(() => turnOffDialog.isDisplayed(), true);
    await waitUntil(() => competencyGeneralPage.getLastModified(), oldLastModified);

    expect(await competencyGeneralPage.isPSContainerDisplayed()).toBe(false);
    expect(await competencyGeneralPage.getStatus()).toBe(getI18nText('BY_SKILLS'));
  });
});
