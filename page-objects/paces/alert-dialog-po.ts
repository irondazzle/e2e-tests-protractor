import { $, ElementFinder } from 'protractor';

import { clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';

export class AlertDialog {
  private readonly $container: ElementFinder = $('ig-alert');

  async clickOnOkButton(): Promise<void> {
    await clickOnElement(this.$container.$('button'));
  }

  isDisplayed(): Promise<boolean> {
    return isDisplayed(this.$container, { timer: true, withoutScroll: true });
  }
}
