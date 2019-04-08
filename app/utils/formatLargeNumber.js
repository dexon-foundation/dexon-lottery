const signs = [
  {
    value: 1E12,
    symbol: 'T',
  },
  {
    value: 1E9,
    symbol: 'B',
  },
  {
    value: 1E6,
    symbol: 'M',
  },
  {
    value: 1E3,
    symbol: 'K',
  },
  {
    value: 1,
    symbol: '',
  },
];

const regex = /\.0+$|(\.[0-9]*[1-9])0+$/;

const formatLargeNumber = (number, digits = 2) => {
  if (!number) {
    return '0';
  }

  if (number < 1) {
    return number;
  }

  const matchedSign = signs.find(sign => number >= sign.value);
  const { value, symbol } = matchedSign;
  const shortNumer = `${(number / value)}`.match(new RegExp(`\\d+(\\.)?\\d{0,${digits}}`))[0];

  return `${shortNumer.replace(regex, '$1')}${symbol}`;
};

export default formatLargeNumber;
