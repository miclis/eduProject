module.exports = {
    plugins: [],
    extends: ['eslint:recommended'],
    parser: 'babel-eslint',
    env: {
        "es6": true
    },
    rules: {
        "no-undef": "off",
        "no-unused-vars": "off"
    },
    reportUnusedDisableDirectives: true,
    overrides: [
        {
            "files": ["./dist/*"]
        }
    ]
};
