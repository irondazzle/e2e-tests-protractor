import { $, browser, ElementFinder } from 'protractor';

import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';
import { ProficiencyScaleLevelType } from '@app/models';

import { clickOnElement, isDisplayed, scrollIntoView } from '@e2e/helpers/common-helper';
import { randomArray, randomNumber, randomText } from '@e2e/helpers/random-helper';

export class EditProficiencyScalePage {
  private readonly $container = $('ig-edit-proficiency-scale');
  private readonly $definitionModeControl = this.$container.$('ig-definition-mode-control');

  async clickOnDefinitionModeControl() {
    await clickOnElement(this.$definitionModeControl);
  }

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  async fillPS(mode: ProficiencyScaleDefinitionMode = ProficiencyScaleDefinitionMode.Basic) {
    const requirements = {
      [ProficiencyScaleLevelType.Qualified]: randomArray(5, 8, () => randomText(randomNumber(2, 8))),
      [ProficiencyScaleLevelType.UpperQualified]: randomArray(3, 7, () => randomText(randomNumber(1, 7))),
      [ProficiencyScaleLevelType.Competent]: randomArray(2, 5,() => randomText(randomNumber(3, 9))),
      [ProficiencyScaleLevelType.UpperCompetent]: randomArray(4, 6, () => randomText(randomNumber(4, 6))),
      [ProficiencyScaleLevelType.Expert]: randomArray(2, 5, () => randomText(randomNumber(2, 4)))
    }

    await this.fillRequirements(ProficiencyScaleLevelType.Qualified, requirements[ProficiencyScaleLevelType.Qualified]);
    await this.fillRequirements(ProficiencyScaleLevelType.Competent, requirements[ProficiencyScaleLevelType.Competent]);
    await this.fillRequirements(ProficiencyScaleLevelType.Expert, requirements[ProficiencyScaleLevelType.Expert]);

    if (mode === ProficiencyScaleDefinitionMode.Extended) {
      await this.fillRequirements(ProficiencyScaleLevelType.UpperQualified, requirements[ProficiencyScaleLevelType.UpperQualified]);
      await this.fillRequirements(ProficiencyScaleLevelType.UpperCompetent, requirements[ProficiencyScaleLevelType.UpperCompetent]);
    }
  }

  async fillRequirements(type: ProficiencyScaleLevelType, requirements: string[]) {
    const $levelContainer = this.getLevelSelector(type);
    const $addField = $levelContainer.$('.add-button');
    const requirementsCount = await $levelContainer.$$('mat-form-field').count();
    const timesToClick = requirements.length - requirementsCount;

    if (timesToClick > 0) {
      for (let i = 0; i < timesToClick; i++) {
        await browser.actions().mouseMove($levelContainer);

        await scrollIntoView($addField);
        await $addField.click();
      }
    }

    for (let i = 0; i < requirements.length; i++) {
      const $requirement = $levelContainer.$$('mat-form-field').get(i).$('textarea');

      await scrollIntoView($requirement);
      await $requirement.click();
      await $requirement.clear();
      await $requirement.sendKeys(requirements[i]);
    }
  }

  private getLevelSelector(type: ProficiencyScaleLevelType): ElementFinder {
    return $(`[e2e-id="${type}"]`);
  }

  isDefinitionModeControlDisplayed() {
    return isDisplayed(this.$definitionModeControl, { timer: true });
  }

  isDisplayed() {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  isLevelDisplayed(type: ProficiencyScaleLevelType) {
    return isDisplayed(this.getLevelSelector(type));
  }
}
