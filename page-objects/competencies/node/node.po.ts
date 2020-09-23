import { $, ElementArrayFinder, ElementFinder, promise } from 'protractor';

import { clickOnElement, isDisplayed, scrollToTop, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem } from '@e2e/helpers/menu-helper';

import { MarkAsLegacyDialog } from '@e2e/page-objects';

export class CompetenciesNodePage {
  private readonly $container: ElementFinder = $('ig-competencies-node-container');
  private readonly $additionalActions: ElementFinder = this.$container.$('ig-additional-actions');
  private readonly $breadcrumbs: ElementFinder = this.$container.$('ig-breadcrumbs');
  private readonly $headerName: ElementFinder = this.$container.$('ig-competencies-node-name');
  private readonly $headerSuffix: ElementFinder = this.$headerName.$('span');

  async clickOnAdditionalActions(): Promise<void> {
    await clickOnElement(this.$additionalActions);
  }

  getBreadcrumbsName(): promise.Promise<string> {
    return this.$breadcrumbs.$('span').getText();
  }

  getBreadcrumbsParents(): ElementArrayFinder {
    return this.$breadcrumbs.$$('a');
  }

  getHeaderName(): promise.Promise<string> {
    return this.$headerName.getText();
  }

  getHeaderSuffixName(): promise.Promise<string> {
    return this.$headerSuffix.getText();
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
      throw new Error('You are not on Competency');
    }
  }

  isHeaderSuffixAdded(): Promise<boolean> {
    return isDisplayed(this.$headerSuffix);
  }

  async markAsLegacy(): Promise<void> {
    const markEntityAsLegacyDialog = new MarkAsLegacyDialog();

    await this.clickOnAdditionalActions();
    await clickOnMenuItem(getI18nText('markAsLegacy'));
    await waitUntil(() => markEntityAsLegacyDialog.isDisplayed(), false);
    await markEntityAsLegacyDialog.clickOnSubmitButton();
    await waitUntil(() => markEntityAsLegacyDialog.isDisplayed(), true);
    await waitUntil(() => this.isHeaderSuffixAdded(), false);
  }

  async navigateToParent(): Promise<void> {
    await scrollToTop();

    await clickOnElement(this.getBreadcrumbsParents().last());
  }
}
