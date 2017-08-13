const DropdownWidget = require('./DropdownWidget.js');

function DropdownController(view, scope) {
    this.super(view, scope);
    var controller = this;

    scope.onAttached.then(function() {

        var bindingAttributes = [];
        if (view.hasAttribute('data-model')) {
            bindingAttributes.push('model');
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