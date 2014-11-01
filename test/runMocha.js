var allTestFiles = [];
var pathToModule = function(path) {
    return path.replace(/^\/base\//, '../../').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
    if (/Spec\.js$/.test(file)) {
        allTestFiles.push(pathToModule(file));
    }
});

require.config({
    baseUrl: '/base/src/Client',
    paths: {
        'chai': '/base/node_modules/chai/chai'
    },
    deps: allTestFiles,
    callback: window.__karma__.start
});