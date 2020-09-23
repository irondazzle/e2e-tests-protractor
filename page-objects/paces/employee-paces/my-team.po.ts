import { $, ElementFinder, promise } from 'protractor';

import { clickOnElement, getElementByText, isDisplayed, waitUntil } from '@e2e/helpers/common-helper';
import { getI18nText } from '@e2e/helpers/i18n-helper';

export class MyTeamPage {
  private readonly $container: ElementFinder = $('ig-employees-container');
  private readonly $pacesDatatable: ElementFinder  = this.$container.$('ig-paces-datatable');
  private readonly additionalActions: string = 'ig-additional-actions';

  async clickOnEmployee(employee: string): Promise<void> {
    await clickOnElement(this.getEmployeeSelector(employee));
  }

  async clickOnEmployeeAdditionalActions(employee: string): Promise<void> {
    await clickOnElement(this.getEmployeeSelector(employee).$(this.additionalActions));
  }

  getEmployeePaceStatus(employee: string): promise.Promise<string> {
    return this.getEmployeeSelector(employee).$('ig-pace-status span.status').getText();
  }

  private getEmployeeSelector(employee: string): ElementFinder {
    return getElementByText('tr', employee, this.$pacesDatatable);
  }

  isEmployeeAdditionalActionsDisplayed(employee: string): Promise<boolean> {
    return isDisplayed(this.getEmployeeSelector(employee).$(this.additionalActions))
  }

  isEmployeeDisplayed(employee: string): Promise<boolean> {
    return isDisplayed(this.getEmployeeSelector(employee));
  }

  isPacesDatatableDisplayed(): Promise<boolean> {
    return isDisplayed(this.$pacesDatatable);
  }

  async navigate(): Promise<void> {
    const $myTeam: ElementFinder = getElementByText('ig-sidenav-item', getI18nText('myTeam'));

    if (!await isDisplayed($myTeam)) {
      await clickOnElement(getElementByText('[e2e-id="sidenav-group-name"]', getI18nText('pace')));
      await waitUntil(() => isDisplayed($myTeam), false);
    }

    await clickOnElement($myTeam);
    await waitUntil(() => isDisplayed($('ig-employees-container')), false);
  }
}
