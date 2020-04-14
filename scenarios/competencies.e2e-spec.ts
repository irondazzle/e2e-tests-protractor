import { logIn } from '@e2e/helpers/authorization-helper';
import { competenceCoordinatorRole } from '@e2e/helpers/users-helper';

describe('Competencies', () => {
  beforeAll(async () => {
    await logIn(competenceCoordinatorRole.liveId, competenceCoordinatorRole.password);
  });

  require('./competencies');
});
