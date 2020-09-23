import { $ } from 'protractor';

import { BaseDialog } from '../../base-dialog.po';

export class UpdateCareerMatrixDialog extends BaseDialog {
  constructor() {
    super($('ig-update-career-matrix-dialog'));
  }
}
