import test from 'ava';
import m from '.';

test('async: that repo path dir', async t => {
  let results = await m('.');
  t.is(results.length, 12);
});

test('async: that repo path test.js', async t => {
  let results = await m('./test.js');
  t.is(results.length, 12);
});

test('async: deep all', async t => {
  let results = await m('.', { deep: 'all' });
  t.true(results.length > 12);
});

test('sync: deep all', t => {
  let results = m.sync('.', { deep: 'all' });
  t.true(results.length > 12);
});

test('sync: that repo path dir', t => {
  let results = m.sync('.');
  t.is(results.length, 12);
});

test('sync: that repo path test.js', t => {
  let results = m.sync('./test.js');
  t.is(results.length, 12);
});
