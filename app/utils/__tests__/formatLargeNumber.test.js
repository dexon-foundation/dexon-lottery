import formatLargeNumber from '../formatLargeNumber';

describe('formatLargeNumber', () => {
  it('should convert correctly', () => {
    expect(formatLargeNumber(0)).toBe('0');
    expect(formatLargeNumber(1)).toBe('1');
    expect(formatLargeNumber(1024)).toBe('1.02K');
    expect(formatLargeNumber(1148576)).toBe('1.14M');
    expect(formatLargeNumber(222222222)).toBe('222.22M');
    expect(formatLargeNumber(2222222222)).toBe('2.22B');
    expect(formatLargeNumber(59999.9912)).toBe('59.99K');

    // specify precision
    expect(formatLargeNumber(0, 3)).toBe('0');
    expect(formatLargeNumber(1024, 3)).toBe('1.024K');
    expect(formatLargeNumber(1148576, 3)).toBe('1.148M');
    expect(formatLargeNumber(222222222, 3)).toBe('222.222M');
    expect(formatLargeNumber(2222222222, 3)).toBe('2.222B');
    expect(formatLargeNumber(59999.9912, 3)).toBe('59.999K');
  });
});
