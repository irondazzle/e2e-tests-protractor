import { $, ElementFinder, ElementArrayFinder, promise } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, scrollToTop } from '@e2e/helpers/common-helper';

export class CareerMatrixPage {
  private readonly $container: ElementFinder = $('ig-career-matrix-container');
  private readonly $breadcrumbs: ElementFinder = this.$container.$('ig-breadcrumbs');
  private readonly $jobLevels: ElementArrayFinder = this.$container.$$('[e2e-id="jobLevelName"]');

  getBreadcrumbsParents(): ElementArrayFinder {
    return this.$breadcrumbs.$$('a');
  }

  getJobLevelTitle(jobLevelIndex: number): promise.Promise<string> {
    return this.$jobLevels.get(jobLevelIndex).getText();
  }

  getJobLevelsCount(): promise.Promise<number> {
    return this.$jobLevels.count();
  }

  getPSLevelTitle(requirementTitle: string, jobLevelIndex: number): promise.Promise<string> {
    return this.getRequirementSelector(requirementTitle).$$('[e2e-id="proficiencyScaleLevel"]').get(jobLevelIndex).getText();
  }

  private getRequirementSelector(requirementTitle: string): ElementFinder {
    return getElementByText('ig-career-matrix-requirement', requirementTitle, this.$container);
  }

  isDisplayed(): Promise<boolean> {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  isRequirementDisplayed(title: string): Promise<boolean> {
    return isDisplayed(this.getRequirementSelector(title));
  }

  async navigateToParent(): Promise<void> {
    await scrollToTop();

    await clickOnElement(this.getBreadcrumbsParents().last());
  }
}
