import { $ } from 'protractor';

import { clearTextField, clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';
import { randomNumber, randomText } from '@e2e/helpers/random-helper';

export class PaceFeedbackFormPage {
  private readonly $container = $('ig-pace-feedback-form');
  private readonly $comment = this.$container.$('ig-pace-feedback-comment');
  private readonly $commentField = this.$comment.$('textarea');
  private readonly $questions = this.$container.$$('ig-pace-question');
  private readonly $saveAsDraftButton = this.$container.$('[e2e-id="saveAsDraftButton"]')

  async clickOnSaveAsDraftButton() {
    await clickOnElement(this.$saveAsDraftButton);
  }

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  getComment() {
    return this.$comment.$('ig-markdown p').getText();
  }

  private async getFeedbackCommentState() {
    if ((await this.$comment.$('ig-expansion-panel').getAttribute('class')).includes('expanded')) {
      return 'expanded';
    }

    return null;
  }

  async getQuestionAnswers() {
    const answers: string[] = [];

    for (const $question of await this.$questions) {
      answers.push(await $question.$('span.question-answer').getText());
    }

    return answers.join('~');
  }

  isDisplayed() {
    return isDisplayed(this.$container);
  }

  isFeedbackCommentDisplayed() {
    return isDisplayed(this.$comment);
  }

  isSaveAsDraftButtonDisplayed() {
    return isDisplayed(this.$saveAsDraftButton);
  }

  async setFeedbackComment() {
    const comment = randomText(randomNumber(10, 50));

    if (await this.getFeedbackCommentState() !== 'expanded') {
      await this.$comment.$('span ig-expansion-button').click();
    }

    await this.$commentField.click();
    await clearTextField(this.$commentField);
    await this.$commentField.sendKeys(comment);

    return comment;
  }

  async setQuestionAnswers() {
    const answers: string[] = [];

    for (const $question of await this.$questions) {
      const $possibleAnswers = $question.$$('mat-radio-button');
      const possibleAnswersCount = await $possibleAnswers.count();
      const answerIndex = randomNumber(0, possibleAnswersCount - 1);
      const $answer = $possibleAnswers.get(answerIndex);

      await clickOnElement($answer);

      answers.push(await $answer.$('.mat-radio-label-content').getText());
    }

    return answers.join('~');
  }
}
