import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

import { CompetenciesGroupPage } from '../group';

import { CompetenciesGroupsPage } from './groups.po';

export class OtherCompetenciesGroupsPage extends CompetenciesGroupsPage {
  async navigate(): Promise<void> {
    await super.navigate();

    await clickOnElement(getElementByText('ig-tabs-navigation a', getI18nText('otherGroups')));
    await waitUntil(() => isDisplayed($('ig-other-competencies-groups-container')), false);
  }

  async navigateToCompetencyGroup(id: string): Promise<void> {
    const groupPage = new CompetenciesGroupPage();

    await clickOnElement($(`[href$="/group/${id}"]`));
    await waitUntil(() => groupPage.isDisplayed(), false);
  }
}
