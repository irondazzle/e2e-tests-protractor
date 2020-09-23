import { $ } from 'protractor';

import { BaseDialog } from '../../base-dialog.po';

export class RemoveReviewerDialog extends BaseDialog {
  constructor() {
    super($('ig-cancel-pace-feedback-request-dialog'));
  }
}
