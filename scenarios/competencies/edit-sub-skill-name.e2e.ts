import { generateName, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';

import {
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodeMapPage,
  EditEntityNameDialog,
  MyCompetenciesGroupsPage
} from '@e2e/page-objects';

describe('Edit Sub Skill name', () => {
  const editEntityNameDialog = new EditEntityNameDialog();
  const subSkillGeneralPage = new CompetenciesNodeGeneralPage();
  const subSkillName = generateName();

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
    expect(await subSkillGeneralPage.isAdditionalActionsDisplayed()).toBe(true);
  });

  it('edit name action should be displayed', async () => {
    await subSkillGeneralPage.clickOnAdditionalActions();

    expect(await isMenuItemDisplayed(getI18nText('editName'))).toBe(true);
  });

  it('should open edit name modal window', async () => {
    await clickOnMenuItem(getI18nText('editName'));

    expect(await editEntityNameDialog.isDisplayed()).toBe(true);
  });

  it('name field should be displayed', async () => {
    expect(await editEntityNameDialog.isNameFieldDisplayed()).toBe(true);
  });

  it('should display error that name field is required', async () => {
    await editEntityNameDialog.clearNameField();
    await editEntityNameDialog.clickOnSubmitButton();

    expect(await editEntityNameDialog.isNameFieldErrorDisplayed()).toBe(true);

    expect(await editEntityNameDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.Required'));
  });

  it('should display error that name is longer than 64 symbols', async () => {
    await editEntityNameDialog.setNameFieldValue('Curabitur blandit enim vel consectetur pharetra arcu lacus malesuada');
    await editEntityNameDialog.clickOnSubmitButton();

    expect(await editEntityNameDialog.isNameFieldErrorDisplayed()).toBe(true);
    expect(await editEntityNameDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.StringLength', { length: 64 }));
  });

  it('should set the sub skill name', async () => {
    await editEntityNameDialog.setNameFieldValue(subSkillName);

    expect(await editEntityNameDialog.getNameFieldValue()).toBe(subSkillName);
  });

  it('should change the sub skill name', async () => {
    const oldHeaderName = await subSkillGeneralPage.getHeaderName();

    await editEntityNameDialog.clickOnSubmitButton();
    await waitUntil(() => editEntityNameDialog.isDisplayed(), true);
    await waitUntil(() => subSkillGeneralPage.getHeaderName(), oldHeaderName);

    expect(await subSkillGeneralPage.getHeaderName()).toBe(subSkillName);
    expect(await subSkillGeneralPage.getBreadcrumbsName()).toBe(subSkillName, 'Sub Skill breadcrumbs name is not changed');
  });
});
