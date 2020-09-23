import { $, ElementArrayFinder, ElementFinder } from 'protractor';

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
  private readonly $container: ElementFinder = $('ig-career-matrix-family-container');
  private readonly $breadcrumbs: ElementFinder = this.$container.$('ig-breadcrumbs');

  getBreadcrumbsParents(): ElementArrayFinder {
    return this.$breadcrumbs.$$('a');
  }

  getGroupId(title: string): Promise<string> {
    return getItemId('ig-entities-card-tile > a[href*="/group/"]', title);
  }

  getMatrixId(title: string): Promise<string> {
    return getItemId('ig-entities-card-tile > a[href*="/matrix/"]', title);
  }

  isDisplayed(): Promise<boolean> {
    return isDisplayed(this.$container, { withoutScroll: true });
  }

  isGroupDisplayed(title: string): Promise<boolean> {
    return isDisplayed(getElementByText('ig-entities-card-tile span', title));
  }

  isMatrixDisplayed(title: string): Promise<boolean> {
    return isDisplayed(getElementByText('ig-entities-card-tile span', title));
  }

  async navigateToGroup(id: string): Promise<void> {
    const careerMatrixGroupPage = new CareerMatrixGroupPage();

    await clickOnElement($(`[href$="/group/${id}"]`));
    await waitUntil(() => careerMatrixGroupPage.isDisplayed(), false);
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
