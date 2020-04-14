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

describe('Create Sub Skill', () => {
  const groupName = generateName();
  const createSubSkillDialog = new CreateCompetenciesNodeChildDialog();

  function commonTests(subSkillName: string) {
    it('sub skill name field should be displayed', async () => {
      expect(await createSubSkillDialog.isNameFieldDisplayed()).toBe(true);
    });

    it('owner field should be displayed', async () => {
      expect(await createSubSkillDialog.isOwnerFieldDisplayed()).toBe(true);
    });

    it('should display error that name is already in use', async () => {
      await createSubSkillDialog.setNameFieldValue(groupName);

      await createSubSkillDialog.clickOnSubmitButton();
      await waitUntil(() => createSubSkillDialog.isSubmitButtonEnabled(), false);

      expect(await createSubSkillDialog.isNameFieldErrorDisplayed()).toBe(true);
      expect(await createSubSkillDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.NameIsInUse'));
    });

    it('should display errors that name and owner fields are required', async () => {
      await createSubSkillDialog.clearNameField();
      await createSubSkillDialog.clearOwnerField();
      await createSubSkillDialog.clickOnSubmitButton();

      expect(await createSubSkillDialog.isNameFieldErrorDisplayed()).toBe(true, 'Name ');
      expect(await createSubSkillDialog.isOwnerFieldErrorDisplayed()).toBe(true, 'Owner');

      expect(await createSubSkillDialog.getNameFieldErrorText())
        .toBe(getI18nText('errorCodes.Required'), 'Name error incorrect text');
      expect(await createSubSkillDialog.getOwnerFieldErrorText())
        .toBe(getI18nText('errorCodes.Required'), 'Owner error incorrect text');
    });

    it('should display error that sub skill name is longer than 64 symbols', async () => {
      await createSubSkillDialog.setNameFieldValue('Curabitur blandit enim vel consectetur pharetra arcu lacus malesuada');
      await createSubSkillDialog.clickOnSubmitButton();

      expect(await createSubSkillDialog.isNameFieldErrorDisplayed()).toBe(true);
      expect(await createSubSkillDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.StringLength', { length: 64 }));
    });

    it('should set the sub skill name', async () => {
      await createSubSkillDialog.setNameFieldValue(subSkillName);

      expect(await createSubSkillDialog.getNameFieldValue()).toBe(subSkillName);
    });

    it('should set the sub skill owner', async () => {
      const ownerName = await getCurrentUsername();

      await createSubSkillDialog.setOwnerFieldValue(ownerName);

      expect(await createSubSkillDialog.getOwnerFieldValue()).toBe(ownerName);
    });

    it('should select the basic proficiency scale mode', async () => {
      await createSubSkillDialog.setPSMode(ProficiencyScaleDefinitionMode.Basic);

      expect(await createSubSkillDialog.getPSModeValue()).toBe(ProficiencyScaleDefinitionMode.Basic);
    });

    it('should select the extended proficiency scale mode', async () => {
      await createSubSkillDialog.setPSMode(ProficiencyScaleDefinitionMode.Extended);

      expect(await createSubSkillDialog.getPSModeValue()).toBe(ProficiencyScaleDefinitionMode.Extended);
    });

    it('dialog should close after successful creation', async () => {
      await createSubSkillDialog.clickOnSubmitButton();
      await waitUntil(() => createSubSkillDialog.isDisplayed(), true);

      expect(await createSubSkillDialog.isDisplayed()).toBe(false);
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

  it('should create skill', async () => {
    const competencyMapPage = new CompetenciesNodeMapPage();
    const skillId = await competencyMapPage.createAndNavigateToChild();

    expect(skillId).toBeTruthy();
  });

  describe('from skill "map" tab', () => {
    const skillMapPage = new CompetenciesNodeMapPage();
    const subSkillName = generateName();

    beforeAll(async () => {
      await skillMapPage.navigate();
    });

    it('create sub skill button should be displayed', async () => {
      expect(await skillMapPage.isCreateChildButtonDisplayed()).toBe(true);
    });

    it('should open create sub skill modal window', async () => {
      await skillMapPage.clickOnCreateChildButton();

      expect(await createSubSkillDialog.isDisplayed()).toBe(true);
    });

    commonTests(subSkillName);

    it('should create sub skill', async () => {
      expect(await skillMapPage.getChildId(subSkillName)).toBeTruthy();
    });
  });

  describe('from skill "general" tab', () => {
    const skillGeneralPage = new CompetenciesNodeGeneralPage();
    const subSkillName = generateName();

    beforeAll(async () => {
      await skillGeneralPage.navigate();
    });

    it('sub skill datatable should be displayed', async () => {
      expect(await skillGeneralPage.isChildrenDataTableDisplayed()).toBe(true);
    });

    it('create sub skill button should be displayed', async () => {
      expect(await skillGeneralPage.isCreateChildButtonDisplayed()).toBe(true);
    });

    it('should open create sub skill modal window', async () => {
      await skillGeneralPage.clickOnCreateChildButton();

      expect(await createSubSkillDialog.isDisplayed()).toBe(true);
    });

    commonTests(subSkillName);

    it('should create sub skill', async () => {
      expect(await skillGeneralPage.isChildCreated(subSkillName)).toBe(true);
    });
  });
});
