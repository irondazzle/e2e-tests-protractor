// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const DescribeFailureReporter = require('protractor-stop-describe-on-failure');
const Reporter = require('jasmine-console-reporter');

exports.config = {
  allScriptsTimeout: 60000,
  multiCapabilities: [
    {
      browserName: 'chrome',
      chromeOptions: {
        args: ['headless', '--window-size=1920,1080']
      },
      specs: ['../e2e/scenarios/competencies.e2e-spec.ts']
    },
    {
      browserName: 'chrome',
      chromeOptions: {
        args: ['headless', '--window-size=1920,1080']
      },
      specs: ['../e2e/scenarios/job-profiles.e2e-spec.ts']
    },
    {
      browserName: 'chrome',
      chromeOptions: {
        args: ['headless', '--window-size=1920,1080']
      },
      specs: ['../e2e/scenarios/pace.e2e-spec.ts']
    }
  ],
  directConnect: true,
  SELENIUM_PROMISE_MANAGER: false,
  baseUrl: 'http://localhost:4200',
  framework: 'jasmine',
  getPageTimeout: 10000,
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 150000,
    print: function() {}
  },
  onPrepare() {
    const superDescribe = describe;
    const tsConfig = require('../e2e/tsconfig.json');

    // Need to refresh browser page after all "describe" because they can contain steps which open some overlay.
    // This overlay could not close because of step failure, thus it intercepts clicks from another "describe".
    global['describe'] = function describe(description, specDefinitions) {
      superDescribe(description, () => {
        specDefinitions();

        afterAll(async () => {
          await browser.refresh();
        });
      });
    };

    require('ts-node').register({
      project: 'e2e/tsconfig.json'
    });
    require('tsconfig-paths').register({
      project: 'e2e/tsconfig.json',
      baseUrl: 'e2e/',
      paths: tsConfig.compilerOptions.paths
    });

    jasmine.getEnv().addReporter(DescribeFailureReporter(jasmine.getEnv()));
    jasmine.getEnv().addReporter(new Reporter());
  }
};
