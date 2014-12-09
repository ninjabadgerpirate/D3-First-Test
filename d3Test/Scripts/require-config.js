// Configure loading modules from the script directory,
// except for 'app' ones, which are in a sibling
// directory.  Do not include .js extension
var requireConfig = {
    baseUrl: '/Scripts',
    shim: {
        "bootstrap": { "deps": ['jquery'] }
    },
    paths: {
        "jquery": "jquery-1.10.2.min",
        "underscore": 'underscore.min',
        "bootstrap": "bootstrap.min",
        "moment": 'moment.min',
        "d3": "d3.min"
    }
};
requirejs.config(requireConfig);