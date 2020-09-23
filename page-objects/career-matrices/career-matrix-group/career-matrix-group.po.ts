import { $, ElementArrayFinder, ElementFinder } from 'protractor';

import { clickOnElement, getItemId, isDisplayed, scrollToTop, waitUntil } from '@e2e/helpers/common-helper';

import { CareerMatrixPage } from '../career-matrix/career-matrix.po';

export class CareerMatrixGroupPage {
  private readonly $container: ElementFinder = $('ig-career-matrix-group-container');
  private readonly $breadcrumbs: ElementFinder = this.$container.$('ig-breadcrumbs');

  getBreadcrumbsParents(): ElementArrayFinder {
    return this.$breadcrumbs.$$('a');
  }

  getMatrixId(title: string): Promise<string> {
    return getItemId('ig-entities-card-tile > a[href*="/matrix/"]', title);
  }

  isDisplayed(): Promise<boolean> {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  async navigateToMatrix(id: string): Promise<void> {
    const careerMatrixPage = new CareerMatrixPage();

    await clickOnElement($(`[href$="/matrix/${id}"]`));
    await waitUntil(() => careerMatrixPage.isDisplayed(), false);
  }

  async navigateToParent(): Promise<void> {
    await scrollToTop();

    await clickOnElement(this.getBreadcrumbsParents().last());
  }
}
