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
    <span>{{i18n mymenu.title}}</span>
    <ul>
        <li>{{i18n mymenu.option1}}</li>
        <li>{{i18n mymenu.option2}}</li>
        <li>{{i18n mymenu.option3}}</li>
    </ul>
</ui-dropdown>
```

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
* __items__(array: [sring] | [object] | object): Dropdown options.
The following attributes are supported in the items configuration
object:
  * __model__(string): Where the items come from in the model.
  * __template__(string): A _Handlebars_ template that will be used
  to render the dropdown items.

### data-select

Callback for the select event.