import { $ } from 'protractor';

import { BaseDialog } from '../base-dialog.po';

export class ApprovePaceDialog extends BaseDialog {
  constructor() {
    super($('ig-approve-pace-dialog'));
  }
}
