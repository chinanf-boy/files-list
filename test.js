import test from 'ava';
import m from '.';

test('async: that repo path dir', async t => {
  const results = await m('.');
  t.true(results.length >= 10);
});

test('async: that repo path test.js', async t => {
  const results = await m('./test.js');
  t.true(results.length === 1);
});

test('async: deep all', async t => {
  const results = await m('.', { deep: 'all' });
  console.log(results.length);
  t.true(results.length > 12);
});

test('async: deep all', async t => {
  const results = await m('./test/md', { deep: 'all' });
  console.log(results.length);
  t.true(results.length === 10);
});
