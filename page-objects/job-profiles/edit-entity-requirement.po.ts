import { $, $$ } from 'protractor';

import { clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';

export class EditEntityRequirementPage {
  private readonly $container = $('ig-edit-entity-requirement');
  private readonly $coreToggle = this.$container.$('ig-is-core mat-slide-toggle');

  async clickOnCoreToggle() {
    await clickOnElement(this.$coreToggle);
  }

  async clickOnNextPSLevel(jobLevelIndex: number) {
    await clickOnElement(this.getJobLevelSelector(jobLevelIndex).$('[e2e-id="nextPSLType"]'));
  }

  async clickOnPreviousPSLevel(jobLevelIndex: number) {
    await clickOnElement(this.getJobLevelSelector(jobLevelIndex).$('[e2e-id="previousPSLType"]'));
  }

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  private getJobLevelSelector(jobLevelIndex: number) {
    return this.$container.$$('ig-job-level-assignment').get(jobLevelIndex);
  }

  getJobLevelTitle(jobLevelIndex: number) {
    return this.getJobLevelSelector(jobLevelIndex).getAttribute('e2e-value');
  }

  getJobLevelsCount() {
    return $$('ig-job-level-assignment').count();
  }

  getPSLevelTitle(jobLevelIndex: number) {
    return this.getJobLevelSelector(jobLevelIndex).$('div.proficiency-scale-level-type span').getText();
  }

  getPSLevelTitles() {
    return this.$container.$$('ig-job-level-assignment div.proficiency-scale-level-type span').getText();
  }

  async isCoreRequirement() {
    return (await this.$coreToggle.getAttribute('class')).includes('mat-checked');
  }

  isDisplayed() {
    return isDisplayed(this.$container, { withoutScroll: true });
  }
}
