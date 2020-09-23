import { $ } from 'protractor';

import { BaseDialog } from '../base-dialog.po';

export class MarkAsLegacyDialog extends BaseDialog {
  constructor() {
    super($('ig-mark-competencies-node-as-legacy-dialog'));
  }
}
