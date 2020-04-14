import { logIn, logOut } from '@e2e/helpers/authorization-helper';
import { employeeRole, managerRole, reviewerRole } from '@e2e/helpers/users-helper';

describe('PACE', () => {
  describe('Employee role', () => {
    beforeAll(async () => {
      await logIn(employeeRole.liveId, employeeRole.password);
    });

    require('./add-reviewer-for-employee.e2e');
    require('./remove-reviewer-for-employee.e2e');
    require('./submit-pace-for-employee.e2e');
  });

  describe('Manager role', () => {
    beforeAll(async () => {
      await logOut();
      await logIn(managerRole.liveId, managerRole.password);
    });

    require('./change-reviewers-for-manager.e2e');
    require('./approve-pace-for-manager.e2e');
  });

  describe('Employee role', () => {
    beforeAll(async () => {
      await logOut();
      await logIn(employeeRole.liveId, employeeRole.password);
    });

    require('./give-feedback-for-employee.e2e');
  });

  describe('Reviewer role', () => {
    beforeAll(async () => {
      await logOut();
      await logIn(reviewerRole.liveId, reviewerRole.password);
    });

    require('./give-feedback-for-reviewer.e2e');
  });

  describe('Manager role', () => {
    beforeAll(async () => {
      await logOut();
      await logIn(managerRole.liveId, managerRole.password);
    });

    require('./summarize-pace-for-manager.e2e');
    require('./annotate-pace-feedback-for-manager.e2e');
    require('./summarize-pace-feedback-for-manager.e2e');
    require('./present-pace-summary-for-manager.e2e');
    require('./complete-pace-for-manager.e2e');
  });
});
