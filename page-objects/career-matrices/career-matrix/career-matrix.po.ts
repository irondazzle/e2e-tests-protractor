import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, scrollToTop } from '@e2e/helpers/common-helper';

export class CareerMatrixPage {
  private readonly $container = $('ig-career-matrix-container');
  private readonly $breadcrumbs = this.$container.$('ig-breadcrumbs');
  private readonly $jobLevels = this.$container.$$('[e2e-id="jobLevelName"]');

  getBreadcrumbsParents() {
    return this.$breadcrumbs.$$('a');
  }

  getJobLevelTitle(jobLevelIndex: number) {
    return this.$jobLevels.get(jobLevelIndex).getText();
  }

  getJobLevelsCount() {
    return this.$jobLevels.count();
  }

  getPSLevelTitle(requirementTitle: string, jobLevelIndex: number) {
    return this.getRequirementSelector(requirementTitle).$$('[e2e-id="proficiencyScaleLevel"]').get(jobLevelIndex).getText();
  }

  private getRequirementSelector(requirementTitle: string) {
    return getElementByText('ig-career-matrix-requirement', requirementTitle, this.$container);
  }

  isDisplayed() {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  isRequirementDisplayed(title: string) {
    return isDisplayed(this.getRequirementSelector(title));
  }

  async navigateToParent() {
    await scrollToTop();

    await clickOnElement(this.getBreadcrumbsParents().last());
  }
}
