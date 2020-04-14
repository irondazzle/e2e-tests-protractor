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

describe('Mark Competency as legacy with children', () => {
  const competencyGeneralPage = new CompetenciesNodeGeneralPage();
  const competencyMapPage = new CompetenciesNodeMapPage();
  const competencyPage = new CompetenciesNodePage();
  const markEntityAsLegacyDialog = new MarkAsLegacyDialog();
  const skillPage = new CompetenciesNodePage();
  let skillId;

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
    skillId = await competencyMapPage.createAndNavigateToChild();

    expect(skillId).toBeTruthy();
  });

  it('"mark as legacy" competency action should be disabled', async () => {
    await skillPage.navigateToParent();

    await competencyPage.isAdditionalActionsDisplayed();
    await competencyPage.clickOnAdditionalActions();

    expect(await isMenuItemEnabled(getI18nText('markAsLegacy'))).toBe(false);
    await pressEscKey();
  });

  it('should mark skill as legacy', async () => {
    await competencyMapPage.navigate();
    await competencyMapPage.navigateToChild(skillId);

    await skillPage.markAsLegacy();

    expect((await skillPage.getHeaderSuffixName()).trim()).toBe(`(${getI18nText('LEGACY')})`);
  });

  it('"mark as legacy" competency action should be enabled', async () => {
    await skillPage.navigateToParent();
    await competencyGeneralPage.navigate();

    await competencyPage.isAdditionalActionsDisplayed();
    await competencyPage.clickOnAdditionalActions();
    await isMenuItemDisplayed(getI18nText('markAsLegacy'));

    expect(await isMenuItemEnabled(getI18nText('markAsLegacy'))).toBe(true);
  });

  it('mark as legacy window should be shown', async () => {
    await clickOnMenuItem(getI18nText('markAsLegacy'));

    expect(await markEntityAsLegacyDialog.isDisplayed()).toBe(true);
  });

  it('should mark competency as legacy', async () => {
    const oldStatus = await competencyGeneralPage.getStatus();

    await markEntityAsLegacyDialog.clickOnSubmitButton();
    await waitUntil(() => markEntityAsLegacyDialog.isDisplayed(), true);
    await waitUntil(() => competencyGeneralPage.getStatus(), oldStatus);
    await waitUntil(() => competencyPage.isHeaderSuffixAdded(), false);

    expect((await competencyPage.getHeaderSuffixName()).trim()).toBe(`(${getI18nText('LEGACY')})`, 'Header "Legacy" suffix');
    expect(await competencyGeneralPage.getStatus()).toBe(getI18nText('LEGACY'), 'Competency status');
  });
});
