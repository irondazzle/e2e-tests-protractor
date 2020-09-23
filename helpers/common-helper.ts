import {
  $,
  browser,
  by,
  element,
  ElementFinder,
  protractor
} from 'protractor';
import * as uuidv4 from 'uuid/v4';

import { randomNumber, randomText } from './random-helper';

const EC = protractor.ExpectedConditions;

export async function clearTextField($field: ElementFinder) {
  await $field.click();
  await pressCtrlAKeys();
  await pressDeleteKey();
}

export async function clickOnElement($element: ElementFinder) {
  await waitForElement($element);
  await $element.click();
}

export function generateName() {
  return `${uuidv4()} ${randomText(randomNumber(2, 4))}`.slice(0, 64).trim();
}

export async function getCurrentUsername() {
  const $firstName = $('[e2e-id="currentUserFirstName"]');
  const $lastName = $('[e2e-id="currentUserLastName"]');

  await waitForElement($firstName);
  await waitForElement($lastName);

  const firstName = await $firstName.getText();
  const lastName = await $lastName.getText();

  return `${firstName} ${lastName}`;
}

export function getElementByText(selector: string, text: string, parentElement?: ElementFinder): ElementFinder {
  return parentElement ? parentElement.element(by.cssContainingText(selector, text)) : element(by.cssContainingText(selector, text));
}

export async function getItemId(selector: string, name: string) {
  const $element = getElementByText(selector, name)

  await waitForElement($element);

  return (await $element.getAttribute('href')).split('/').pop();
}

export function getLocalStorageItem(key) {
  return browser.executeScript<string>(`return window.localStorage.getItem('${key}');`);
}

export async function isDisplayed($element: ElementFinder, options?: { timer?: boolean | number, withoutScroll?: boolean }) {
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

export async function isItemPresent(selector: string, name: string) {
  await waitForElement(getElementByText(selector, name));

  return true;
}

export async function pressCtrlAKeys() {
  await browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a')).perform();
}

export async function pressDeleteKey() {
  await browser.actions().sendKeys(protractor.Key.DELETE).perform();
}

export async function pressEnterKey() {
  await browser.actions().sendKeys(protractor.Key.ENTER).perform();
}

export async function pressEscKey() {
  await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
}

export async function scrollIntoView(elementToScroll: ElementFinder) {
  await browser.executeScript('arguments[0].scrollIntoView({ block: "center", inline: "center" });', elementToScroll);
}

export async function scrollToTop() {
  await browser.executeScript('document.querySelector("ig-header + perfect-scrollbar > *").scrollTo(0, 0);');
}

export function setLocalStorageItem(key, value) {
  return browser.executeScript(`window.localStorage.setItem('${key}', '${value}');`);
}

export async function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export async function waitForElement(element) {
  await browser.wait(EC.presenceOf(element), 30000, `waitForElement.presenceOf: ${element.locator()}`);
  await scrollIntoView(element);
  await browser.wait(EC.visibilityOf(element), 30000, `waitForElement.visibilityOf: ${element.locator()}`);
}

export async function waitUntil(valueGetter, value) {
  await browser.wait(
    async () => (await valueGetter()) !== value,
    30000,
    `waitUntil: ${valueGetter.toString()}`
  );
}
