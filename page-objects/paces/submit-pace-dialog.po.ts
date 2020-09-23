import { $ } from 'protractor';

import { BaseDialog } from '../base-dialog.po';

export class SubmitPaceDialog extends BaseDialog {
  constructor() {
    super($('ig-submit-pace-dialog'));
  }
}
