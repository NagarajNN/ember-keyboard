import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { touchStart } from 'ember-keyboard/test-support/test-helpers';

import { textChanged } from '../../helpers/text-changed';

module('Acceptance | ember keyboard | deprecated | touch', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    await visit('/test-scenario/deprecated/touch');
  });

  module('start touching', function () {
    test('increases the touch counter once', async function (assert) {
      assert.expect(2);

      await textChanged(assert, () => touchStart(), {
        selectorName: 'touch-start-counter',
        beforeValue: '0',
        afterValue: '1',
      });
    });

    test('increases the touch counter twice', async function (assert) {
      assert.expect(2);

      await textChanged(assert, () => touchStart() && touchStart(), {
        selectorName: 'touch-start-counter',
        beforeValue: '0',
        afterValue: '2',
      });
    });
  });
});
