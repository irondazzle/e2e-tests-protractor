import { ProficiencyScaleLevelType } from '@app/models';

import { waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem, isMenuItemDisplayed } from '@e2e/helpers/menu-helper';
import { randomArray, randomNumber, randomText } from '@e2e/helpers/random-helper';

import {
  CompetenciesGroupMapPage,
  CompetenciesNodeGeneralPage,
  EditProficiencyScalePage,
  MyCompetenciesGroupsPage
} from '@e2e/page-objects';

describe('Describe Competency proficiency scale', () => {
  const competencyGeneralPage = new CompetenciesNodeGeneralPage();
  const editProficiencyScalePage = new EditProficiencyScalePage();
  const requirements = {
    [ProficiencyScaleLevelType.Qualified]: randomArray(3, 8, () => randomText(randomNumber(2, 8))),
    [ProficiencyScaleLevelType.UpperQualified]: randomArray(3, 7, () => randomText(randomNumber(1, 7))),
    [ProficiencyScaleLevelType.Competent]: randomArray(2, 5,() => randomText(randomNumber(3, 9))),
    [ProficiencyScaleLevelType.UpperCompetent]: randomArray(4, 6, () => randomText(randomNumber(4, 6))),
    [ProficiencyScaleLevelType.Expert]: randomArray(2, 5, () => randomText(randomNumber(2, 4)))
  }
  let oldStatus: string;

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

  it('describe proficiency scale button should be displayed', async () => {
    expect(await competencyGeneralPage.isDescribePSButtonDisplayed()).toBe(true);
  });

  it('proficiency scale edit page should be displayed', async () => {
    oldStatus = await competencyGeneralPage.getStatus();

    await competencyGeneralPage.clickOnDescribePSButton();

    expect(await editProficiencyScalePage.isDisplayed()).toBe(true);
  });

  it('proficiency scale definition mode should be displayed', async () => {
    expect(await editProficiencyScalePage.isDefinitionModeControlDisplayed()).toBe(true);
  });

  it('should select the "general" definition mode', async () => {
    await editProficiencyScalePage.clickOnDefinitionModeControl();

    expect(await isMenuItemDisplayed(getI18nText('generalPSMode'))).toBe(true);

    await clickOnMenuItem(getI18nText('generalPSMode'));

    expect(await editProficiencyScalePage.isLevelDisplayed(ProficiencyScaleLevelType.Qualified))
      .toBe(true, 'Qualified is not displayed');
    expect(await editProficiencyScalePage.isLevelDisplayed(ProficiencyScaleLevelType.UpperQualified))
      .toBe(false, 'Upper Qualified is displayed');
    expect(await editProficiencyScalePage.isLevelDisplayed(ProficiencyScaleLevelType.Competent))
      .toBe(true, 'Competent is not displayed');
    expect(await editProficiencyScalePage.isLevelDisplayed(ProficiencyScaleLevelType.UpperCompetent))
      .toBe(false, 'Upper Competent is displayed');
    expect(await editProficiencyScalePage.isLevelDisplayed(ProficiencyScaleLevelType.Expert))
      .toBe(true, 'Expert is not displayed');
  });

  it('should set the qualified scale level', async () => {
    await editProficiencyScalePage.fillRequirements(ProficiencyScaleLevelType.Qualified, requirements[ProficiencyScaleLevelType.Qualified]);

    await editProficiencyScalePage.clickOnSubmitButton();

    await waitUntil(() => competencyGeneralPage.isDisplayed(), false);
    await waitUntil(() => competencyGeneralPage.getStatus(), oldStatus);

    expect(await competencyGeneralPage.isAddRequirementsButtonDisplayed(ProficiencyScaleLevelType.Competent)).toBe(true);
    expect(await competencyGeneralPage.isAddRequirementsButtonDisplayed(ProficiencyScaleLevelType.Expert)).toBe(true);
    expect(await competencyGeneralPage.getStatus()).toBe(getI18nText('DRAFT'), 'Competency status is not correct');

    const savedQualifiedRequirements = await competencyGeneralPage.getPSLevelRequirements(ProficiencyScaleLevelType.Qualified);

    expect(savedQualifiedRequirements).toEqual(requirements[ProficiencyScaleLevelType.Qualified]);
  });

  it('"mark as ready" button should be disabled', async () => {
    expect(await competencyGeneralPage.isMarkAsReadyButtonEnabled()).toBe(false);
  });

  it('should set the competent and expert scale levels', async () => {
    await competencyGeneralPage.clickOnEditPSButton();
    await waitUntil(() => editProficiencyScalePage.isDisplayed(), false);

    await editProficiencyScalePage.fillRequirements(ProficiencyScaleLevelType.Competent, requirements[ProficiencyScaleLevelType.Competent]);
    await editProficiencyScalePage.fillRequirements(ProficiencyScaleLevelType.Expert, requirements[ProficiencyScaleLevelType.Expert]);

    await editProficiencyScalePage.clickOnSubmitButton();

    await waitUntil(() => competencyGeneralPage.isDisplayed(), false);
    await waitUntil(() => competencyGeneralPage.isAddRequirementsButtonDisplayed(ProficiencyScaleLevelType.Competent), true);
    await waitUntil(() => competencyGeneralPage.isAddRequirementsButtonDisplayed(ProficiencyScaleLevelType.Expert), true);

    const savedCompetentRequirements = await competencyGeneralPage.getPSLevelRequirements(ProficiencyScaleLevelType.Competent);
    const savedExpertRequirements = await competencyGeneralPage.getPSLevelRequirements(ProficiencyScaleLevelType.Expert);

    expect(savedCompetentRequirements).toEqual(requirements[ProficiencyScaleLevelType.Competent], ProficiencyScaleLevelType.Competent);
    expect(savedExpertRequirements).toEqual(requirements[ProficiencyScaleLevelType.Expert], ProficiencyScaleLevelType.Expert);
  });

  it('"mark as ready" button should be enabled', async () => {
    expect(await competencyGeneralPage.isMarkAsReadyButtonEnabled()).toBe(true);
  });

  it('should select the "additional" definition mode', async () => {
    await competencyGeneralPage.clickOnEditPSButton();
    await waitUntil(() => editProficiencyScalePage.isDisplayed(), false);

    await editProficiencyScalePage.clickOnDefinitionModeControl();

    expect(await isMenuItemDisplayed(getI18nText('extendedPSMode'))).toBe(true);

    await clickOnMenuItem(getI18nText('extendedPSMode'));

    expect(await editProficiencyScalePage.isLevelDisplayed(ProficiencyScaleLevelType.Qualified))
      .toBe(true, 'Qualified is not displayed');
    expect(await editProficiencyScalePage.isLevelDisplayed(ProficiencyScaleLevelType.UpperQualified))
      .toBe(true, 'Upper Qualified is displayed');
    expect(await editProficiencyScalePage.isLevelDisplayed(ProficiencyScaleLevelType.Competent))
      .toBe(true, 'Competent is not displayed');
    expect(await editProficiencyScalePage.isLevelDisplayed(ProficiencyScaleLevelType.UpperCompetent))
      .toBe(true, 'Upper Competent is displayed');
    expect(await editProficiencyScalePage.isLevelDisplayed(ProficiencyScaleLevelType.Expert))
      .toBe(true, 'Expert is not displayed');
  });

  it('should set the upper qualified scale level', async () => {
    await editProficiencyScalePage.fillRequirements(
      ProficiencyScaleLevelType.UpperQualified,
      requirements[ProficiencyScaleLevelType.UpperQualified]
    );

    await editProficiencyScalePage.clickOnSubmitButton();

    await waitUntil(() => competencyGeneralPage.isDisplayed(), false);
    await waitUntil(() => competencyGeneralPage.isAddRequirementsButtonDisplayed(ProficiencyScaleLevelType.UpperCompetent), false);

    const savedUpperQualifiedRequirements = await competencyGeneralPage.getPSLevelRequirements(ProficiencyScaleLevelType.UpperQualified);

    expect(savedUpperQualifiedRequirements).toEqual(
      requirements[ProficiencyScaleLevelType.UpperQualified],
      ProficiencyScaleLevelType.UpperQualified
    );
  });

  it('"mark as ready" button should be disabled', async () => {
    expect(await competencyGeneralPage.isMarkAsReadyButtonEnabled()).toBe(false);
  });

  it('should set the upper competent scale level', async () => {
    await competencyGeneralPage.clickOnEditPSButton();
    await waitUntil(() => editProficiencyScalePage.isDisplayed(), false);

    await editProficiencyScalePage.fillRequirements(
      ProficiencyScaleLevelType.UpperCompetent,
      requirements[ProficiencyScaleLevelType.UpperCompetent]
    );

    await editProficiencyScalePage.clickOnSubmitButton();

    await waitUntil(() => competencyGeneralPage.isDisplayed(), false);
    await waitUntil(() => competencyGeneralPage.isAddRequirementsButtonDisplayed(ProficiencyScaleLevelType.UpperCompetent), true);

    const savedUpperCompetentRequirements = await competencyGeneralPage.getPSLevelRequirements(ProficiencyScaleLevelType.UpperCompetent);

    expect(savedUpperCompetentRequirements).toEqual(
      requirements[ProficiencyScaleLevelType.UpperCompetent],
      ProficiencyScaleLevelType.UpperCompetent
    );
  });

  it('"mark as ready" button should be enabled', async () => {
    expect(await competencyGeneralPage.isMarkAsReadyButtonEnabled()).toBe(true);
  });
});
