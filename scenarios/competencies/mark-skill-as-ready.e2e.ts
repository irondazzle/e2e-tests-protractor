import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import {
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodeMapPage,
  EditProficiencyScalePage,
  MarkAsReadyDialog,
  MyCompetenciesGroupsPage
} from '@e2e/page-objects';

describe('Mark Skill as ready', () => {
  const editProficiencyScalePage = new EditProficiencyScalePage();
  const markAsReadyDialog = new MarkAsReadyDialog();
  const skillGeneralPage = new CompetenciesNodeGeneralPage();
  let oldStatus;

  function commonTests(mode: ProficiencyScaleDefinitionMode) {
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
      const skillId = await competencyMapPage.createAndNavigateToChild(mode);

      expect(skillId).toBeTruthy();

      await skillGeneralPage.navigate();
    });

    it('should describe skill’s proficiency scale', async () => {
      await skillGeneralPage.clickOnDescribePSButton();
      await waitUntil(() => editProficiencyScalePage.isDisplayed(), false);

      await editProficiencyScalePage.fillPS(mode);
      await editProficiencyScalePage.clickOnSubmitButton();

      await waitUntil(() => editProficiencyScalePage.isDisplayed(), true);
      await waitUntil(() => skillGeneralPage.isMarkAsReadyButtonDisplayed(), false);
      await waitUntil(() => skillGeneralPage.isMarkAsReadyButtonEnabled(), false);

      expect(true).toBe(true);
    });

    it('should mark skill as ready', async () => {
      oldStatus = await skillGeneralPage.getStatus();

      await skillGeneralPage.clickOnMarkAsReadyButton();

      expect(await markAsReadyDialog.isDisplayed()).toBe(true, 'Dialog is not displayed');

      await markAsReadyDialog.clickOnSubmitButton();

      await waitUntil(() => markAsReadyDialog.isDisplayed(), true);
      await waitUntil(() => skillGeneralPage.getStatus(), oldStatus);

      expect(await skillGeneralPage.getStatus()).toBe(getI18nText('READY'));
    });
  }

  describe('with general mode', () => {
    commonTests(ProficiencyScaleDefinitionMode.Basic);
  });

  describe('with additional mode', () => {
    commonTests(ProficiencyScaleDefinitionMode.Extended);
  });
});
