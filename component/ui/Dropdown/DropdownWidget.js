const Handlebars = require('Handlebars');
const d3 = require('d3');
const arrayPattern = /^(\w+)\[(\d+)]$/;

function DropdownWidget(view, scope) {
    this.view = view;
    this.scope = scope;
    this.display = {};

    var dropdown = view.shadowRoot.querySelector('.dropdown');
    var button = view.shadowRoot.querySelector('.dropdown>button');

    button.addEventListener('click', function() {
        var isOpened = dropdown.classList.toggle('open');
        button.setAttribute("aria-expanded", isOpened.toString());
    });

    this.button = button;
}

DropdownWidget.prototype.render = function() {

    return this.fetchData()
        .then(
            function(widget) {
                widget.button.textContent = widget.getTitle();
                widget.populateDropdown();
            });
};

DropdownWidget.prototype.fetchData = function() {
    var promises = [];
    var widget = this;

    promises.push(widget.scope.onAppReady);

    if (this.view.hasAttribute('data-model')) {
        promises.push(
            this.scope.getModel().then(function(result) {
                widget.model = result;
            })
        );
    }

    if (this.view.hasAttribute('data-display')) {
        promises.push(
            this.scope.getDisplay().then(function(result) {
                widget.display = result;
            })
        );
    }

    return Promise.all(promises).then(function() {
        return widget;
    });
};

DropdownWidget.prototype.isFilled = function() {
    return !!this.view.innerHTML;
};

DropdownWidget.prototype.populateDropdown = function() {

    var data = this.getOptionsData();
    var options = this.view.shadowRoot.querySelector('ul.dropdown-menu');
    var model = this.model;
    var display = this.display;
    var scope = this.scope;
    var template = null;

    if (hasDisplayTemplate()) {
        template = Handlebars.compile(display.items.template);
    }


    // Update…
    var li = d3.select(options)
        .selectAll('li')
        .data(data);

    li.select('a')
        .text(renderTemplate);

    // Enter…
    li.enter()
        .append('li')
        .append('a')
        .on('click', function(d) {
            d3.event.preventDefault();
            if (scope.onSelect) {
                scope.onSelect(d);
            }
        })
        .text(renderTemplate);

    // Exit…
    li.exit().remove();

    function renderTemplate(d) {

        let currentTemplate = template;
        let currentModel = d;
        if (!template) {
            currentTemplate = Handlebars.compile(d);
            currentModel = model;
        }
        return currentTemplate({
            model: currentModel
        });
    }

    function hasDisplayTemplate() {
        return display.items && !Array.isArray(display.items) && display.items.template;
    }
};

DropdownWidget.prototype.getTitle = function() {

    var title = '';

    if (this.isFilled()) {
        title = this.view.querySelector('span').textContent;
        let template = Handlebars.compile(title);
        title = template(this);
    } else if(this.display.title) {
        let text = this.display.title;
        let template = Handlebars.compile(text);
        title = template(this);
    }

    return title;
};

DropdownWidget.prototype.getOptionsData = function() {

    var data = [];
    var items = this.display.items;
    var model = this.model;

    if (this.isFilled()) {
        let lis = this.view.querySelectorAll('li');
        data = Array.from(lis)
            .map(function(item){
                return item.textContent;
            });
    } else if (items && Array.isArray(items)) {
        data = items;
    } else if (model && Array.isArray(model)) {
        data = model;
    } else if (typeof model === 'object' &&
        typeof items === 'object') {
        data = getItemsModel(items.model, model);
    }

    return data;
};

function getItemsModel(path, model) {
    return path.split('.').reduce(getProperty, model);
    function getProperty(acc, property) {
        let result;
        if (arrayPattern.test(property)) {
            let match = arrayPattern.exec(property);
            property = match[1];
            let index = match[2];
            result = acc[property][index];
        } else {
            result = acc[property];
        }
        return result;
    }
}

module.exports = DropdownWidget;