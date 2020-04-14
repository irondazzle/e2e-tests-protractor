import { $ } from 'protractor';

import { clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';

export class AlertDialog {
  private readonly $container = $('ig-alert');

  async clickOnOkButton() {
    await clickOnElement(this.$container.$('button'));
  }

  isDisplayed() {
    return isDisplayed(this.$container, { timer: true, withoutScroll: true });
  }
}
