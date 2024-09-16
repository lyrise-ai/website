/* eslint-disable prettier/prettier */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  env: {
    browser: true,
    node: true,
    es6: true,
  },

  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },

  plugins: [],
  extends: [
    'next/core-web-vitals',
    'airbnb',
    'prettier',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
    'plugin:security/recommended',
  ],

  // rules: {
  //   'no-underscore-dangle': ['error', { allow: ['_value'] }],
  //   'react/prop-types': 'off',
  //   'prettier/prettier': [
  //     'error',
  //     {
  //       endOfLine: 'auto',
  //     },
  //   ],
  //   'react/react-in-jsx-scope': 'off',
  //   'react/forbid-prop-types': 'off',
  //   'react/jsx-filename-extension': [
  //     1,
  //     {
  //       extensions: ['.js', '.jsx'],
  //     },
  //   ],
  //   'react/jsx-props-no-spreading': 'off',
  //   'import/extensions': [
  //     'error',
  //     'ignorePackages',
  //     {
  //       js: 'never',
  //       jsx: 'never',
  //     },
  //   ],
  //   'jsx-a11y/anchor-is-valid': [
  //     'error',
  //     {
  //       components: ['Link'],
  //       specialLink: ['hrefLeft', 'hrefRight'],
  //       aspects: ['invalidHref', 'preferButton'],
  //     },
  //   ],
  //   'no-nested-ternary': 'off',
  //   'import/prefer-default-export': 'off',
  // },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_value'] }],
    'react/prop-types': 'off',
    'prettier/prettier': [
      'warn', // Change from 'error' to 'warn'
      {
        endOfLine: 'auto',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'no-nested-ternary': 'off',
    'import/prefer-default-export': 'off',
    'import/no-useless-path-segments': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'prefer-template': 'off',
    'import/no-unresolved': 'off',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
    'jsx-a11y/role-has-required-aria-props': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'import/order': 'off',
    'no-unused-vars': 'off',
    'no-shadow': 'off',
    'import/no-absolute-path': 'off',
    'react/no-unknown-property': 'off',
    'react/jsx-no-target-blank': 'off',
    'sonarjs/no-duplicate-string': 'off',
    'vars-on-top': 'off',
    'no-var': 'off',
    'no-bitwise': 'off',
    'react/jsx-no-bind': 'off',
    'react/self-closing-comp': 'off',
    'no-use-before-define': 'off',
    camelcase: 'off',
    'block-scoped-var': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'prefer-destructuring': 'off',
    'no-param-reassign': 'off',
  },
}
