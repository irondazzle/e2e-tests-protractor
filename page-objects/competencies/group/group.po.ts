import { $ } from 'protractor';

import { clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';

export class CompetenciesGroupPage {
  private readonly $container = $('ig-competencies-group-container');
  private readonly $additionalActions = this.$container.$('ig-additional-actions');

  async clickOnAdditionalActions() {
    await clickOnElement(this.$additionalActions);
  }

  getBreadcrumbsName() {
    return this.$container.$('ig-breadcrumbs span').getText();
  }

  getHeaderName() {
    return this.$container.$('ig-page-title').getText();
  }

  isAdditionalActionsDisplayed() {
    return isDisplayed(this.$additionalActions, { withoutScroll: true });
  }

  isDisplayed() {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  async isDisplayedAssert() {
    const isDisplayed = await this.isDisplayed();

    if (!isDisplayed) {
      throw new Error('You are not on Group');
    }
  }
}
