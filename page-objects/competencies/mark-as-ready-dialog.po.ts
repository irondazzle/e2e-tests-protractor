import { $ } from 'protractor';

import { BaseDialog } from '../base-dialog.po';

export class MarkAsReadyDialog extends BaseDialog {
  constructor() {
    super($('ig-mark-competencies-node-as-ready-dialog'));
  }
}
