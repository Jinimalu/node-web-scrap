module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        // "es2020": true
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        //"ecmaVersion": 11
        "ecmaVersion": 2017
    },
    "rules": {
        // "indent": 2,
        "comma-spacing": [2, { "before": false, "after": true }]
    }
};
