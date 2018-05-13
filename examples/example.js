"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var speclight_1 = require("../src/speclight");
// let firstRun = true;
describe('examples', function () {
    speclight_1.spec("In order to know how much money I can save\nAs a Math Idiot\nI want to add two numbers", function (spec) {
        var a;
        var b;
        var actual;
        spec
            .given(templateObject_1 || (templateObject_1 = __makeTemplateObject(["I enter ", ""], ["I enter ", ""])), 5)(function (input) { return a = input; })
            .and(templateObject_2 || (templateObject_2 = __makeTemplateObject(["I enter ", ""], ["I enter ", ""])), 6)(function (input) { return b = input; })
            .when(templateObject_3 || (templateObject_3 = __makeTemplateObject(["I press add"], ["I press add"])))(function () { return actual = add(a, b); })
            .then(templateObject_4 || (templateObject_4 = __makeTemplateObject(["The result should be ", ""], ["The result should be ", ""])), 12)(function (expected) { return expect(expected).toBe(actual); });
    });
    fdescribe('skipping', function () {
        speclight_1.spec("In order to know how much money I can save\n\tAs a Math Idiot\n\tI want to add two numbers", function (spec) {
            var a;
            var b;
            var actual;
            spec
                .given(templateObject_5 || (templateObject_5 = __makeTemplateObject(["I enter ", ""], ["I enter ", ""])), 5)(function (input) { return a = input; })
                .and(templateObject_6 || (templateObject_6 = __makeTemplateObject(["I enter ", ""], ["I enter ", ""])), 6)(function (input) { return b = input; })
                .when(templateObject_7 || (templateObject_7 = __makeTemplateObject(["I press add"], ["I press add"])))(function () { return actual = add(a, b); })
                .then(templateObject_8 || (templateObject_8 = __makeTemplateObject(["The result should be ", ""], ["The result should be ", ""])), 11)(function (expected) { return expect(expected).toBe(actual); })
                .and(templateObject_9 || (templateObject_9 = __makeTemplateObject(["The result should be ", ""], ["The result should be ", ""])), 1000)(function (expected) { return expect(expected).toBe(actual); })
                .and(templateObject_10 || (templateObject_10 = __makeTemplateObject(["This step should not be executed"], ["This step should not be executed"])))(function () { return fail('should not be executed'); });
        });
    });
});
function add(a, b) {
    return a + b;
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
