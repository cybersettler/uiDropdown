# uiDropdown
>Dropdown websemble component

## Getting started

Include UI Dropdown in your project dependencies
(see [websemble generator]
  (https://github.com/cybersettler/generator-websemble/wiki)).
In your project's bower.json:

```json
{
  "dependencies": {
    "uiForm": "cybersettler/uiDropdown"
  }
}
```
## Usage

```html
<ui-dropdown>
    <div class="dropdown-title">
        {{i18n 'mymenu.title'}}
    </div>
    <div class="dropdown-menu">
        <ul>
            <li>
                <a>{{i18n 'mymenu.option1'}}</a>
            </li>
            <li>
                <a>{{i18n 'mymenu.option2'}}</a>
            </li>
            <li>
                <a>{{i18n 'mymenu.option3'}}</a>
            </li>
        </ul>
    </div>
</ui-dropdown>
```

The menu may be built from the element's content
or from the display attribute. The display can in
turn be an array or an object. If the display is
an object and the model is an array, the menu
items number and order will be taken from the model,
otherwise they will be taken from the display.

## API

### data-model

Data to be used to populate the dropdown.

### data-direction

Dropdown direction, possible values are _up_ and _down_,
defaults to _down_.

### data-display

* __title__(string): Dropdown title.
* __direction__(enum: up | down): Dropdown direction,
defaults to _up_.
* __menu__(array: [sring] | [object] | object): Dropdown options.
The following attributes are supported in the items configuration
object:
  * __model__(string): Where the items come from in the model.
  * __template__(string): A _Handlebars_ template that will be used
  to render the dropdown items.
  * __href__(string): Hyperlink reference that the
  menu item points to.

### data-select

Callback for the select event.