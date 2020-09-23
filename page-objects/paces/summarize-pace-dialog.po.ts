import { $ } from 'protractor';

import { BaseDialog } from '../base-dialog.po';

export class SummarizePaceDialog  extends BaseDialog {
  constructor() {
    super($('ig-summarize-pace-dialog'));
  }
}
