import { $ } from 'protractor';

import { clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';

export class MarkAsReadyDialog {
  private readonly $container = $('ig-mark-competencies-node-as-ready-dialog');

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  isDisplayed() {
    return isDisplayed(this.$container, { timer: true, withoutScroll: true });
  }
}
