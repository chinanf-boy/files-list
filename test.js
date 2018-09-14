import test from 'ava';
import m from '.';

test('async: that repo path dir', async t => {
  let results = await m('.');
  t.true(results.length >= 10);
});

test('async: that repo path test.js', async t => {
  let results = await m('./test.js');
  t.true(results.length === 1);
});

test('async: deep all', async t => {
  let results = await m('.', { deep: 'all' });
  console.log(results.length);
  t.true(results.length > 12);
});

test('sync: deep all', t => {
  let results = m.sync('.', { deep: 'all' });
  console.log(results.length);
  t.true(results.length > 12);
});

test('sync: that repo path dir', t => {
  let results = m.sync('.');
  t.true(results.length >= 10);
});

test('sync: that repo path test.js', t => {
  let results = m.sync('./test.js');
  t.true(results.length === 1);
});
