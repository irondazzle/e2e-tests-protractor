import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { generateName, getCurrentUsername, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import {
  CompetenciesGroupGeneralPage,
  CompetenciesGroupMapPage,
  CreateCompetenciesGroupChildDialog,
  MyCompetenciesGroupsPage
} from '@e2e/page-objects';

describe('Create Competency', () => {
  const groupName = generateName();
  const createCompetencyDialog = new CreateCompetenciesGroupChildDialog();
  const myGroupsPage = new MyCompetenciesGroupsPage();
  let groupId: string;

  function commonTests(competencyName: string) {
    it('competency name field should be displayed', async () => {
      expect(await createCompetencyDialog.isNameFieldDisplayed()).toBe(true);
    });

    it('owner field should be displayed', async () => {
      expect(await createCompetencyDialog.isOwnerFieldDisplayed()).toBe(true);
    });

    it('should display error that name is already in use', async () => {
      await createCompetencyDialog.setNameFieldValue(groupName);

      await createCompetencyDialog.clickOnSubmitButton();
      await waitUntil(() => createCompetencyDialog.isSubmitButtonEnabled(), false);

      expect(await createCompetencyDialog.isNameFieldErrorDisplayed()).toBe(true);
      expect(await createCompetencyDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.NameIsInUse'));
    });

    it('should display errors that name and owner fields are required', async () => {
      await createCompetencyDialog.clearNameField();
      await createCompetencyDialog.clearOwnerField();
      await createCompetencyDialog.clickOnSubmitButton();

      expect(await createCompetencyDialog.isNameFieldErrorDisplayed()).toBe(true, 'Name ');
      expect(await createCompetencyDialog.isOwnerFieldErrorDisplayed()).toBe(true, 'Owner');

      expect(await createCompetencyDialog.getNameFieldErrorText())
        .toBe(getI18nText('errorCodes.Required'), 'Name error incorrect text');
      expect(await createCompetencyDialog.getOwnerFieldErrorText())
        .toBe(getI18nText('errorCodes.Required'), 'Owner error incorrect text');
    });

    it('should display error that competency name is longer than 64 symbols', async () => {
      await createCompetencyDialog.setNameFieldValue('Curabitur blandit enim vel consectetur pharetra arcu lacus malesuada');
      await createCompetencyDialog.clickOnSubmitButton();

      expect(await createCompetencyDialog.isNameFieldErrorDisplayed()).toBe(true);
      expect(await createCompetencyDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.StringLength', { length: 64 }));
    });

    it('should set the competency name', async () => {
      await createCompetencyDialog.setNameFieldValue(competencyName);

      expect(await createCompetencyDialog.getNameFieldValue()).toBe(competencyName);
    });

    it('should set the competency owner', async () => {
      const ownerName = await getCurrentUsername();

      await createCompetencyDialog.setOwnerFieldValue(ownerName);

      expect(await createCompetencyDialog.getOwnerFieldValue()).toBe(ownerName);
    });

    it('should select the basic proficiency scale mode', async () => {
      await createCompetencyDialog.setPSMode(ProficiencyScaleDefinitionMode.Basic);

      expect(await createCompetencyDialog.getPSModeValue()).toBe(ProficiencyScaleDefinitionMode.Basic);
    });

    it('should select the extended proficiency scale mode', async () => {
      await createCompetencyDialog.setPSMode(ProficiencyScaleDefinitionMode.Extended);

      expect(await createCompetencyDialog.getPSModeValue()).toBe(ProficiencyScaleDefinitionMode.Extended);
    });

    it('dialog should close after successful creation', async () => {
      await createCompetencyDialog.clickOnSubmitButton();
      await waitUntil(() => createCompetencyDialog.isDisplayed(), true);

      expect(await createCompetencyDialog.isDisplayed()).toBe(false);
    });
  }

  it('should create competencies group', async () => {
    groupId = await myGroupsPage.createAndNavigateToCompetencyGroup(groupName);

    expect(groupId).toBeTruthy();
  });

  describe('from group "map" tab', () => {
    const competencyName = generateName();
    const groupMapPage = new CompetenciesGroupMapPage();

    beforeAll(async () => {
      await groupMapPage.navigate();
    });

    it('create competency button should be displayed', async () => {
      expect(await groupMapPage.isCreateCompetencyButtonDisplayed()).toBe(true);
    });

    it('should open create competency modal window', async () => {
      await groupMapPage.clickOnCreateCompetencyButton();

      expect(await createCompetencyDialog.isDisplayed()).toBe(true);
    });

    commonTests(competencyName);

    it('should create competency', async () => {
      expect(await groupMapPage.getCompetencyId(competencyName)).toBeTruthy();
    });
  });

  describe('from group "general" tab', () => {
    const competencyName = generateName();
    const groupGeneralPage = new CompetenciesGroupGeneralPage();

    beforeAll(async () => {
      await groupGeneralPage.navigate();
    });

    it('competency datatable should be displayed', async () => {
      expect(await groupGeneralPage.isCompetenciesDataTableDisplayed()).toBe(true);
    });

    it('create competency button should be displayed', async () => {
      expect(await groupGeneralPage.isCreateCompetencyButtonDisplayed()).toBe(true);
    });

    it('should open create competency modal window', async () => {
      await groupGeneralPage.clickOnCreateCompetencyButton();

      expect(await createCompetencyDialog.isDisplayed()).toBe(true);
    });

    commonTests(competencyName);

    it('should create competency', async () => {
      expect(await groupGeneralPage.isCompetencyCreated(competencyName)).toBe(true);
    });
  });

  describe('from "my groups" page', () => {
    const competencyName = generateName();

    beforeAll(async () => {
      await myGroupsPage.navigate();
    });

    it('create competency button should be displayed', async () => {
      expect(await myGroupsPage.isCreateCompetencyButtonDisplayed(groupId)).toBe(true);
    });

    it('should open create competency modal window', async () => {
      await myGroupsPage.clickOnCreateCompetencyButton(groupId);

      expect(await createCompetencyDialog.isDisplayed()).toBe(true);
    });

    commonTests(competencyName);

    it('should create competency', async () => {
      expect(await myGroupsPage.isCompetencyCreated(competencyName)).toBe(true);
    });
  });
});
