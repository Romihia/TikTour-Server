import globals from 'globals';


export default [
  {languageOptions: { globals: globals.browser },
  rules:{
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-unused-vars': 'warn',
    'no-extra-semi': 'warn', 
    }
  },
];