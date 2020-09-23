import {
  $,
  ElementFinder,
  browser,
  by,
  element,
  promise,
  protractor
} from 'protractor';
import * as uuidv4 from 'uuid/v4';

import { randomNumber, randomText } from './random-helper';

const EC = protractor.ExpectedConditions;

export async function clearTextField($field: ElementFinder): Promise<void> {
  await $field.click();
  await pressCtrlAKeys();
  await pressDeleteKey();
}

export async function clickOnElement($element: ElementFinder): Promise<void> {
  await waitForElement($element);
  await $element.click();
}

export function generateName(): string {
  return `${uuidv4()} ${randomText(randomNumber(2, 4))}`.slice(0, 64).trim();
}

export async function getCurrentUsername(): Promise<string> {
  const $firstName: ElementFinder = $('[e2e-id="currentUserFirstName"]');
  const $lastName: ElementFinder = $('[e2e-id="currentUserLastName"]');

  await waitForElement($firstName);
  await waitForElement($lastName);

  const firstName: string = await $firstName.getText();
  const lastName: string = await $lastName.getText();

  return `${firstName} ${lastName}`;
}

export function getElementByText(selector: string, searchText: string | RegExp, parentElement?: ElementFinder): ElementFinder {
  return parentElement ? parentElement.element(by.cssContainingText(selector, searchText)) : element(by.cssContainingText(selector, searchText));
}

export async function getItemId(selector: string, name: string): Promise<string> {
  const $element: ElementFinder = getElementByText(selector, name)

  await waitForElement($element);

  return (await $element.getAttribute('href')).split('/').pop();
}

export function getLocalStorageItem(key: string): promise.Promise<string> {
  return browser.executeScript<string>(`return window.localStorage.getItem('${key}');`);
}

export async function isDisplayed($element: ElementFinder, options?: { timer?: boolean | number, withoutScroll?: boolean }): Promise<boolean> {
  options = {
    timer: false,
    withoutScroll: false,
    ...options
  };

  if (options.timer) {
    await sleep(typeof options.timer === 'boolean' ? (options.timer ? 200 : 0) : options.timer);
  }

  if (await EC.stalenessOf($element)()) {
    return false;
  }
  try {
    if (!options.withoutScroll) {
      await scrollIntoView($element);
    }
  } catch(error) {
    if (error.message.startsWith('No element found') || error.message.startsWith('stale element reference')) {
      return false;
    }

    throw error;
  }

  return EC.visibilityOf($element)();
}

export async function isItemPresent(selector: string, name: string): Promise<boolean> {
  await waitForElement(getElementByText(selector, name));

  return true;
}

export async function pressCtrlAKeys(): Promise<void> {
  await browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a')).perform();
}

export async function pressDeleteKey(): Promise<void> {
  await browser.actions().sendKeys(protractor.Key.DELETE).perform();
}

export async function pressEnterKey(): Promise<void> {
  await browser.actions().sendKeys(protractor.Key.ENTER).perform();
}

export async function pressEscKey(): Promise<void> {
  await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
}

export async function scrollIntoView(elementToScroll: ElementFinder): Promise<void> {
  await browser.executeScript('arguments[0].scrollIntoView({ block: "center", inline: "center" });', elementToScroll);
}

export async function scrollToTop(): Promise<void> {
  await browser.executeScript('document.querySelector("ig-header + perfect-scrollbar > *").scrollTo(0, 0);');
}

export function setLocalStorageItem(key: any, value: any): promise.Promise<unknown> {
  return browser.executeScript(`window.localStorage.setItem('${key}', '${value}');`);
}

export async function sleep(ms: number): Promise<unknown> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export async function waitForElement(element: ElementFinder): Promise<void> {
  await browser.wait(EC.presenceOf(element), 30000, `waitForElement.presenceOf: ${element.locator()}`);
  await scrollIntoView(element);
  await browser.wait(EC.visibilityOf(element), 30000, `waitForElement.visibilityOf: ${element.locator()}`);
}

export async function waitUntil(valueGetter: any, value: any): Promise<void> {
  await browser.wait(
    async () => (await valueGetter()) !== value,
    30000,
    `waitUntil: ${valueGetter.toString()}`
  );
}
