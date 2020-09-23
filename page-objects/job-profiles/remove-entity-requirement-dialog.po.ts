import { $ } from 'protractor';

import { BaseDialog } from '../base-dialog.po';

export class RemoveEntityRequirementDialog extends BaseDialog {
  constructor() {
    super($('ig-remove-entity-requirement-dialog'));
  }
}
