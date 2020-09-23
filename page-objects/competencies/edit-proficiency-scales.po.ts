import { $, browser, ElementFinder } from 'protractor';

import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';
import { ProficiencyScaleLevelType } from '@app/models';

import { clickOnElement, isDisplayed, scrollIntoView } from '@e2e/helpers/common-helper';
import { randomArray, randomNumber, randomText } from '@e2e/helpers/random-helper';

export class EditProficiencyScalePage {
  private readonly $container: ElementFinder = $('ig-edit-proficiency-scale');
  private readonly $definitionModeControl: ElementFinder = this.$container.$('ig-definition-mode-control');

  async clickOnDefinitionModeControl(): Promise<void> {
    await clickOnElement(this.$definitionModeControl);
  }

  async clickOnSubmitButton(): Promise<void> {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  async fillPS(mode: ProficiencyScaleDefinitionMode = ProficiencyScaleDefinitionMode.Basic): Promise<void> {
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

  async fillRequirements(type: ProficiencyScaleLevelType, requirements: string[]): Promise<void> {
    const $levelContainer: ElementFinder = this.getLevelSelector(type);
    const $addField: ElementFinder = $levelContainer.$('.add-button');
    const requirementsCount: number = await $levelContainer.$$('mat-form-field').count();
    const timesToClick: number = requirements.length - requirementsCount;

    if (timesToClick > 0) {
      for (let i = 0; i < timesToClick; i++) {
        await browser.actions().mouseMove($levelContainer);

        await scrollIntoView($addField);
        await $addField.click();
      }
    }

    for (let i = 0; i < requirements.length; i++) {
      const $requirement: ElementFinder = $levelContainer.$$('mat-form-field').get(i).$('textarea');

      await scrollIntoView($requirement);
      await $requirement.click();
      await $requirement.clear();
      await $requirement.sendKeys(requirements[i]);
    }
  }

  private getLevelSelector(type: ProficiencyScaleLevelType): ElementFinder {
    return $(`[e2e-id="${type}"]`);
  }

  isDefinitionModeControlDisplayed(): Promise<boolean> {
    return isDisplayed(this.$definitionModeControl, { timer: true });
  }

  isDisplayed(): Promise<boolean> {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  isLevelDisplayed(type: ProficiencyScaleLevelType): Promise<boolean> {
    return isDisplayed(this.getLevelSelector(type));
  }
}
