const Handlebars = require('Handlebars');
const d3 = require('d3');

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
            if (widget.scope.onSelect) {
                widget.scope.onSelect(d);
            }
        })
        .text(renderTemplate);

    // Exit…
    li.exit().remove();

    function renderTemplate(d) {
        let template = Handlebars.compile(d);
        return template(params);
    }
};

DropdownWidget.prototype.getTitle = function() {

    var title = '';

    if (this.isFilled()) {
        title = this.view.querySelector('span').textContent;
        let template = Handlebars.compile(title);
        title = template(this);
    } else if(this.display.title) {

    }

    return title;
};

DropdownWidget.prototype.getOptionsData = function() {

    var data = [];

    if (this.isFilled()) {
        data = this.view.querySelector('li').map(function(item){
            return item.textContent;
        });
    } else if(this.display.options) {
        data = this.display.options;
    }

    return data;
};

module.exports = DropdownWidget;