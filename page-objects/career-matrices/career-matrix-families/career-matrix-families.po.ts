import { $ } from 'protractor';

import {
  clickOnElement,
  getElementByText,
  getItemId,
  isDisplayed,
  waitUntil
} from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { CareerMatrixFamilyPage } from '../career-matrix-family/career-matrix-family.po';

export class CareerMatrixFamiliesPage {
  getFamilyId(title: string): Promise<string> {
    return getItemId('ig-item-tile > a[href*="/family/"]', title);
  }

  isFamilyDisplayed(title: string): Promise<boolean> {
    return isDisplayed(getElementByText('ig-item-tile div', title));
  }

  async navigate(): Promise<void> {
    await clickOnElement(getElementByText('ig-sidenav-item a', getI18nText('careerMatrices')));
    await waitUntil(() => isDisplayed($('ig-career-matrix-families-container')), false);
  }

  async navigateToFamily(id: string): Promise<void> {
    const careerMatrixFamilyPage = new CareerMatrixFamilyPage();

    await clickOnElement($(`[href$="/family/${id}"]`));
    await waitUntil(() => careerMatrixFamilyPage.isDisplayed(), false);
  }
}
