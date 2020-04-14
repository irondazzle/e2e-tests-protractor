import { logIn } from '@e2e/helpers/authorization-helper';
import { jobProfileAndCompetencyCoordinatorRoles } from '@e2e/helpers/users-helper';

describe('Job Profiles', () => {
  beforeAll(async () => {
    await logIn(jobProfileAndCompetencyCoordinatorRoles.liveId, jobProfileAndCompetencyCoordinatorRoles.password);
  });

  require('./job-profiles');
});
