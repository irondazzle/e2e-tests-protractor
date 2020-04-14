import { pressEscKey, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed, isMenuItemEnabled } from '@e2e/helpers/menu-helper';

import {
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodeMapPage,
  CompetenciesNodePage,
  MarkAsLegacyDialog,
  MyCompetenciesGroupsPage
} from '@e2e/page-objects';

describe('Mark Skill as legacy with children', () => {
  const markEntityAsLegacyDialog = new MarkAsLegacyDialog();
  const skillGeneralPage = new CompetenciesNodeGeneralPage();
  const skillMapPage = new CompetenciesNodeMapPage();
  const skillPage = new CompetenciesNodePage();
  const subSkillPage = new CompetenciesNodePage();
  let subSkillId;

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
    subSkillId = await skillMapPage.createAndNavigateToChild();

    expect(subSkillId).toBeTruthy();
  });

  it('"mark as legacy" skill action should be disabled', async () => {
    await subSkillPage.navigateToParent();

    await skillPage.isAdditionalActionsDisplayed();
    await skillPage.clickOnAdditionalActions();

    expect(await isMenuItemEnabled(getI18nText('markAsLegacy'))).toBe(false);
    await pressEscKey();
  });

  it('should mark sub skill as legacy', async () => {
    await skillMapPage.navigate();
    await skillMapPage.navigateToChild(subSkillId);

    await subSkillPage.markAsLegacy();

    expect((await subSkillPage.getHeaderSuffixName()).trim()).toBe(`(${getI18nText('LEGACY')})`);
  });

  it('"mark as legacy" skill action should be enabled', async () => {
    await subSkillPage.navigateToParent();
    await skillGeneralPage.navigate();

    await skillPage.isAdditionalActionsDisplayed();
    await skillPage.clickOnAdditionalActions();
    await isMenuItemDisplayed(getI18nText('markAsLegacy'));

    expect(await isMenuItemEnabled(getI18nText('markAsLegacy'))).toBe(true);
  });

  it('mark as legacy window should be shown', async () => {
    await clickOnMenuItem(getI18nText('markAsLegacy'));

    expect(await markEntityAsLegacyDialog.isDisplayed()).toBe(true);
  });

  it('should mark skill as legacy', async () => {
    const oldStatus = await skillGeneralPage.getStatus();

    await markEntityAsLegacyDialog.clickOnSubmitButton();
    await waitUntil(() => markEntityAsLegacyDialog.isDisplayed(), true);
    await waitUntil(() => skillGeneralPage.getStatus(), oldStatus);
    await waitUntil(() => skillPage.isHeaderSuffixAdded(), false);

    expect((await skillPage.getHeaderSuffixName()).trim()).toBe(`(${getI18nText('LEGACY')})`, 'Header "Legacy" suffix');
    expect(await skillGeneralPage.getStatus()).toBe(getI18nText('LEGACY'), 'Skill status');
  });
});
