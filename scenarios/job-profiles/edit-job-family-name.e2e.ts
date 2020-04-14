import { generateName, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';

import { EditEntityNameDialog, JobFamilyPage, MyFamiliesPage } from '@e2e/page-objects';

describe('Edit Job Family name', () => {
  const editEntityNameDialog = new EditEntityNameDialog();
  const jobFamilyName = generateName();
  const jobFamilyPage = new JobFamilyPage();

  it('should create job family', async () => {
    const myFamiliesPage = new MyFamiliesPage();
    const jobFamilyId = await myFamiliesPage.createAndNavigateToJobFamily();

    expect(jobFamilyId).toBeTruthy();
  });

  it('additional actions should be displayed', async () => {
    expect(await jobFamilyPage.isAdditionalActionsDisplayed()).toBe(true);
  });

  it('edit name action should be displayed', async () => {
    await jobFamilyPage.clickOnAdditionalActions();

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

  it('should set the job family name', async () => {
    await editEntityNameDialog.setNameFieldValue(jobFamilyName);

    expect(await editEntityNameDialog.getNameFieldValue()).toBe(jobFamilyName);
  });

  it('should change the job family name', async () => {
    const oldHeaderName = await jobFamilyPage.getHeaderName();

    await editEntityNameDialog.clickOnSubmitButton();
    await waitUntil(() => editEntityNameDialog.isDisplayed(), true);
    await waitUntil(() => jobFamilyPage.getHeaderName(), oldHeaderName);

    expect(await jobFamilyPage.getHeaderName()).toBe(jobFamilyName);
    expect(await jobFamilyPage.getBreadcrumbsName()).toBe(jobFamilyName, 'Job Family breadcrumbs name is not changed');
  });
});
