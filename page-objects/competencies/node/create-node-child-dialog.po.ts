import { $ } from 'protractor';

import { CreateCompetenciesNodeDialog } from './create-dialog.po';

export class CreateCompetenciesNodeChildDialog extends CreateCompetenciesNodeDialog {
  constructor() {
    super($('ig-create-competencies-node-child-dialog'));
  }
}
