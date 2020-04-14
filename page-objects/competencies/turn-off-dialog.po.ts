import { $ } from 'protractor';

import { clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';

export class TurnOffDialog {
  private readonly $container = $('ig-turn-competencies-node-off-dialog');

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  isDisplayed() {
    return isDisplayed(this.$container, { timer: true, withoutScroll: true });
  }
}
