import { $ } from 'protractor';

import {
  clickOnElement,
  getElementByText,
  getItemId,
  isDisplayed,
  scrollToTop,
  waitUntil
} from '@e2e/helpers/common-helper';

import { CareerMatrixPage } from '../career-matrix/career-matrix.po';
import { CareerMatrixGroupPage } from '../career-matrix-group/career-matrix-group.po';

export class CareerMatrixFamilyPage {
  private readonly $container = $('ig-career-matrix-family-container');
  private readonly $breadcrumbs = this.$container.$('ig-breadcrumbs');

  getBreadcrumbsParents() {
    return this.$breadcrumbs.$$('a');
  }

  getGroupId(title: string) {
    return getItemId('ig-entities-card-tile > a[href*="/group/"]', title);
  }

  getMatrixId(title: string) {
    return getItemId('ig-entities-card-tile > a[href*="/matrix/"]', title);
  }

  isDisplayed() {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  isGroupDisplayed(title: string) {
    return isDisplayed(getElementByText('ig-entities-card-tile span', title));
  }

  isMatrixDisplayed(title: string) {
    return isDisplayed(getElementByText('ig-entities-card-tile span', title));
  }

  async navigateToGroup(id: string) {
    const careerMatrixGroupPage = new CareerMatrixGroupPage();

    await clickOnElement($(`[href$="/group/${id}"]`));
    await waitUntil(() => careerMatrixGroupPage.isDisplayed(), false);
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
