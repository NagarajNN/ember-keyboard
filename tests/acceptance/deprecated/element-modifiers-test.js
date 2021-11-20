import { focus, visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { gte } from 'ember-compatibility-helpers';
import { keyDown, keyPress } from 'ember-keyboard/test-support/test-helpers';
import { textChanged } from '../../helpers/text-changed';
import { registerDeprecationHandler } from '@ember/debug';

if (gte('3.8.0')) {
  module('Acceptance | ember keyboard | deprecated | element modifiers', function(hooks) {
    setupApplicationTest(hooks);

    let deprecations;
    hooks.beforeEach(async function(assert) {
      deprecations = [];
      registerDeprecationHandler((message, options, next) => {
        deprecations.push({ message, options });
        next(message, options);
      });
      await visit('/test-scenario/deprecated/element-modifiers');

      assert.equal(currentURL(), '/test-scenario/deprecated/element-modifiers');
    });

    test('issues deprecation warnings', function(assert) {
      assert.ok(deprecations.length > 0);
      let shortcutDeprecation = deprecations.filter(d => d.options.id === 'ember-keyboard.keyboard-shortcut')[0];
      assert.ok(shortcutDeprecation, 'keyboard-shortcut deprecation is triggered as expected');
      assert.equal(shortcutDeprecation.message, "The `keyboard-shortcut` modifier of ember-keyboard is deprecated. Please use the `on-key` modifier with no action instead.");
      assert.equal(shortcutDeprecation.options.id, "ember-keyboard.keyboard-shortcut");
      assert.equal(shortcutDeprecation.options.until, "7.0.0");
      assert.equal(shortcutDeprecation.options.url, "https://adopted-ember-addons.github.io/ember-keyboard/deprecations#keyboard-shortcut");
      let onKeyboardDeprecation = deprecations.filter(d => d.options.id === 'ember-keyboard.on-keyboard')[0];
      assert.ok(onKeyboardDeprecation, 'on-keyboard deprecation is triggered as expected');
      assert.equal(onKeyboardDeprecation.message, "The `on-keyboard` modifier of ember-keyboard is deprecated. Please use the `on-key` modifier instead.");
      assert.equal(onKeyboardDeprecation.options.id, "ember-keyboard.on-keyboard");
      assert.equal(onKeyboardDeprecation.options.until, "7.0.0");
      assert.equal(onKeyboardDeprecation.options.url, "https://adopted-ember-addons.github.io/ember-keyboard/deprecations#on-keyboard");
    });


    test('KeyB button shortcut', async function(assert) {
      assert.expect(3);

      await textChanged(
        assert,
        () => keyPress('KeyB'), {
          selectorName: 'b-button',
          beforeValue: 'button press not triggered',
          afterValue: 'button press triggered'
        });
    });

    test('KeyC button shortcut should only fire when keyboard is activated', async function(assert) {
      assert.expect(5);

      await textChanged(
        assert,
        () => keyPress('KeyC'), {
          selectorName: 'c-button',
          beforeValue: 'button press not triggered',
          afterValue: 'button press not triggered'
        });

      await click('[data-test-checkbox]')
      await textChanged(
        assert,
        () => keyPress('KeyC'), {
          selectorName: 'c-button',
          beforeValue: 'button press not triggered',
          afterValue: 'button press triggered'
        });
    });

    test('KeyD button shortcut for keydown should fire', async function(assert) {
      assert.expect(5);

      await textChanged(
        assert,
        () => keyPress('KeyD'), {
          selectorName: 'd-button',
          beforeValue: 'button press not triggered',
          afterValue: 'button press not triggered'
        });

      await textChanged(
        assert,
        () => keyDown('KeyD'), {
          selectorName: 'd-button',
          beforeValue: 'button press not triggered',
          afterValue: 'button press triggered'
        });
    });

    test('KeyP button shortcut does not block other shortcuts', async function(assert) {
      assert.expect(5);

      await fillIn('[data-test-priority]', 1);

      await textChanged(
        assert,
        () => keyDown('KeyD'), {
          selectorName: 'd-button',
          beforeValue: 'button press not triggered',
          afterValue: 'button press triggered'
        });

      await textChanged(
        assert,
        () => keyPress('KeyP'), {
          selectorName: 'p-button',
          beforeValue: 'button press not triggered',
          afterValue: 'button press triggered'
        });

    });


    test('Enter text input shortcut', async function(assert) {
      assert.expect(5);

      await textChanged(
        assert,
        () => keyDown('Enter'), {
          selectorName: 'text-field',
          beforeValue: 'enter not pressed while input focused',
          afterValue: 'enter not pressed while input focused'
        });

      await focus('input[type="text"]');
      await textChanged(
        assert,
        () => keyDown('Enter'), {
          selectorName: 'text-field',
          beforeValue: 'enter not pressed while input focused',
          afterValue: 'enter pressed while input focused'
        });
    });
  });
}
