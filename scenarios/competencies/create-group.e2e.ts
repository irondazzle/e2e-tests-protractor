import { generateName, getCurrentUsername, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { CreateGroupDialog, MyCompetenciesGroupsPage } from '@e2e/page-objects';

describe('Create Competencies Group', () => {
  const groupName = generateName();
  const createGroupDialog = new CreateGroupDialog();
  const myGroupsPage = new MyCompetenciesGroupsPage();

  beforeAll(async () => {
    await myGroupsPage.navigate();
  });

  it('create group button should be displayed', async () => {
    expect(await myGroupsPage.isCreateGroupButtonDisplayed()).toBe(true);
  });

  it('should open create group modal window', async () => {
    await myGroupsPage.clickOnCreateGroupButton();

    expect(await createGroupDialog.isDisplayed()).toBe(true);
  });

  it('competencies group name field should be displayed', async () => {
    expect(await createGroupDialog.isNameFieldDisplayed()).toBe(true);
  });

  it('centers of excellence field should be displayed', async () => {
    expect(await createGroupDialog.isCoEFieldDisplayed()).toBe(true);
  });

  it('owner field should be displayed', async () => {
    expect(await createGroupDialog.isOwnerFieldDisplayed()).toBe(true);
  });

  it('should display errors that name and coe fields are required', async () => {
    await createGroupDialog.clickOnSubmitButton();

    expect(await createGroupDialog.isNameFieldErrorDisplayed()).toBe(true, 'Name');
    expect(await createGroupDialog.isCoEFieldErrorDisplayed()).toBe(true, 'CoE');
    expect(await createGroupDialog.isOwnerFieldErrorDisplayed()).toBe(false, 'Owner');

    expect(await createGroupDialog.getNameFieldErrorText())
      .toBe(getI18nText('errorCodes.Required'), 'Name error incorrect text');
    expect(await createGroupDialog.getCoeFieldError()).toBe(getI18nText('errorCodes.Required'), 'CoE error incorrect text');
  });

  it('should display error that group name is longer than 64 symbols', async () => {
    await createGroupDialog.setNameFieldValue('Curabitur blandit enim vel consectetur pharetra arcu lacus malesuada');
    await createGroupDialog.clickOnSubmitButton();

    expect(await createGroupDialog.isNameFieldErrorDisplayed()).toBe(true);
    expect(await createGroupDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.StringLength', { length: 64 }));
  });

  it('should set the competencies group name', async () => {
    await createGroupDialog.setNameFieldValue(groupName);

    expect(await createGroupDialog.getNameFieldValue()).toBe(groupName);
    expect(await createGroupDialog.isNameFieldErrorDisplayed()).toBe(false);
  });

  it('should set the center of excellence', async () => {
    const coeName = 'Engagement - IntelliGrowth';

    await createGroupDialog.setCoEFieldValue(coeName);

    expect(await createGroupDialog.getCoeFieldValue()).toBe(coeName);
    expect(await createGroupDialog.isCoEFieldErrorDisplayed()).toBe(false);
  });

  it('should display error that owner field is required', async () => {
    await createGroupDialog.clickOnSubmitButton();

    expect(await createGroupDialog.isNameFieldErrorDisplayed()).toBe(false, 'Name');
    expect(await createGroupDialog.isCoEFieldErrorDisplayed()).toBe(false, 'CoE');
    expect(await createGroupDialog.isOwnerFieldErrorDisplayed()).toBe(true, 'Owner');

    expect(await createGroupDialog.getOwnerFieldErrorText())
      .toBe(getI18nText('errorCodes.Required'));
  });

  it('should set the competencies group owner', async () => {
    const ownerName = await getCurrentUsername();

    await createGroupDialog.setOwnerFieldValue(ownerName);

    expect(await createGroupDialog.getOwnerFieldValue()).toBe(ownerName);
    expect(await createGroupDialog.isOwnerFieldErrorDisplayed()).toBe(false);
  });

  it('should create competencies group', async () => {
    await createGroupDialog.clickOnSubmitButton();
    await waitUntil(() => createGroupDialog.isDisplayed(), true);

    expect(await myGroupsPage.getCompetencyGroupId(groupName)).toBeTruthy();
  });
});
