import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'logs/**',
            'coverage/**',
            'src/config/templates/**',
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                clearInterval: 'readonly',
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { 
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
);
