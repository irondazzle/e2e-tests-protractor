import { generateName, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';

import { CompetenciesGroupMapPage, CompetenciesNodeGeneralPage, EditEntityNameDialog, MyCompetenciesGroupsPage } from '@e2e/page-objects';

describe('Edit Competency name', () => {
  const competencyGeneralPage = new CompetenciesNodeGeneralPage();
  const competencyName = generateName();
  const editEntityNameDialog = new EditEntityNameDialog();

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
    expect(await competencyGeneralPage.isAdditionalActionsDisplayed()).toBe(true);
  });

  it('edit name action should be displayed', async () => {
    await competencyGeneralPage.clickOnAdditionalActions();

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

  it('should set the competency name', async () => {
    await editEntityNameDialog.setNameFieldValue(competencyName);

    expect(await editEntityNameDialog.getNameFieldValue()).toBe(competencyName);
  });

  it('should change the competency name', async () => {
    const oldHeaderName = await competencyGeneralPage.getHeaderName();

    await editEntityNameDialog.clickOnSubmitButton();
    await waitUntil(() => editEntityNameDialog.isDisplayed(), true);
    await waitUntil(() => competencyGeneralPage.getHeaderName(), oldHeaderName);

    expect(await competencyGeneralPage.getHeaderName()).toBe(competencyName);
    expect(await competencyGeneralPage.getBreadcrumbsName()).toBe(competencyName, 'Competency breadcrumbs name is not changed');
  });
});
