import filterEmpty from './filterEmpty';


describe('filterEmpty SHOULD', () => {
  test('Drop keys from an object when the key is `undefined`', () => {
    const testObj = { alice: undefined, bob: false, chad: 'wick', dude: undefined, empty: '' };

    const filtered = Object.keys(filterEmpty(testObj));

    expect(filtered)
      .not
      .toContain('alice');
    expect(filtered)
      .toContain('bob');
    expect(filtered)
      .toContain('chad');
    expect(filtered)
      .not
      .toContain('dude');
    expect(filtered)
      .toContain('empty');
  });
});
