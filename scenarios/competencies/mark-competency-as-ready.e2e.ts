import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import {
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  EditProficiencyScalePage,
  MarkAsReadyDialog,
  MyCompetenciesGroupsPage
} from '@e2e/page-objects';

describe('Mark Competency as ready', () => {
  const competencyGeneralPage = new CompetenciesNodeGeneralPage();
  const editProficiencyScalePage = new EditProficiencyScalePage();
  const markAsReadyDialog = new MarkAsReadyDialog();
  let oldStatus;

  function commonTests(mode: ProficiencyScaleDefinitionMode) {
    it('should create competencies group', async () => {
      const myGroupsPage = new MyCompetenciesGroupsPage();
      const competencyGroupId = await myGroupsPage.createAndNavigateToCompetencyGroup();

      expect(competencyGroupId).toBeTruthy();
    });

    it('should create competency', async () => {
      const groupMapPage = new CompetenciesGroupMapPage();
      const competencyId = await groupMapPage.createAndNavigateToCompetency(mode);

      expect(competencyId).toBeTruthy();

      await competencyGeneralPage.navigate();
    });

    it('should describe competency’s proficiency scale', async () => {
      await competencyGeneralPage.clickOnDescribePSButton();
      await waitUntil(() => editProficiencyScalePage.isDisplayed(), false);

      await editProficiencyScalePage.fillPS(mode);
      await editProficiencyScalePage.clickOnSubmitButton();

      await waitUntil(() => editProficiencyScalePage.isDisplayed(), true);
      await waitUntil(() => competencyGeneralPage.isMarkAsReadyButtonDisplayed(), false);
      await waitUntil(() => competencyGeneralPage.isMarkAsReadyButtonEnabled(), false);

      expect(true).toBe(true);
    });

    it('should mark competency as ready', async () => {
      oldStatus = await competencyGeneralPage.getStatus();

      await competencyGeneralPage.clickOnMarkAsReadyButton();

      expect(await markAsReadyDialog.isDisplayed()).toBe(true, 'Dialog is not displayed');

      await markAsReadyDialog.clickOnSubmitButton();

      await waitUntil(() => markAsReadyDialog.isDisplayed(), true);
      await waitUntil(() => competencyGeneralPage.getStatus(), oldStatus);

      expect(await competencyGeneralPage.getStatus()).toBe(getI18nText('READY'));
    });
  }

  describe('with general mode', () => {
    commonTests(ProficiencyScaleDefinitionMode.Basic);
  });

  describe('with additional mode', () => {
    commonTests(ProficiencyScaleDefinitionMode.Extended);
  });
});
