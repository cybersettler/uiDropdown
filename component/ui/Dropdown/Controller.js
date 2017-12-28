const DropdownWidget = require('./DropdownWidget.js');

function DropdownController(view, scope) {
    this.super(view, scope);
    var controller = this;

    scope.onAttached.then(function() {

        var bindingAttributes = [];
        if (view.hasAttribute('data-model')) {
            bindingAttributes.push('model');
        }
        if (view.hasAttribute('data-display')) {
            bindingAttributes.push('display');
        }
        if (view.hasAttribute('data-select')) {
            bindingAttributes.push('select');
        }
        scope.bindAttributes(bindingAttributes);

        controller.dropdownWidget = new DropdownWidget(view, scope);
        controller.dropdownWidget.render();
    });

    this.render = function() {
        this.dropdownWidget.render();
    };
}

module.exports = DropdownController;