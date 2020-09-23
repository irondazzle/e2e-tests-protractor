import { $ } from 'protractor';

import { BaseDialog } from '../base-dialog.po';

export class CompletePaceDialog extends BaseDialog {
  constructor() {
    super($('ig-complete-pace-dialog'));
  }
}
