import globals from "globals";
import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["client/dist/", "server/dist/"]
  },
  {
    languageOptions: {
      globals: { ...globals.browser }
    }
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "array-callback-return": "error",
      "no-fallthrough": "off",
      "no-unreachable": "warn",
      "no-unreachable-loop": "warn",
      "no-unsafe-negation": "off",
      "no-unused-private-class-members": "warn",
      "no-unused-vars": "warn",
      "no-use-before-define": ["error", { functions: false, variables: false }],
      "no-useless-assignment": "error",
      "camelcase": "error",
      "consistent-return": "error",
      "curly": ["error", "multi-or-nest", "consistent"],
      "eqeqeq": "error",
      "func-style": ["error", "declaration"],
      "guard-for-in": "warn",
      "new-cap": "error",
      "no-else-return": "warn",
      "no-empty": "off",
      "no-empty-function": "warn",
      "no-empty-static-block": "warn",
      "no-eval": "error",
      "no-extra-bind": "error",
      "no-extra-label": "error",
      "no-implied-eval": "error",
      "no-lonely-if": "error",
      "no-multi-assign": "error",
      "no-shadow": "warn",
      "no-unneeded-ternary": "error",
      "no-useless-call": "error",
      "no-useless-computed-key": "error",
      "no-useless-constructor": "error",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "one-var": ["error", "never"],
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "prefer-destructuring": "error",
      "prefer-exponentiation-operator": "warn",
      "prefer-numeric-literals": "error",
      "prefer-object-spread": "error",
      "prefer-regex-literals": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "prefer-template": "warn",
      "require-await": "warn"
    }
  },
  {
    plugins: {
      "@stylistic": stylistic
    },
    rules: {
      "@stylistic/array-bracket-newline": "error",
      "@stylistic/array-bracket-spacing": "error",
      "@stylistic/array-element-newline": ["error", "consistent"],
      "@stylistic/arrow-parens": ["error", "as-needed"],
      "@stylistic/arrow-spacing": "error",
      "@stylistic/block-spacing": "error",
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "@stylistic/comma-dangle": "error",
      "@stylistic/comma-spacing": "error",
      "@stylistic/comma-style": "error",
      "@stylistic/computed-property-spacing": "error",
      "@stylistic/curly-newline": "error",
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/eol-last": "error",
      "@stylistic/function-call-spacing": "error",
      "@stylistic/generator-star-spacing": ["error", "after"],
      "@stylistic/indent": [
        "error",
        2,
        {
          SwitchCase: 0,
          VariableDeclarator: "first",
          FunctionDeclaration: { parameters: "first" },
          FunctionExpression: { parameters: "first" },
          CallExpression: { arguments: "first" },
          ArrayExpression: "first",
          ObjectExpression: "first",
          ImportDeclaration: "first"
        }
      ],
      "@stylistic/indent-binary-ops": ["error", 2],
      "@stylistic/jsx-closing-bracket-location": "error",
      "@stylistic/jsx-closing-tag-location": "error",
      "@stylistic/jsx-curly-newline": "error",
      "@stylistic/jsx-curly-spacing": "error",
      "@stylistic/jsx-equals-spacing": "error",
      "@stylistic/jsx-first-prop-new-line": "error",
      "@stylistic/jsx-function-call-newline": "error",
      "@stylistic/jsx-indent-props": ["error", 2],
      "@stylistic/jsx-quotes": "error",
      "@stylistic/jsx-self-closing-comp": "error",
      "@stylistic/jsx-tag-spacing": [
        "error",
        {
          closingSlash: "never",
          beforeSelfClosing: "always",
          afterOpening: "never",
          beforeClosing: "never"
        }
      ],
      "@stylistic/jsx-wrap-multilines": "error",
      "@stylistic/key-spacing": "error",
      "@stylistic/keyword-spacing": "error",
      "@stylistic/max-len": ["error", 80, 4, { ignoreUrls: true, ignoreStrings: true }],
      "@stylistic/max-statements-per-line": "error",
      "@stylistic/member-delimiter-style": "error",
      "@stylistic/new-parens": "error",
      "@stylistic/no-extra-semi": "error",
      "@stylistic/no-floating-decimal": "error",
      "@stylistic/no-mixed-spaces-and-tabs": "error",
      "@stylistic/no-multi-spaces": "error",
      "@stylistic/no-multiple-empty-lines": ["error", { max: 2, maxEOF: 0, maxBOF: 0 }],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/no-whitespace-before-property": "error",
      "@stylistic/object-curly-newline": "error",
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/one-var-declaration-per-line": "error",
      "@stylistic/operator-linebreak": [
        "error",
        "before",
        { overrides: { "=": "after" } }
      ],
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/quote-props": ["error", "consistent-as-needed"],
      "@stylistic/quotes": ["error", "double", { allowTemplateLiterals: true }],
      "@stylistic/rest-spread-spacing": "error",
      "@stylistic/semi": "error",
      "@stylistic/semi-spacing": "error",
      "@stylistic/semi-style": "error",
      "@stylistic/space-before-blocks": "error",
      "@stylistic/space-before-function-paren": [
        "error", {
          anonymous: "always",
          named: "never",
          asyncArrow: "always"
        }
      ],
      "@stylistic/space-in-parens": "error",
      "@stylistic/space-infix-ops": "error",
      "@stylistic/space-unary-ops": "error",
      "@stylistic/spaced-comment": "error",
      "@stylistic/switch-colon-spacing": "error",
      "@stylistic/template-curly-spacing": "error",
      "@stylistic/template-tag-spacing": "error",
      "@stylistic/type-annotation-spacing": "error",
      "@stylistic/type-generic-spacing": "error",
      "@stylistic/type-named-tuple-spacing": "error",
      "@stylistic/yield-star-spacing": ["error", "after"]
    }
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off"
    }
  }
);
