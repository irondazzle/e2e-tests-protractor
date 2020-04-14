import { $, $$ } from 'protractor';

import { ProficiencyScaleDefinitionMode } from '@app/models/proficiency-scale-definition-mode.model';

import { clearTextField, clickOnElement, isDisplayed, pressEnterKey } from '@e2e/helpers/common-helper';

export class CreateCompetenciesNodeDialog {
  private readonly $container = $(this.selector);
  private readonly $firstAutoCompleteItem = $$('[role="option"]').first();
  private readonly $nameField = this.$container.$('[e2e-id="nameField"] input');
  private readonly $nameFieldError = this.$container.$('[e2e-id="nameField"] mat-error');
  private readonly $ownerField = this.$container.$('ig-users-autocomplete input');
  private readonly $ownerFieldError = this.$container.$('ig-users-autocomplete mat-error');
  private readonly $psdmBasic = this.$container.$('mat-radio-button[e2e-id="psdm-basic"]');
  private readonly $psdmExtended = this.$container.$('mat-radio-button[e2e-id="psdm-extended"]');
  private readonly $submitButton = this.$container.$('[type="submit"]');

  constructor(private readonly selector: string) {}

  async clearNameField() {
    await clearTextField(this.$nameField);
    await pressEnterKey();
  }

  async clearOwnerField() {
    await clearTextField(this.$ownerField);
    await pressEnterKey();
  }

  async clickOnSubmitButton() {
    await clickOnElement(this.$submitButton);
  }

  getNameFieldErrorText() {
    return this.$nameFieldError.getText();
  }

  getNameFieldValue() {
    return this.$nameField.getAttribute('value');
  }

  getOwnerFieldErrorText() {
    return this.$ownerFieldError.getText();
  }

  getOwnerFieldValue() {
    return this.$ownerField.getAttribute('value');
  }

  async getPSModeValue() {
    if ((await this.$psdmBasic.getAttribute('class')).includes('mat-radio-checked')) {
      return ProficiencyScaleDefinitionMode.Basic;
    }

    if ((await this.$psdmExtended.getAttribute('class')).includes('mat-radio-checked')) {
      return ProficiencyScaleDefinitionMode.Extended;
    }

    return null;
  }

  isDisplayed() {
    return isDisplayed(this.$container, { timer: true, withoutScroll: true });
  }

  isNameFieldDisplayed() {
    return isDisplayed(this.$nameField, { withoutScroll: true });
  }

  isNameFieldErrorDisplayed() {
    return isDisplayed(this.$nameFieldError, { withoutScroll: true });
  }

  isOwnerFieldDisplayed() {
    return isDisplayed(this.$ownerField, { withoutScroll: true });
  }

  isOwnerFieldErrorDisplayed() {
    return isDisplayed(this.$ownerFieldError, { withoutScroll: true });
  }

  async isSubmitButtonEnabled() {
    const disabledValue = await this.$submitButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }

  async setNameFieldValue(name: string) {
    await this.$nameField.clear();
    await this.$nameField.sendKeys(name);
  }

  async setOwnerFieldValue(name: string) {
    await this.$ownerField.clear();
    await this.$ownerField.sendKeys(name);
    await this.$firstAutoCompleteItem.click();
  }

  setPSMode(mode: ProficiencyScaleDefinitionMode) {
    if (mode === ProficiencyScaleDefinitionMode.Basic) {
      return this.$psdmBasic.click();
    }
    if (mode === ProficiencyScaleDefinitionMode.Extended) {
      return this.$psdmExtended.click();
    }
  }
}
