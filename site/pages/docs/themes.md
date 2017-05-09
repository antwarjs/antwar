---
title: "Theming"
sort: 4
---

The building blocks of Antwar themes are React components. They serve as templates for the pages on your site. The [default Antwar theme](https://github.com/antwarjs/default-theme) is a good place to look for inspiration.

There are a few required file in an Antwar theme. Antwar handles js, jsx and coffeescript files.

## Required Files

**Body**

A React component that will be put directly in the body tag and which should render content that all routes of your sites have in common. This component is responsible for rendering its children.

**SectionIndex**

The index for sections. Normally used to display a summary of the content in that section.

**SectionItem**

Outputs the content of an item.

## Optional Files

A theme can contain any files, but there are a few that Antwar core looks for.

**functions.js**

Functions that hook into Antwar's parsing and item generation. For example if you want to control how urls are generated or how the content is parsed before it's passed to the components. (Full docs on these functions in the next section).

## Processing Hooks

Antwar core provides some hooks into the post processing. Define functions in the file ***functions(.js/.coffee)*** in the root of your theme.

`preProcessItems(items)`
Called before items are processed by Antwar. Has to return an object with the same structure as the input.

`postProcessItems(items)`
Called after items are processed by Antwar. Has to return an object with the same structure as the input.

`url(file, fileName)`
Override the default url of the item. Has to return a string that is unique for each item.

`date(file, fileName)`
Override the default date field of the item. Has to return a string.

`preview(file, fileName)`
Override the default preview of the item. Has to return a string.

## Theming Helpers

### PathsMixin

The PathsMixin has methods for getting items. `require('antwar-core/PathsMixin')` includes the mixin.

These functions are provided by PathsMixin.

`this.getAllItems()`
Returns all the items of the site.

`this.getItem()`
Get the item for the current path.

`this.getItemForPath(path)`
Get the item for a specific path.

`this.getSectionItems()`
Returns all the items of the current section.

`this.getSection()`
Returns the object describing the current section.

`this.getSectionTitle()`
Returns the title of the current section.

`this.getSectionName()`
Returns the name of the current section

### Core Components

Antwar core provides a couple of components that themes can use.

`NavigationLink`
Takes an item as prop and outputs a link to that item.

`SectionLink`
Takes an item as prop and outputs a link to that item. Example:

```javascript
<SectionLink item={item} />
```

where `item` is a section item.

### MdHelper

Exposes functions to parse Markdown files.

`render(markdown)`
Returns given Markdown as HTML. Uses [marked](https://www.npmjs.com/package/marked) by default.

`getContentPreview(markdown, limit, endChar)`
Returns given Markdown as a stripped version (no HTML). If its length would be less than given `limit`, returns content up to that point and appends the given `endChar` to it.

`parse(content)`
Returns the parsed content of a .md file as a json object.
