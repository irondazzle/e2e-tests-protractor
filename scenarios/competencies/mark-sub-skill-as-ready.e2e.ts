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

describe('Mark Sub Skill as ready', () => {
  const editProficiencyScalePage = new EditProficiencyScalePage();
  const markAsReadyDialog = new MarkAsReadyDialog();
  const subSkillGeneralPage = new CompetenciesNodeGeneralPage();
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
      const skillId = await competencyMapPage.createAndNavigateToChild();

      expect(skillId).toBeTruthy();
    });

    it('should create sub skill', async () => {
      const skillMapPage = new CompetenciesNodeMapPage();
      const subSkillId = await skillMapPage.createAndNavigateToChild(mode);

      expect(subSkillId).toBeTruthy();

      await subSkillGeneralPage.navigate();
    });

    it('should describe sub skill’s proficiency scale', async () => {
      await subSkillGeneralPage.clickOnDescribePSButton();
      await waitUntil(() => editProficiencyScalePage.isDisplayed(), false);

      await editProficiencyScalePage.fillPS(mode);
      await editProficiencyScalePage.clickOnSubmitButton();

      await waitUntil(() => editProficiencyScalePage.isDisplayed(), true);
      await waitUntil(() => subSkillGeneralPage.isMarkAsReadyButtonDisplayed(), false);
      await waitUntil(() => subSkillGeneralPage.isMarkAsReadyButtonEnabled(), false);

      expect(true).toBe(true);
    });

    it('should mark sub skill as ready', async () => {
      oldStatus = await subSkillGeneralPage.getStatus();

      await subSkillGeneralPage.clickOnMarkAsReadyButton();

      expect(await markAsReadyDialog.isDisplayed()).toBe(true, 'Dialog is not displayed');

      await markAsReadyDialog.clickOnSubmitButton();

      await waitUntil(() => markAsReadyDialog.isDisplayed(), true);
      await waitUntil(() => subSkillGeneralPage.getStatus(), oldStatus);

      expect(await subSkillGeneralPage.getStatus()).toBe(getI18nText('READY'));
    });
  }

  describe('with general mode', () => {
    commonTests(ProficiencyScaleDefinitionMode.Basic);
  });

  describe('with additional mode', () => {
    commonTests(ProficiencyScaleDefinitionMode.Extended);
  });
});
