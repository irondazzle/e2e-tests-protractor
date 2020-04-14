import { generateName, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';

import { CompetenciesGroupGeneralPage, EditEntityNameDialog, MyCompetenciesGroupsPage } from '@e2e/page-objects';

describe('Edit Competencies Group name', () => {
  const groupName = generateName();
  const editEntityNameDialog = new EditEntityNameDialog();
  const groupGeneralPage = new CompetenciesGroupGeneralPage();

  it('should create competencies group', async () => {
    const myGroupsPage = new MyCompetenciesGroupsPage();
    const competencyGroupId = await myGroupsPage.createAndNavigateToCompetencyGroup();

    expect(competencyGroupId).toBeTruthy();

    await groupGeneralPage.navigate();
  });

  it('additional actions should be displayed', async () => {
    expect(await groupGeneralPage.isAdditionalActionsDisplayed()).toBe(true);
  });

  it('edit name action should be displayed', async () => {
    await groupGeneralPage.clickOnAdditionalActions();

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

  it('should set the competencies group name', async () => {
    await editEntityNameDialog.setNameFieldValue(groupName);

    expect(await editEntityNameDialog.getNameFieldValue()).toBe(groupName);
  });

  it('should change the competencies group name', async () => {
    const oldHeaderName = await groupGeneralPage.getHeaderName();

    await editEntityNameDialog.clickOnSubmitButton();
    await waitUntil(() => editEntityNameDialog.isDisplayed(), true);
    await waitUntil(() => groupGeneralPage.getHeaderName(), oldHeaderName);

    expect(await groupGeneralPage.getHeaderName()).toBe(groupName);
    expect(await groupGeneralPage.getBreadcrumbsName()).toBe(groupName, 'competencies group breadcrumbs name is not changed');
  });
});
