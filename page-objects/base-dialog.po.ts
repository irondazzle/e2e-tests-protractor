import { ElementFinder } from 'protractor';

import { clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';

export class BaseDialog {
  protected readonly $submitButton: ElementFinder = this.$container.$('[type="submit"]');

  constructor(protected readonly $container: ElementFinder) {}

  async clickOnSubmitButton(): Promise<void> {
    await clickOnElement(this.$submitButton);
  }

  isDisplayed(): Promise<boolean> {
    return isDisplayed(this.$container, { timer: true, withoutScroll: true });
  }
}
