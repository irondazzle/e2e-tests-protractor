import { $ } from 'protractor';

import { BaseDialog } from '../base-dialog.po';

export class PresentPaceSummaryDialog extends BaseDialog {
  constructor() {
    super($('ig-present-pace-summary-dialog'));
  }
}
