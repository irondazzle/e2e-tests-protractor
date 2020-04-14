import { $ } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

export class MyTeamPage {
  private readonly $container = $('ig-employees-container');
  private readonly $pacesDatatable = this.$container.$('ig-paces-datatable');
  private readonly additionalActions = 'ig-additional-actions';

  async clickOnEmployee(employee: string) {
    await clickOnElement(this.getEmployeeSelector(employee));
  }

  async clickOnEmployeeAdditionalActions(employee: string) {
    await clickOnElement(this.getEmployeeSelector(employee).$(this.additionalActions));
  }

  getEmployeePaceStatus(employee: string) {
    return this.getEmployeeSelector(employee).$('ig-pace-status span.status').getText();
  }

  private getEmployeeSelector(employee: string) {
    return getElementByText('tr', employee, this.$pacesDatatable);
  }

  isEmployeeAdditionalActionsDisplayed(employee: string) {
    return isDisplayed(this.getEmployeeSelector(employee).$(this.additionalActions))
  }

  isEmployeeDisplayed(employee: string) {
    return isDisplayed(this.getEmployeeSelector(employee));
  }

  isPacesDatatableDisplayed() {
    return isDisplayed(this.$pacesDatatable);
  }

  async navigate() {
    const $myTeam = getElementByText('ig-sidenav-item', getI18nText('myTeam'));

    if (!await isDisplayed($myTeam)) {
      await clickOnElement(getElementByText('[e2e-id="sidenav-group-name"]', getI18nText('pace')));
      await waitUntil(() => isDisplayed($myTeam), false);
    }

    await clickOnElement($myTeam);
    await waitUntil(() => isDisplayed($('ig-employees-container')), false);
  }
}
