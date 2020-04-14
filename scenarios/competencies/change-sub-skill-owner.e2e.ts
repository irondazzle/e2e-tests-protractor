import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';

import {
  ChangeEntityOwnerDialog,
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  CompetenciesNodeMapPage,
  MyCompetenciesGroupsPage
} from '@e2e/page-objects';

describe('Change Sub Skill owner', () => {
  const changeEntityOwnerDialog = new ChangeEntityOwnerDialog();
  const ownerName = 'Roman Berezin';
  const subSkillGeneralPage = new CompetenciesNodeGeneralPage();

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

  it('change owner action should be displayed', async () => {
    await subSkillGeneralPage.clickOnAdditionalActions();

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

  it('should set the sub skill owner', async () => {
    await changeEntityOwnerDialog.setOwnerFieldValue(ownerName);

    expect(await changeEntityOwnerDialog.getOwnerFieldValue()).toBe(ownerName);
  });

  it('should change the sub skill owner', async () => {
    const oldSubSkillOwner = await subSkillGeneralPage.getOwner();

    await changeEntityOwnerDialog.clickOnSubmitButton();
    await waitUntil(() => changeEntityOwnerDialog.isDisplayed(), true);
    await waitUntil(() => subSkillGeneralPage.getOwner(), oldSubSkillOwner);

    expect(await subSkillGeneralPage.getOwner()).toBe(ownerName);
  });
});
