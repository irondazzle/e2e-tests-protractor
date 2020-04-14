import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';

import {
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodeMapPage,
  CompetenciesNodePage,
  MarkAsLegacyDialog,
  MyCompetenciesGroupsPage
} from '@e2e/page-objects';

describe('Mark Sub Skill as legacy', () => {
  const markEntityAsLegacyDialog = new MarkAsLegacyDialog();
  const subSkillGeneralPage = new CompetenciesNodeGeneralPage();
  const subSkillPage = new CompetenciesNodePage();

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
  });

  it('should create sub skill', async () => {
    const skillMapPage = new CompetenciesNodeMapPage();
    const subSkillId = await skillMapPage.createAndNavigateToChild();

    expect(subSkillId).toBeTruthy();

    await subSkillGeneralPage.navigate();
  });

  it('additional actions should be displayed', async () => {
    expect(await subSkillPage.isAdditionalActionsDisplayed()).toBe(true);
  });

  it('"mark as legacy" action should be displayed', async () => {
    await subSkillPage.clickOnAdditionalActions();

    expect(await isMenuItemDisplayed(getI18nText('markAsLegacy'))).toBe(true);
  });

  it('mark as legacy window should be shown', async () => {
    await clickOnMenuItem(getI18nText('markAsLegacy'));

    expect(await markEntityAsLegacyDialog.isDisplayed()).toBe(true);
  });

  it('should mark sub skill as legacy', async () => {
    const oldStatus = await subSkillGeneralPage.getStatus();

    await markEntityAsLegacyDialog.clickOnSubmitButton();
    await waitUntil(() => markEntityAsLegacyDialog.isDisplayed(), true);
    await waitUntil(() => subSkillGeneralPage.getStatus(), oldStatus);
    await waitUntil(() => subSkillPage.isHeaderSuffixAdded(), false);

    expect((await subSkillPage.getHeaderSuffixName()).trim()).toBe(`(${getI18nText('LEGACY')})`, 'Header "Legacy" suffix');
    expect(await subSkillGeneralPage.getStatus()).toBe(getI18nText('LEGACY'), 'Sub Skill status');
  });
});

