import { $, ElementArrayFinder, ElementFinder, promise } from 'protractor';

import { clearTextField, clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';
import { randomNumber, randomText } from '@e2e/helpers/random-helper';

export class PaceFeedbackFormPage {
  private readonly $container: ElementFinder = $('ig-pace-feedback-form');
  private readonly $comment: ElementFinder = this.$container.$('ig-pace-feedback-comment');
  private readonly $commentField: ElementFinder = this.$comment.$('textarea');
  private readonly $questions: ElementArrayFinder = this.$container.$$('ig-pace-question');
  private readonly $saveAsDraftButton: ElementFinder = this.$container.$('[e2e-id="saveAsDraftButton"]')

  async clickOnSaveAsDraftButton(): Promise<void> {
    await clickOnElement(this.$saveAsDraftButton);
  }

  async clickOnSubmitButton(): Promise<void> {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  getComment(): promise.Promise<string> {
    return this.$comment.$('ig-markdown p').getText();
  }

  private async getFeedbackCommentState(): Promise<string> {
    if ((await this.$comment.$('ig-expansion-panel').getAttribute('class')).includes('expanded')) {
      return 'expanded';
    }

    return null;
  }

  async getQuestionAnswers(): Promise<string> {
    const answers: string[] = [];

    for (const $question of await this.$questions) {
      answers.push(await $question.$('span.question-answer').getText());
    }

    return answers.join('~');
  }

  isDisplayed(): Promise<boolean> {
    return isDisplayed(this.$container);
  }

  isFeedbackCommentDisplayed(): Promise<boolean> {
    return isDisplayed(this.$comment);
  }

  isSaveAsDraftButtonDisplayed(): Promise<boolean> {
    return isDisplayed(this.$saveAsDraftButton);
  }

  async setFeedbackComment(): Promise<string> {
    const comment: string = randomText(randomNumber(10, 50));

    if (await this.getFeedbackCommentState() !== 'expanded') {
      await this.$comment.$('span ig-expansion-button').click();
    }

    await this.$commentField.click();
    await clearTextField(this.$commentField);
    await this.$commentField.sendKeys(comment);

    return comment;
  }

  async setQuestionAnswers(): Promise<string> {
    const answers: string[] = [];

    for (const $question of await this.$questions) {
      const $possibleAnswers: ElementArrayFinder = $question.$$('mat-radio-button');
      const possibleAnswersCount: number = await $possibleAnswers.count();
      const answerIndex: number = randomNumber(0, possibleAnswersCount - 1);
      const $answer: ElementFinder = $possibleAnswers.get(answerIndex);

      await clickOnElement($answer);

      answers.push(await $answer.$('.mat-radio-label-content').getText());
    }

    return answers.join('~');
  }
}
