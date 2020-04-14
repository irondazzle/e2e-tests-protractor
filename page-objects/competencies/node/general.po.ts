import { $, ElementFinder } from 'protractor';

import { ProficiencyScaleDefinitionMode, ProficiencyScaleLevelType } from '@app/models';

import { clickOnElement, isDisplayed, isItemPresent, waitUntil } from '@e2e/helpers/common-helper';

import { EditProficiencyScalePage } from '../edit-proficiency-scales.po';
import { MarkAsReadyDialog } from '../mark-as-ready-dialog.po';

import { CompetenciesNodePage } from './node.po';

export class CompetenciesNodeGeneralPage extends CompetenciesNodePage {
  private readonly $createChildButton = $('[e2e-id="createChildButton"]');
  private readonly $describePSButton = $('[e2e-id="describePSButton"]');
  private readonly $editPSButton = $('[e2e-id="editPSButton"]');
  private readonly $markAsReadyButton = $('[e2e-id="markAsReadyButton"]');
  private readonly $turnOffButton = $('[e2e-id="turnOffButton"]');

  async clickOnCreateChildButton() {
    await clickOnElement(this.$createChildButton);
  }

  async clickOnDescribePSButton() {
    await clickOnElement(this.$describePSButton);
  }

  async clickOnEditPSButton() {
    await clickOnElement(this.$editPSButton);
  }

  async clickOnMarkAsReadyButton() {
    await clickOnElement(this.$markAsReadyButton);
  }

  async clickOnTurnOffButton() {
    await clickOnElement(this.$turnOffButton);
  }

  async describePS(mode: ProficiencyScaleDefinitionMode) {
    const editProficiencyScalePage = new EditProficiencyScalePage();

    await this.clickOnDescribePSButton();
    await waitUntil(() => editProficiencyScalePage.isDisplayed(), false);

    await editProficiencyScalePage.fillPS(mode);

    await editProficiencyScalePage.clickOnSubmitButton();
    await waitUntil(() => editProficiencyScalePage.isDisplayed(), true);

    await waitUntil(() => this.isMarkAsReadyButtonDisplayed(), false);
    await waitUntil(() => this.isMarkAsReadyButtonEnabled(), false);
  }

  getLastModified() {
    return $('ig-about-competencies-node [e2e-id="lastModified"]').getAttribute('e2e-value');
  }

  getOwner() {
    return $('ig-about-competencies-node ig-simple-user').getText();
  }

  async getPSLevelRequirements(type: ProficiencyScaleLevelType) {
    return ((await this.getPSLevelSelector(type).$$('div.requirement').getText()) as unknown) as Array<string>;
  }

  private getPSLevelSelector(type: ProficiencyScaleLevelType): ElementFinder {
    return $(`[e2e-id="${type}"]`);
  }

  getStatus() {
    return $('[e2e-id="competenciesNodeStatus"] .ig-info-field-value').getText();
  }

  async markAsReady() {
    const markAsReadyDialog = new MarkAsReadyDialog();
    const oldStatus = await this.getStatus();

    await this.clickOnMarkAsReadyButton();
    await waitUntil(() => markAsReadyDialog.isDisplayed(), false);

    await markAsReadyDialog.clickOnSubmitButton();

    await waitUntil(() => markAsReadyDialog.isDisplayed(), true);
    await waitUntil(() => this.getStatus(), oldStatus);

    return this.getStatus();
  }

  isAddRequirementsButtonDisplayed(type: ProficiencyScaleLevelType) {
    return isDisplayed(this.getPSLevelSelector(type).$('.addRequirements-button'));
  }

  isCreateChildButtonDisplayed() {
    return isDisplayed(this.$createChildButton);
  }

  isDescribePSButtonDisplayed() {
    return isDisplayed(this.$describePSButton);
  }

  isEditPSButtonDisplayed() {
    return isDisplayed(this.$editPSButton);
  }

  isMarkAsReadyButtonDisplayed() {
    return isDisplayed(this.$markAsReadyButton);
  }

  async isMarkAsReadyButtonEnabled() {
    const disabledValue = await this.$markAsReadyButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }

  isPSContainerDisplayed() {
    return isDisplayed($('ig-competencies-node-proficiency-scale'));
  }

  isPSLevelDisplayed(type: ProficiencyScaleLevelType) {
    return isDisplayed(this.getPSLevelSelector(type));
  }

  isChildCreated(name: string) {
    return isItemPresent('ig-competencies-nodes-datatable', name);
  }

  isChildrenDataTableDisplayed() {
    return isDisplayed($('ig-competencies-nodes-datatable'));
  }

  isTurnOffButtonDisplayed() {
    return isDisplayed(this.$turnOffButton);
  }

  async isTurnOffButtonEnabled() {
    const disabledValue = await this.$turnOffButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }

  async navigate() {
    await this.isDisplayedAssert();
    await clickOnElement($('ig-tabs-navigation a[href$="/general"]'));
    await waitUntil(() =>  isDisplayed($('ig-general-container')), false);
  }
}
