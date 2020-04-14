import { $ } from 'protractor';

import { clickOnElement, isDisplayed, scrollToTop, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';
import { clickOnMenuItem } from '@e2e/helpers/menu-helper';

import { MarkAsLegacyDialog } from '@e2e/page-objects';

export class CompetenciesNodePage {
  private readonly $container = $('ig-competencies-node-container');
  private readonly $additionalActions = this.$container.$('ig-additional-actions');
  private readonly $breadcrumbs = this.$container.$('ig-breadcrumbs');
  private readonly $headerName = this.$container.$('ig-competencies-node-name');
  private readonly $headerSuffix = this.$headerName.$('span');

  async clickOnAdditionalActions() {
    await clickOnElement(this.$additionalActions);
  }

  getBreadcrumbsName() {
    return this.$breadcrumbs.$('span').getText();
  }

  getBreadcrumbsParents() {
    return this.$breadcrumbs.$$('a');
  }

  getHeaderName() {
    return this.$headerName.getText();
  }

  getHeaderSuffixName() {
    return this.$headerSuffix.getText();
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
      throw new Error('You are not on Competency');
    }
  }

  isHeaderSuffixAdded() {
    return isDisplayed(this.$headerSuffix);
  }

  async markAsLegacy() {
    const markEntityAsLegacyDialog = new MarkAsLegacyDialog();

    await this.clickOnAdditionalActions();
    await clickOnMenuItem(getI18nText('markAsLegacy'));
    await waitUntil(() => markEntityAsLegacyDialog.isDisplayed(), false);
    await markEntityAsLegacyDialog.clickOnSubmitButton();
    await waitUntil(() => markEntityAsLegacyDialog.isDisplayed(), true);
    await waitUntil(() => this.isHeaderSuffixAdded(), false);
  }

  async navigateToParent() {
    await scrollToTop();

    await clickOnElement(this.getBreadcrumbsParents().last());
  }
}
