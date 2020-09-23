import { $, $$, ElementFinder, promise } from 'protractor';

import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { clearTextField, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

import { BaseDialog } from '../../base-dialog.po';

export class CreateCompetenciesNodeDialog extends BaseDialog {
  private readonly $firstAutoCompleteItem: ElementFinder = $$('[role="option"]').first();
  private readonly $nameField: ElementFinder = this.$container.$('[e2e-id="nameField"] input');
  private readonly $nameFieldError: ElementFinder = this.$container.$('[e2e-id="nameField"] mat-error');
  private readonly $ownerField: ElementFinder = this.$container.$('ig-users-autocomplete input');
  private readonly $ownerFieldError: ElementFinder = this.$container.$('ig-users-autocomplete mat-error');
  private readonly $psdmBasic: ElementFinder = this.$container.$('mat-radio-button[e2e-id="psdm-basic"]');
  private readonly $psdmExtended: ElementFinder = this.$container.$('mat-radio-button[e2e-id="psdm-extended"]');

  async clearNameField(): Promise<void> {
    await clearTextField(this.$nameField);
    await pressEnterKey();
  }

  async clearOwnerField(): Promise<void> {
    await clearTextField(this.$ownerField);
    await pressEnterKey();
  }

  getNameFieldErrorText(): promise.Promise<string> {
    return this.$nameFieldError.getText();
  }

  getNameFieldValue(): promise.Promise<string> {
    return this.$nameField.getAttribute('value');
  }

  getOwnerFieldErrorText(): promise.Promise<string> {
    return this.$ownerFieldError.getText();
  }

  getOwnerFieldValue(): promise.Promise<string> {
    return this.$ownerField.getAttribute('value');
  }

  async getPSModeValue(): Promise<ProficiencyScaleDefinitionMode> {
    if ((await this.$psdmBasic.getAttribute('class')).includes('mat-radio-checked')) {
      return ProficiencyScaleDefinitionMode.Basic;
    }

    if ((await this.$psdmExtended.getAttribute('class')).includes('mat-radio-checked')) {
      return ProficiencyScaleDefinitionMode.Extended;
    }

    return null;
  }

  isNameFieldDisplayed(): Promise<boolean> {
    return isDisplayed(this.$nameField, { withoutScroll: true });
  }

  isNameFieldErrorDisplayed(): Promise<boolean> {
    return isDisplayed(this.$nameFieldError, { withoutScroll: true });
  }

  isOwnerFieldDisplayed(): Promise<boolean> {
    return isDisplayed(this.$ownerField, { withoutScroll: true });
  }

  isOwnerFieldErrorDisplayed(): Promise<boolean> {
    return isDisplayed(this.$ownerFieldError, { withoutScroll: true });
  }

  async isSubmitButtonEnabled(): Promise<boolean> {
    const disabledValue = await this.$submitButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }

  async setNameFieldValue(name: string): Promise<void> {
    await this.$nameField.clear();
    await this.$nameField.sendKeys(name);
  }

  async setOwnerFieldValue(name: string): Promise<void> {
    await this.$ownerField.clear();
    await this.$ownerField.sendKeys(name);
    await this.$firstAutoCompleteItem.click();
  }

  setPSMode(mode: ProficiencyScaleDefinitionMode): promise.Promise<void> {
    if (mode === ProficiencyScaleDefinitionMode.Basic) {
      return this.$psdmBasic.click();
    }
    if (mode === ProficiencyScaleDefinitionMode.Extended) {
      return this.$psdmExtended.click();
    }
  }
}
