import { $, ElementFinder, promise } from 'protractor';

import { clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';

export class JobProfileGroupPage {
  private readonly $container: ElementFinder = $('ig-job-profile-group-container');
  private readonly $additionalActions: ElementFinder = this.$container.$('ig-additional-actions');

  async clickOnAdditionalActions(): Promise<void> {
    await clickOnElement(this.$additionalActions);
  }

  getBreadcrumbsName(): promise.Promise<string> {
    return this.$container.$('ig-breadcrumbs span').getText();
  }

  getHeaderName(): promise.Promise<string> {
    return this.$container.$('ig-page-title').getText();
  }

  isAdditionalActionsDisplayed(): Promise<boolean> {
    return isDisplayed(this.$additionalActions, { withoutScroll: true });
  }

  isDisplayed(): Promise<boolean> {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  async isDisplayedAssert(): Promise<void> {
    const isDisplayed: boolean = await this.isDisplayed();

    if (!isDisplayed) {
      throw new Error('You are not on Job Profile Group');
    }
  }
}
