const d3 = require('d3');
const arrayPattern = /^(\w+)\[(\d+)]$/;

function DropdownWidget(view, scope) {

    this.view = view;
    this.scope = scope;
    let title = view.querySelector('.dropdown-title');
    let menu = view.querySelector('.dropdown-menu');
    let dropdown = view.shadowRoot.querySelector('.dropdown');
    let button = view.shadowRoot.querySelector('.dropdown>a');

    if (title) {
        this.renderTitleTemplate = scope.templateEngine.compile(title.innerHTML);
    }

    if (menu) {
        this.renderMenuTemplate = scope.templateEngine.compile(menu.innerHTML);
    }

    this.title = title;
    this.menu = menu;
    this.dropdown = dropdown;
    this.button = button;

    button.addEventListener('click', function(e) {
        e.preventDefault();
        let isOpened = dropdown.classList.toggle('open');
        button.setAttribute("aria-expanded", isOpened.toString());
        view.classList.toggle('open');
    });
}

DropdownWidget.prototype.render = function() {

    return this.fetchData()
        .then(
            function(widget) {
                render(widget);
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

DropdownWidget.prototype.collapse = function() {
    var isOpened = this.dropdown.classList.toggle('open');
    this.button.setAttribute("aria-expanded", isOpened.toString());
    this.view.classList.toggle('open');
};

function render(widget) {
    if (widget.display) {
        renderDropdownFromDisplay(widget);
    } else {
        widget.title.innerHTML = widget.renderTitleTemplate(
            {model: widget.model});
        widget.menu.innerHTML = widget.renderMenuTemplate(
            {model: widget.model});
    }

    initializeLinks(widget);
}

function renderDropdownFromDisplay(widget) {
    renderTitleFromDisplay(widget);
    renderMenuFromDisplay(widget);
}

function renderTitleFromDisplay(widget) {
    if (!widget.title) {
        let titleDiv = document.createElement('div');
        titleDiv.classList.add('dropdown-title');
        widget.view.appendChild(titleDiv);
        widget.title = titleDiv;
    }
    widget.title.innerHTML = widget.scope.templateEngine.render(
        widget.display.title, {model: widget.model});
}

function renderMenuFromDisplay(widget) {
    let data = getMenuData(widget);

    if (!widget.menu) {
        let menuDiv = document.createElement('div');
        menuDiv.classList.add('dropdown-menu');
        let ul = document.createElement('ul');
        menuDiv.appendChild(ul);
        widget.view.appendChild(menuDiv);
        widget.menu = ul;
    }

    // Update…
    var li = d3.select(widget.menu)
        .selectAll('li')
        .data(data);

    li.select('a')
        .text(renderLinkTemplate);

    // Enter…
    li.enter()
        .append('li')
        .append('a')
        .attr('href', function(d) {
            return d.href;
        })
        .text(renderLinkTemplate);

    // Exit…
    li.exit().remove();

    function renderLinkTemplate(d) {
        return widget.scope.templateEngine.render(d.template, {model: d.model})
    }

}

function initializeLinks(widget) {
    Array.from(widget.menu.querySelectorAll('a'))
        .forEach(initializeLink, widget);
}

function initializeLink(link) {
    var widget = this;
    link.addEventListener('click', onSelect);

    function onSelect(e) {
        e.preventDefault();
        let href = e.currentTarget.getAttribute('href');
        if (widget.scope.onSelect) {
            widget.scope.onSelect({href: href});
        }
        widget.collapse();
    }
}

 function getMenuData(widget) {

    var menu = widget.display.menu;
    var result = [];

    if (Array.isArray(menu)) {
        return menu.map(function(item) {
            let result = item;
            if (typeof item === 'string') {
                result = {
                    model: widget.model,
                    template: item
                }
            } else {
                result.model = getItemModel(item.model, widget.model)
            }

            return result;
        });
    } else if(Array.isArray(widget.model)) {
        console.log('model is an array', widget.model);
        result = widget.model.map(function(item) {
            let model = getItemModel(menu.model, item);
            return {
                model: model,
                template: menu.template
            }
        });
    } else {
        let model = getItemModel(menu.model, widget.model);
        result = model.map(function(item) {
            return {
                model: item,
                template: menu.template
            };
        });
    }

    return result;
}

function getItemModel(path, model) {

    if (!path) {
        return model;
    }

    return path.split('.')
        .reduce(getProperty, model);

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