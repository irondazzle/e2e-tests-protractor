import { $ } from 'protractor';

import { clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';

export class PresentPaceSummaryDialog {
  private readonly $container = $('ig-present-pace-summary-dialog');

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  isDisplayed() {
    return isDisplayed(this.$container, { timer: true, withoutScroll: true });
  }
}
