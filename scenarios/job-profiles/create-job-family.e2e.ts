import { generateName, getCurrentUsername, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { CreateJobFamilyDialog, MyFamiliesPage } from '@e2e/page-objects';

describe('Create Job Family', () => {
  const createJobFamilyDialog = new CreateJobFamilyDialog();
  const jobFamilyName = generateName();
  const myFamiliesPage = new MyFamiliesPage();

  beforeAll(async () => {
    await myFamiliesPage.navigate();
  });

  it('create job family button should be displayed', async () => {
    expect(await myFamiliesPage.isCreateJobFamilyButtonDisplayed()).toBe(true);
  });

  it('should open create job family modal window', async () => {
    await myFamiliesPage.clickOnCreateJobFamilyButton();

    expect(await createJobFamilyDialog.isDisplayed()).toBe(true);
  });

  it('job family name field should be displayed', async () => {
    expect(await createJobFamilyDialog.isNameFieldDisplayed()).toBe(true);
  });

  it('owner field should be displayed', async () => {
    expect(await createJobFamilyDialog.isOwnerFieldDisplayed()).toBe(true);
  });

  it('should display errors that name and owner fields are required', async () => {
    await createJobFamilyDialog.clearOwnerField();
    await createJobFamilyDialog.clickOnSubmitButton();

    expect(await createJobFamilyDialog.isNameFieldErrorDisplayed()).toBe(true, 'Name ');
    expect(await createJobFamilyDialog.isOwnerFieldErrorDisplayed()).toBe(true, 'Owner');

    expect(await createJobFamilyDialog.getNameFieldErrorText())
      .toBe(getI18nText('errorCodes.Required'), 'Name error incorrect text');
    expect(await createJobFamilyDialog.getOwnerFieldErrorText())
      .toBe(getI18nText('errorCodes.Required'), 'Owner error incorrect text');
  });

  it('should display error that job family name is longer than 64 symbols', async () => {
    await createJobFamilyDialog.setNameFieldValue('Curabitur blandit enim vel consectetur pharetra arcu lacus malesuada');
    await createJobFamilyDialog.clickOnSubmitButton();

    expect(await createJobFamilyDialog.isNameFieldErrorDisplayed()).toBe(true);
    expect(await createJobFamilyDialog.getNameFieldErrorText()).toBe(getI18nText('errorCodes.StringLength', { length: 64 }));
  });

  it('should set the job family name', async () => {
    await createJobFamilyDialog.setNameFieldValue(jobFamilyName);

    expect(await createJobFamilyDialog.getNameFieldValue()).toBe(jobFamilyName);
  });

  it('should set the job family owner', async () => {
    const ownerName = await getCurrentUsername();

    await createJobFamilyDialog.setOwnerFieldValue(ownerName);

    expect(await createJobFamilyDialog.getOwnerFieldValue()).toBe(ownerName);
  });

  it('should create job family', async () => {
    await createJobFamilyDialog.clickOnSubmitButton();
    await waitUntil(() => createJobFamilyDialog.isDisplayed(), true);

    expect(await myFamiliesPage.getJobFamilyId(jobFamilyName)).toBeTruthy();
  });
});
