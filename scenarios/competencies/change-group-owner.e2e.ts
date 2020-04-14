import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';

import { ChangeEntityOwnerDialog, CompetenciesGroupGeneralPage, MyCompetenciesGroupsPage } from '@e2e/page-objects';

describe('Change Competencies Group owner', () => {
  const changeEntityOwnerDialog = new ChangeEntityOwnerDialog();
  const groupGeneralPage = new CompetenciesGroupGeneralPage();
  const ownerName = 'Roman Berezin'; // TODO don't do like this

  it('should create competencies group', async () => {
    const myGroupsPage = new MyCompetenciesGroupsPage();
    const competencyGroupId = await myGroupsPage.createAndNavigateToCompetencyGroup();

    expect(competencyGroupId).toBeTruthy();

    await groupGeneralPage.navigate();});

  it('additional actions should be displayed', async () => {
    expect(await groupGeneralPage.isAdditionalActionsDisplayed()).toBe(true);
  });

  it('change owner action should be displayed', async () => {
    await groupGeneralPage.clickOnAdditionalActions();

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

    expect(await changeEntityOwnerDialog.isOwnerFieldErrorDisplayed()).toBe(true);

    expect(await changeEntityOwnerDialog.getOwnerFieldErrorText()).toBe(getI18nText('errorCodes.Required'));
  });

  it('should set the competencies group owner', async () => {
    await changeEntityOwnerDialog.setOwnerFieldValue(ownerName);

    expect(await changeEntityOwnerDialog.getOwnerFieldValue()).toBe(ownerName);
  });

  it('should change the competencies group owner', async () => {
    const oldGroupOwner = await groupGeneralPage.getOwner();

    await changeEntityOwnerDialog.clickOnSubmitButton();
    await waitUntil(() => changeEntityOwnerDialog.isDisplayed(), true);
    await waitUntil(() => groupGeneralPage.getOwner(), oldGroupOwner);

    expect(await groupGeneralPage.getOwner()).toBe(ownerName);
  });
});
