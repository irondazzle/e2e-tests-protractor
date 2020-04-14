import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { generateName, getCurrentUsername, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import {
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodeMapPage,
  CreateCompetenciesNodeChildDialog,
  MyCompetenciesGroupsPage
} from '@e2e/page-objects';

describe('Create Skill', () => {
  const groupName = generateName();
  const createSkillDialog = new CreateCompetenciesNodeChildDialog();

  function commonTests(skillName: string) {
    it('skill name field should be displayed', async () => {
      expect(await createSkillDialog.isNameFieldDisplayed()).toBe(true);
    });

    it('owner field should be displayed', async () => {
      expect(await createSkillDialog.isOwnerFieldDisplayed()).toBe(true);
    });

    it('should display error that name is already in use', async () => {
      await createSkillDialog.setNameFieldValue(groupName);

      await createSkillDialog.clickOnSubmitButton();
      await waitUntil(() => createSkillDialog.isSubmitButtonEnabled(), false);

      expect(await createSkillDialog.isNameFieldErrorDisplayed()).toBe(true);
      expect(await createSkillDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.NameIsInUse'));
    });

    it('should display errors that name and owner fields are required', async () => {
      await createSkillDialog.clearNameField();
      await createSkillDialog.clearOwnerField();
      await createSkillDialog.clickOnSubmitButton();

      expect(await createSkillDialog.isNameFieldErrorDisplayed()).toBe(true, 'Name ');
      expect(await createSkillDialog.isOwnerFieldErrorDisplayed()).toBe(true, 'Owner');

      expect(await createSkillDialog.getNameFieldErrorText())
        .toBe(getI18nText('errorCodes.Required'), 'Name error incorrect text');
      expect(await createSkillDialog.getOwnerFieldErrorText())
        .toBe(getI18nText('errorCodes.Required'), 'Owner error incorrect text');
    });

    it('should display error that skill name is longer than 64 symbols', async () => {
      await createSkillDialog.setNameFieldValue('Curabitur blandit enim vel consectetur pharetra arcu lacus malesuada');
      await createSkillDialog.clickOnSubmitButton();

      expect(await createSkillDialog.isNameFieldErrorDisplayed()).toBe(true);
      expect(await createSkillDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.StringLength', { length: 64 }));
    });

    it('should set the skill name', async () => {
      await createSkillDialog.setNameFieldValue(skillName);

      expect(await createSkillDialog.getNameFieldValue()).toBe(skillName);
    });

    it('should set the skill owner', async () => {
      const ownerName = await getCurrentUsername();

      await createSkillDialog.setOwnerFieldValue(ownerName);

      expect(await createSkillDialog.getOwnerFieldValue()).toBe(ownerName);
    });

    it('should select the basic proficiency scale mode', async () => {
      await createSkillDialog.setPSMode(ProficiencyScaleDefinitionMode.Basic);

      expect(await createSkillDialog.getPSModeValue()).toBe(ProficiencyScaleDefinitionMode.Basic);
    });

    it('should select the extended proficiency scale mode', async () => {
      await createSkillDialog.setPSMode(ProficiencyScaleDefinitionMode.Extended);

      expect(await createSkillDialog.getPSModeValue()).toBe(ProficiencyScaleDefinitionMode.Extended);
    });

    it('dialog should close after successful creation', async () => {
      await createSkillDialog.clickOnSubmitButton();
      await waitUntil(() => createSkillDialog.isDisplayed(), true);

      expect(await createSkillDialog.isDisplayed()).toBe(false);
    });
  }

  it('should create competencies group', async () => {
    const myGroupsPage = new MyCompetenciesGroupsPage();
    const competencyGroupId = await myGroupsPage.createAndNavigateToCompetencyGroup(groupName);

    expect(competencyGroupId).toBeTruthy();
  });

  it('should create competency', async () => {
    const groupMapPage = new CompetenciesGroupMapPage();
    const competencyId = await groupMapPage.createAndNavigateToCompetency();

    expect(competencyId).toBeTruthy();
  });

  describe('from competency "map" tab', () => {
    const skillName = generateName();
    const competencyMapPage = new CompetenciesNodeMapPage();

    beforeAll(async () => {
      await competencyMapPage.navigate();
    });

    it('create skill button should be displayed', async () => {
      expect(await competencyMapPage.isCreateChildButtonDisplayed()).toBe(true);
    });

    it('should open create skill modal window', async () => {
      await competencyMapPage.clickOnCreateChildButton();

      expect(await createSkillDialog.isDisplayed()).toBe(true);
    });

    commonTests(skillName);

    it('should create skill', async () => {
      expect(await competencyMapPage.getChildId(skillName)).toBeTruthy();
    });
  });

  describe('from competency "general" tab', () => {
    const competencyGeneralPage = new CompetenciesNodeGeneralPage();
    const skillName = generateName();

    beforeAll(async () => {
      await competencyGeneralPage.navigate();
    });

    it('skill datatable should be displayed', async () => {
      expect(await competencyGeneralPage.isChildrenDataTableDisplayed()).toBe(true);
    });

    it('create skill button should be displayed', async () => {
      expect(await competencyGeneralPage.isCreateChildButtonDisplayed()).toBe(true);
    });

    it('should open create skill modal window', async () => {
      await competencyGeneralPage.clickOnCreateChildButton();

      expect(await createSkillDialog.isDisplayed()).toBe(true);
    });

    commonTests(skillName);

    it('should create skill', async () => {
      expect(await competencyGeneralPage.isChildCreated(skillName)).toBe(true);
    });
  });
});
