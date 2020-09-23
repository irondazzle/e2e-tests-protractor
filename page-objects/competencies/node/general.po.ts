import { $, ElementFinder, promise } from 'protractor';

import { ProficiencyScaleDefinitionMode, ProficiencyScaleLevelType } from '@app/models';

import { clickOnElement, isDisplayed, isItemPresent, waitUntil } from '@e2e/helpers/common-helper';

import { EditProficiencyScalePage } from '../edit-proficiency-scales.po';
import { MarkAsReadyDialog } from '../mark-as-ready-dialog.po';

import { CompetenciesNodePage } from './node.po';

export class CompetenciesNodeGeneralPage extends CompetenciesNodePage {
  private readonly $createChildButton: ElementFinder = $('[e2e-id="createChildButton"]');
  private readonly $describePSButton: ElementFinder = $('[e2e-id="describePSButton"]');
  private readonly $editPSButton: ElementFinder = $('[e2e-id="editPSButton"]');
  private readonly $markAsReadyButton: ElementFinder = $('[e2e-id="markAsReadyButton"]');
  private readonly $turnOffButton: ElementFinder = $('[e2e-id="turnOffButton"]');

  async clickOnCreateChildButton(): Promise<void> {
    await clickOnElement(this.$createChildButton);
  }

  async clickOnDescribePSButton(): Promise<void> {
    await clickOnElement(this.$describePSButton);
  }

  async clickOnEditPSButton(): Promise<void> {
    await clickOnElement(this.$editPSButton);
  }

  async clickOnMarkAsReadyButton(): Promise<void> {
    await clickOnElement(this.$markAsReadyButton);
  }

  async clickOnTurnOffButton(): Promise<void> {
    await clickOnElement(this.$turnOffButton);
  }

  async describePS(mode: ProficiencyScaleDefinitionMode): Promise<void> {
    const editProficiencyScalePage = new EditProficiencyScalePage();

    await this.clickOnDescribePSButton();
    await waitUntil(() => editProficiencyScalePage.isDisplayed(), false);

    await editProficiencyScalePage.fillPS(mode);

    await editProficiencyScalePage.clickOnSubmitButton();
    await waitUntil(() => editProficiencyScalePage.isDisplayed(), true);

    await waitUntil(() => this.isMarkAsReadyButtonDisplayed(), false);
    await waitUntil(() => this.isMarkAsReadyButtonEnabled(), false);
  }

  getLastModified(): promise.Promise<string> {
    return $('ig-about-competencies-node [e2e-id="lastModified"]').getAttribute('e2e-value');
  }

  getOwner(): promise.Promise<string> {
    return $('ig-about-competencies-node ig-simple-user').getText();
  }

  async getPSLevelRequirements(type: ProficiencyScaleLevelType): Promise<string[]> {
    return ((await this.getPSLevelSelector(type).$$('div.requirement').getText()) as unknown) as Array<string>;
  }

  private getPSLevelSelector(type: ProficiencyScaleLevelType): ElementFinder {
    return $(`[e2e-id="${type}"]`);
  }

  getStatus(): promise.Promise<string> {
    return $('[e2e-id="competenciesNodeStatus"] .ig-info-field-value').getText();
  }

  async markAsReady(): Promise<string> {
    const markAsReadyDialog = new MarkAsReadyDialog();
    const oldStatus: string = await this.getStatus();

    await this.clickOnMarkAsReadyButton();
    await waitUntil(() => markAsReadyDialog.isDisplayed(), false);

    await markAsReadyDialog.clickOnSubmitButton();

    await waitUntil(() => markAsReadyDialog.isDisplayed(), true);
    await waitUntil(() => this.getStatus(), oldStatus);

    return this.getStatus();
  }

  isAddRequirementsButtonDisplayed(type: ProficiencyScaleLevelType): Promise<boolean> {
    return isDisplayed(this.getPSLevelSelector(type).$('.addRequirements-button'));
  }

  isCreateChildButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$createChildButton);
  }

  isDescribePSButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$describePSButton);
  }

  isEditPSButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$editPSButton);
  }

  isMarkAsReadyButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$markAsReadyButton);
  }

  async isMarkAsReadyButtonEnabled(): Promise<boolean> {
    const disabledValue: string = await this.$markAsReadyButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }

  isPSContainerDisplayed(): Promise<boolean> {
    return isDisplayed($('ig-competencies-node-proficiency-scale'));
  }

  isPSLevelDisplayed(type: ProficiencyScaleLevelType): Promise<boolean> {
    return isDisplayed(this.getPSLevelSelector(type));
  }

  isChildCreated(name: string): Promise<boolean> {
    return isItemPresent('ig-competencies-nodes-datatable', name);
  }

  isChildrenDataTableDisplayed(): Promise<boolean> {
    return isDisplayed($('ig-competencies-nodes-datatable'));
  }

  isTurnOffButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$turnOffButton);
  }

  async isTurnOffButtonEnabled(): Promise<boolean> {
    const disabledValue: string = await this.$turnOffButton.getAttribute('disabled');

    return !JSON.parse(disabledValue || null);
  }

  async navigate(): Promise<void> {
    await this.isDisplayedAssert();
    await clickOnElement($('ig-tabs-navigation a[href$="/general"]'));
    await waitUntil(() =>  isDisplayed($('ig-general-container')), false);
  }
}
