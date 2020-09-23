import { $, $$, ElementFinder, promise } from 'protractor';

import { clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';

export class EditEntityRequirementPage {
  private readonly $container: ElementFinder = $('ig-edit-entity-requirement');
  private readonly $coreToggle: ElementFinder = this.$container.$('ig-is-core mat-slide-toggle');

  async clickOnCoreToggle(): Promise<void> {
    await clickOnElement(this.$coreToggle);
  }

  async clickOnNextPSLevel(jobLevelIndex: number): Promise<void> {
    await clickOnElement(this.getJobLevelSelector(jobLevelIndex).$('[e2e-id="nextPSLType"]'));
  }

  async clickOnPreviousPSLevel(jobLevelIndex: number): Promise<void> {
    await clickOnElement(this.getJobLevelSelector(jobLevelIndex).$('[e2e-id="previousPSLType"]'));
  }

  async clickOnSubmitButton(): Promise<void> {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  private getJobLevelSelector(jobLevelIndex: number): ElementFinder {
    return this.$container.$$('ig-job-level-assignment').get(jobLevelIndex);
  }

  getJobLevelTitle(jobLevelIndex: number): promise.Promise<string> {
    return this.getJobLevelSelector(jobLevelIndex).getAttribute('e2e-value');
  }

  getJobLevelsCount(): promise.Promise<number> {
    return $$('ig-job-level-assignment').count();
  }

  getPSLevelTitle(jobLevelIndex: number): promise.Promise<string> {
    return this.getJobLevelSelector(jobLevelIndex).$('div.proficiency-scale-level-type span').getText();
  }

  getPSLevelTitles(): promise.Promise<string> {
    return this.$container.$$('ig-job-level-assignment div.proficiency-scale-level-type span').getText();
  }

  async isCoreRequirement(): Promise<boolean> {
    return (await this.$coreToggle.getAttribute('class')).includes('mat-checked');
  }

  isDisplayed(): Promise<boolean> {
    return isDisplayed(this.$container, { withoutScroll: true });
  }
}
