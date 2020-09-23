import { $ } from 'protractor';

import { CreateCompetenciesNodeDialog } from './create-dialog.po';

export class CreateCompetenciesGroupChildDialog extends CreateCompetenciesNodeDialog {
  constructor() {
    super($('ig-create-competencies-group-child-dialog'));
  }
}
