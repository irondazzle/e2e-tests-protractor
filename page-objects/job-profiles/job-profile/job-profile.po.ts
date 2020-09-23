import { $, ElementFinder, promise } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { UpdateCareerMatrixDialog } from './update-career-matrix-dialog.po';

export class JobProfilePage {
  private readonly $container: ElementFinder = $('ig-job-profile-container');
  private readonly $additionalActions: ElementFinder = this.$container.$('ig-additional-actions');

  async clickOnAdditionalActions(): Promise<void> {
    await clickOnElement(this.$additionalActions);
  }

  async clickOnCreateCareerMatrixButton(): Promise<void> {
    await clickOnElement(this.getCareerMatrixButtonSelector(getI18nText('createMatrix')));
  }

  async clickOnReloadCareerMatrixButton(): Promise<void> {
    await clickOnElement(this.getCareerMatrixButtonSelector(getI18nText('reloadMatrix')));
  }

  getBreadcrumbsName(): promise.Promise<string> {
    return this.$container.$('ig-breadcrumbs span').getText();
  }

  private getCareerMatrixButtonSelector(title: string): ElementFinder {
    return getElementByText('[e2e-id="updateMatrixButton"]', title, this.$container);
  }

  getHeaderName(): promise.Promise<string> {
    return this.$container.$('ig-page-title').getText();
  }

  isAdditionalActionsDisplayed(): Promise<boolean> {
    return isDisplayed(this.$additionalActions, { withoutScroll: true });
  }

  isCreateCareerMatrixButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.getCareerMatrixButtonSelector(getI18nText('createMatrix')), { withoutScroll: true });
  }

  isDisplayed(): Promise<boolean> {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  isReloadCareerMatrixButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.getCareerMatrixButtonSelector(getI18nText('reloadMatrix')), { withoutScroll: true });
  }

  async isDisplayedAssert(): Promise<void> {
    const isDisplayed: boolean = await this.isDisplayed();

    if (!isDisplayed) {
      throw new Error('You are not on Job Profile');
    }
  }

  async updateCareerMatrix(): Promise<void> {
    const isCreateFlow = await this.isCreateCareerMatrixButtonDisplayed();
    const updateCareerMatrixDialog = new UpdateCareerMatrixDialog();

    if (isCreateFlow) {
      await this.clickOnCreateCareerMatrixButton();
    } else {
      await this.clickOnReloadCareerMatrixButton();
    }

    await waitUntil(() => updateCareerMatrixDialog.isDisplayed(), false);

    await updateCareerMatrixDialog.clickOnSubmitButton();
    await waitUntil(() => updateCareerMatrixDialog.isDisplayed(), true);

    if (isCreateFlow) {
      await waitUntil(() => this.isCreateCareerMatrixButtonDisplayed(), true);
    }
  }
}
