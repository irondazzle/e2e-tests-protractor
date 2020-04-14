import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';

import {
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodePage,
  MarkAsLegacyDialog,
  MyCompetenciesGroupsPage
} from '@e2e/page-objects';

describe('Mark Competency as legacy without children', () => {
  const competencyGeneralPage = new CompetenciesNodeGeneralPage();
  const competencyPage = new CompetenciesNodePage();
  const markEntityAsLegacyDialog = new MarkAsLegacyDialog();

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

  it('additional actions should be displayed', async () => {
    expect(await competencyPage.isAdditionalActionsDisplayed()).toBe(true);
  });

  it('"mark as legacy" action should be displayed', async () => {
    await competencyPage.clickOnAdditionalActions();

    expect(await isMenuItemDisplayed(getI18nText('markAsLegacy'))).toBe(true);
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
