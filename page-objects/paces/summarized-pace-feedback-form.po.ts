import { $, $$ } from 'protractor';

import { clearTextField, clickOnElement, isDisplayed } from '@e2e/helpers/common-helper';
import { randomNumber, randomText } from '@e2e/helpers/random-helper';

export class SummarizedPaceFeedbackFormPage {
  private readonly $container = $('ig-summarized-pace-feedback-form');
  private readonly $comment = this.$container.$('ig-comment-control');
  private readonly $commentField = this.$comment.$('textarea');
  private readonly $managerQuestionGroups = this.$container.$$('ig-manager-pace-question-group');
  private readonly $paceScoreGroup = this.$managerQuestionGroups.get(1);
  private readonly $performanceEvaluationGroup = this.$managerQuestionGroups.get(0);
  private readonly $questionGroups = this.$container.$$('ig-summarized-pace-question-group');

  async clickOnSubmitButton() {
    await clickOnElement(this.$container.$('[type="submit"]'));
  }

  getComment() {
    return this.$commentField.getAttribute('value');
  }

  async getQuestionAnswers() {
    const $questionAnswers = $$('ig-summarized-pace-question mat-select[formcontrolname="answerOptionId"] div.mat-select-value');
    const questionAnswers = ((await $questionAnswers.getText()) as unknown) as Array<string>;

    questionAnswers.push(await this.getPerformanceEvaluation());

    return questionAnswers.join('~');
  }

  getPaceScore() {
    return this.$paceScoreGroup.$('mat-select[formcontrolname="answerOptionId"] div.mat-select-value').getText();
  }

  private getPerformanceEvaluation() {
    return this.$performanceEvaluationGroup.$('mat-select[formcontrolname="answerOptionId"] div.mat-select-value').getText();
  }

  async getSuggestedPaceScore() {
    const possibleGeneralAnswers = ['Exceeds expectations', 'Meets expectations', 'Below expectations', 'Doesn\'t meet expectations'];
    const possibleNPSAnswers = ['Definitely yes!', 'Yes, if no other options', 'I\'d better choose another teammate', 'Definitely no!'];
    let answerValue: number = 0;
    let paceScore: number = 0;
    let value: number = 0;

    for (const questionGroup of await this.$questionGroups) {
      const $questions = questionGroup.$$('ig-summarized-pace-question');
      const questionsCount = await $questions.count();
      const questionTitle = await questionGroup.getAttribute('e2e-id');
      let questionGroupAnswerTotal: number = 0;

      if (questionTitle === 'Soft Skills' || questionTitle === 'Tech Skills') {
        value = 0.25;
      }

      if (questionTitle === 'Net Promoter Score') {
        value = 0.1;
      }

      for (const question of await $questions) {
        const answerText = await question.$('mat-select[formcontrolname="answerOptionId"] div.mat-select-value').getText();

        if (questionTitle === 'Net Promoter Score') {
          answerValue = possibleNPSAnswers.findIndex(answer => answer === answerText) + 1;
        } else {
          answerValue = possibleGeneralAnswers.findIndex(answer => answer === answerText) + 1;
        }

        questionGroupAnswerTotal += answerValue;
      }

      const questionGroupScore = Math.round(questionGroupAnswerTotal / questionsCount) * value;

      paceScore += questionGroupScore;
    }

    const performanceEvaluationAnswerText = await this.getPerformanceEvaluation();

    answerValue = possibleGeneralAnswers.findIndex(answer => answer === performanceEvaluationAnswerText) + 1;

    const performanceEvaluationScore = answerValue * 0.4;

    paceScore += performanceEvaluationScore;

    return possibleGeneralAnswers[Math.round(paceScore) - 1];
  }

  getSummarizedPaceScore() {
    return this.$paceScoreGroup.$('div.answer').getText();
  }

  isDisplayed() {
    return isDisplayed(this.$container);
  }

  isFeedbackCommentDisplayed() {
    return isDisplayed(this.$comment);
  }

  async setComment() {
    const comment = randomText(randomNumber(10, 50));

    await this.$commentField.click();
    await clearTextField(this.$commentField);
    await this.$commentField.sendKeys(comment);

    return comment;
  }

  async setQuestionAnswers(answerIndex: number) {
    const questionAnswers = [];
    const questions = await $$('ig-summarized-pace-question');

    for (const question of questions) {
      await clickOnElement(question.$('mat-select'));
      await clickOnElement($$('mat-option').get(answerIndex));

      questionAnswers.push(await question.$('mat-select[formcontrolname="answerOptionId"] div.mat-select-value').getText())
    }

    await clickOnElement(this.$performanceEvaluationGroup.$('mat-select'));
    await clickOnElement($$('mat-option').get(answerIndex));

    questionAnswers.push(await this.getPerformanceEvaluation());

    return questionAnswers.join('~');
  }
}
