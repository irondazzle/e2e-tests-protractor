import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';

import { ChangeEntityOwnerDialog, JobFamilyGeneralPage, MyFamiliesPage } from '@e2e/page-objects';

describe('Change Job Family owner', () => {
  const changeEntityOwnerDialog = new ChangeEntityOwnerDialog();
  const jobFamilyGeneralPage = new JobFamilyGeneralPage();
  const ownerName = 'Roman Berezin';

  it('should create job family', async () => {
    const myFamiliesPage = new MyFamiliesPage();
    const jobFamilyId = await myFamiliesPage.createAndNavigateToJobFamily();

    expect(jobFamilyId).toBeTruthy();

    await jobFamilyGeneralPage.navigate();
  });

  it('additional actions should be displayed', async () => {
    expect(await jobFamilyGeneralPage.isAdditionalActionsDisplayed()).toBe(true);
  });

  it('change owner action should be displayed', async () => {
    await jobFamilyGeneralPage.clickOnAdditionalActions();

    expect(await isMenuItemDisplayed(getI18nText('changeOwner'))).toBe(true);
  });

  it('should open change owner modal window', async () => {
    await clickOnMenuItem(getI18nText('changeOwner'));

    expect(await changeEntityOwnerDialog.isDisplayed()).toBe(true);
  });

  it('owner field should be displayed', async () => {
    expect(await changeEntityOwnerDialog.isOwnerFieldDisplayed()).toBe(true);
  });

  it('should display error that owner field is required', async () => {
    await changeEntityOwnerDialog.clearOwnerField();
    await changeEntityOwnerDialog.clickOnSubmitButton();

    expect(await changeEntityOwnerDialog.isOwnerFieldDisplayed()).toBe(true);

    expect(await changeEntityOwnerDialog.getOwnerFieldErrorText()).toBe(getI18nText('errorCodes.Required'));
  });

  it('should set the job family owner', async () => {
    await changeEntityOwnerDialog.setOwnerFieldValue(ownerName);

    expect(await changeEntityOwnerDialog.getOwnerFieldValue()).toBe(ownerName);
  });

  it('should change the job family owner', async () => {
    const oldGroupOwner = await jobFamilyGeneralPage.getOwner();

    await changeEntityOwnerDialog.clickOnSubmitButton();
    await waitUntil(() => changeEntityOwnerDialog.isDisplayed(), true);
    await waitUntil(() => jobFamilyGeneralPage.getOwner(), oldGroupOwner);

    expect(await jobFamilyGeneralPage.getOwner()).toBe(ownerName);
  });
});
