import { $ } from 'protractor';

import { BaseDialog } from '../base-dialog.po';

export class TurnOffDialog  extends BaseDialog {
  constructor() {
    super($('ig-turn-competencies-node-off-dialog'));
  }
}
