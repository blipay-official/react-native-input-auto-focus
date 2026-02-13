const { FlatCompat } = require('@eslint/eslintrc');
const { fixupConfigRules } = require('@eslint/compat');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  { ignores: ['node_modules', 'dist', 'coverage'] },
  ...fixupConfigRules(compat.extends('@react-native-community')),
  {
    rules: {
      'linebreak-style': 0,
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
];
