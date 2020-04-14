import { $ } from 'protractor';

import { clickOnElement, getItemId, isDisplayed, scrollToTop, waitUntil } from '@e2e/helpers/common-helper';

import { CareerMatrixPage } from '../career-matrix/career-matrix.po';

export class CareerMatrixGroupPage {
  private readonly $container = $('ig-career-matrix-group-container');
  private readonly $breadcrumbs = this.$container.$('ig-breadcrumbs');

  getBreadcrumbsParents() {
    return this.$breadcrumbs.$$('a');
  }

  getMatrixId(title: string) {
    return getItemId('ig-entities-card-tile > a[href*="/matrix/"]', title);
  }

  isDisplayed() {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  async navigateToMatrix(id: string) {
    const careerMatrixPage = new CareerMatrixPage();

    await clickOnElement($(`[href$="/matrix/${id}"]`));
    await waitUntil(() => careerMatrixPage.isDisplayed(), false);
  }

  async navigateToParent() {
    await scrollToTop();

    await clickOnElement(this.getBreadcrumbsParents().last());
  }
}
