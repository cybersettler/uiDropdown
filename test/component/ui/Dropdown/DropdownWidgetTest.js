const {JSDOM} = require("jsdom");
const i18next = require('i18next');
const Handlebars = require('Handlebars');
const expect = require('chai').expect;
const DropdownWidget = require("../../../../component/ui/Dropdown/DropdownWidget.js");

const translations = {
    lng: 'en',
    resources: {
        en: {
            translation: {
                user: {
                    firstname: 'First name',
                    lastname: 'Last name',
                    profile: 'Profile'
                },
                login: {
                    option: {
                        login: 'Log in',
                        logout: 'Log out'
                    },
                    status: {
                        anonymous: 'anonymous'
                    }
                },
                system: {
                    option: {
                        settings: 'Settings'
                    }
                }
            }
        }
    }
};

var view;
var model;
var schema;
var display;

var scope = {
    getModel: function () {
        return Promise.resolve(model);
    },
    getDisplay: function () {
        return Promise.resolve(display);
    }
};

describe('DropdownWidget', function () {
    describe('#render()', function () {
        before(function (done) {
            var dom = new JSDOM('<!DOCTYPE html><html><bod></body></html>');
            document = dom.window.document;
            i18next.init(translations, (err, t) => {
                Handlebars.registerHelper('i18n', function (key, opt) {
                    return t(key, opt);
                });
                done(err);
            });
        });
        beforeEach(function () {
            model = null;
            schema = null;
            display = null;
        });

        it('should generate dropdown from display', function (done) {
            givenModel();
            givenDisplay({
                title: '{{model.firstname}}',
                items: [
                    "{{i18n 'user.profile'}}",
                    "{{i18n 'system.option.settings'}}",
                    "{{i18n 'login.option.logout'}}"
                ]
            });
            givenEmptyView();
            var modelValue = '->f()';
            var displayValue = '->f()';
            view.setAttribute('data-model', modelValue);
            view.setAttribute('data-display', displayValue);
            view.dataset.model = modelValue;
            view.dataset.display = displayValue;
            var widget = new DropdownWidget(view, scope);
            widget.render()
                .then(function () {
                    let dropdown = view.shadowRoot.querySelector('.dropdown');
                    let button = dropdown.querySelector('button');
                    let items = dropdown.querySelectorAll('ul>li');
                    expect(items.length).to.equal(3);
                    expect(button.textContent).to.equal('Bruce');
                    expect(items[0].textContent).to.equal('Profile');
                    expect(items[1].textContent).to.equal('Settings');
                    expect(items[2].textContent).to.equal('Log out');
                    done();
                }).catch(done);
        });

        it('should generate dropdown from items in model', function (done) {
            givenModel();
            givenDisplay({
                title: '{{model.firstname}}',
                items: {
                    model: 'roles[1].privileges',
                    template: '{{i18n model}}'
                }
            });
            givenEmptyView();
            var modelValue = '->f()';
            var displayValue = '->f()';
            view.setAttribute('data-model', modelValue);
            view.setAttribute('data-display', displayValue);
            view.dataset.model = modelValue;
            view.dataset.display = displayValue;
            var widget = new DropdownWidget(view, scope);
            widget.render()
                .then(function () {
                    let dropdown = view.shadowRoot.querySelector('.dropdown');
                    let button = dropdown.querySelector('button');
                    let items = dropdown.querySelectorAll('ul>li');
                    expect(items.length).to.equal(2);
                    expect(button.textContent).to.equal('Bruce');
                    expect(items[0].textContent).to.equal('Profile');
                    expect(items[1].textContent).to.equal('Settings');
                    done();
                }).catch(done);
        });

        it('should generate dropdown from template', function (done) {
            givenModel();
            givenLoggedInUserTemplateView();
            var modelValue = '->f()';
            view.setAttribute('data-model', modelValue);
            view.dataset.model = modelValue;
            var widget = new DropdownWidget(view, scope);
            widget.render()
                .then(function () {
                    let dropdown = view.shadowRoot.querySelector('.dropdown');
                    let button = dropdown.querySelector('button');
                    let items = dropdown.querySelectorAll('ul>li');
                    expect(items.length).to.equal(3);
                    expect(button.textContent).to.equal('Bruce');
                    expect(items[0].textContent).to.equal('Profile');
                    expect(items[1].textContent).to.equal('Settings');
                    expect(items[2].textContent).to.equal('Log out');
                    done();
                }).catch(done);
        });
    });
});

function givenModel() {
    model = {
        firstname: 'Bruce',
        lastname: 'Wayne',
        gender: 'male',
        description: 'The Batman',
        roles: [{
            name: 'standard',
            privileges: ['user.profile']
        },{
            name: 'admin',
            privileges: [
                'user.profile',
                'system.option.settings'
            ]
        }]
    };
}

function givenDisplay(data) {
    display = data;
}

function givenEmptyView() {

    view = document.createElement('div');
    var container = document.createElement('div');
    container.classList.add('dropdown');
    var button = document.createElement('button');
    var list = document.createElement('ul');
    list.classList.add('dropdown-menu');
    container.appendChild(button);
    container.appendChild(list);

    view.shadowRoot = createShadowRoot();
    view.shadowRoot.appendChild(container);
    view.dataset = {};
}

function givenLoggedInUserTemplateView() {

    givenEmptyView();
    var span = document.createElement('span');
    span.textContent = '{{model.firstname}}';
    var ul = document.createElement('ul');
    var item1 = document.createElement('li');
    item1.textContent = "{{i18n 'user.profile'}}";
    var item2 = document.createElement('li');
    item2.textContent = "{{i18n 'system.option.settings'}}";
    var item3 = document.createElement('li');
    item3.textContent = "{{i18n 'login.option.logout'}}";

    ul.appendChild(item1);
    ul.appendChild(item2);
    ul.appendChild(item3);
    view.appendChild(span);
    view.appendChild(ul);
}

function createShadowRoot() {
    return document.createElement('div');
}