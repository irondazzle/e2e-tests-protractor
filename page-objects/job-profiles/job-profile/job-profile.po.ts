import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { UpdateCareerMatrixDialog } from './update-career-matrix-dialog.po';

export class JobProfilePage {
  private readonly $container = $('ig-job-profile-container');
  private readonly $additionalActions = this.$container.$('ig-additional-actions');

  async clickOnAdditionalActions() {
    await clickOnElement(this.$additionalActions);
  }

  async clickOnCreateCareerMatrixButton() {
    await clickOnElement(this.getCareerMatrixButtonSelector(getI18nText('createMatrix')));
  }

  async clickOnReloadCareerMatrixButton() {
    await clickOnElement(this.getCareerMatrixButtonSelector(getI18nText('reloadMatrix')));
  }

  getBreadcrumbsName() {
    return this.$container.$('ig-breadcrumbs span').getText();
  }

  private getCareerMatrixButtonSelector(title: string) {
    return getElementByText('[e2e-id="updateMatrixButton"]', title, this.$container);
  }

  getHeaderName() {
    return this.$container.$('ig-page-title').getText();
  }

  isAdditionalActionsDisplayed() {
    return isDisplayed(this.$additionalActions, { withoutScroll: true });
  }

  isCreateCareerMatrixButtonDisplayed() {
    return isDisplayed(this.getCareerMatrixButtonSelector(getI18nText('createMatrix')), { withoutScroll: true });
  }

  isDisplayed() {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  isReloadCareerMatrixButtonDisplayed() {
    return isDisplayed(this.getCareerMatrixButtonSelector(getI18nText('reloadMatrix')), { withoutScroll: true });
  }

  async isDisplayedAssert() {
    const isDisplayed = await this.isDisplayed();

    if (!isDisplayed) {
      throw new Error('You are not on Job Profile');
    }
  }

  async updateCareerMatrix() {
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
