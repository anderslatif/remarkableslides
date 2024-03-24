# remarkableslides

[![NPM Version][npm-version-image]][npm-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]

> Build Markdown files into slides using remark.js.

<img src="https://github.com/anderslatif/remarkableslides/blob/main/remarkableslides_logo.png" alt="remarkableslides logo" width="150"/>

https://www.npmjs.com/package/remarkableslides

A CLI tool that automates the process of building and serving [remark.js](https://github.com/remarkjs/remark) slide presentations from markdown files. 

## Features:

* Build markdown files into a HTML document for presentation
* Create a server that serves the presentations
* Can watch for changes in markdown and rebuild only what is needed
* Markdown linting
* Spellchecking

## How to run

Run the following and it will look recursively for .md files starting from the directory you are in.

```bash
$ npx remarkableslides
```

Or install it globally:

```bash
$ npm install -g remarkableslides
```

Now you can run it like this:

```bash
$ remarkableslides
```

## Flags

All flags are optional. The default behavior is that it compiles markdown files into presentations. Markdown linting and spell checks are disabled by default. The server that runs the presentations are also disabled by default. 


**Modes**

| Flags          | Description                                                                                                   |
|----------------|---------------------------------------------------------------------------------------------------------------|
| `--check-mode` | Default: False. Skips presentation creation. Ideal for spell checking or linting only.                        |
| `--listen-mode`| Default: True. Enables file monitoring without starting a server. Automatically deactivated with --check-mode.|
| `--live-mode`  | Default: True. Enables server deployment for presentations. Automatically deactivated with --check-mode.      |

**Server options**

| Flags                          | Description                           |
|--------------------------------|---------------------------------------|
| `--live-port <port_number>`    | Specifies the port for the server.    |

**Other Options**

| Option                                  | Description                                                             |
|-----------------------------------------|-------------------------------------------------------------------------|
| `--lint`                                | Lints the markdown files.                                               |
| `--spell-check`                         | Enables spell checking on the markdown files. Only supports English.    |
| `--add-table-of-contents`               | A table of contents will be inserted as the first slide.                |
| `--correct-markdown-list-numbering`     | Makes sure that numbers are in chronological order. Also works for nested lists. |
| `--convert-to-pdf`                      | Output a pdf (will not have any formatting).                            |



# Server

By default, a server starts on port 1234 and serves all created presentation files.

Endpoint names are derived from markdown file names. For directories containing multiple markdown files, endpoint names are combinations of those file names. If uniqueness is not achieved, folder names are incorporated into the endpoint name to ensure it is unique.

To get an overview of endpints just visit `localhost:1234/`.

Use the `--live-port` flag to specify a different port. 


## Try it out: Create your first slide presentation

1. Create an md file of any name and add the following content to it:

```md

# Slide Title

Some text.

* Both bullet points
* And numbered lists 
 1. Are
 2. Supported

---

# Slide 2 Title

`---` is used to denote the next slide. 

<div style="color: cyan; font-size: 20px; text-shadow: 2px 2px 4px #aaa;">
  You can also embed HTML into your markdown
</div>

```

2. Now run the `remarkableslides` command in the directory and notice how it creates `presentation.html`. 

3. Try to run the server in watch mode:

```bash
$ remarkableslides --live --watch
```

And checkout `localhost:1234`. That's all!


### CSS styles for the presentation

Create a CSS file titled `presentation.css` in the same place as your markdown file(s) to include a custom style, otherwise it will get a default template. 

I have added some styles that make sense for me. You can always modify them directly in the `presentation.html` file. 


## Design choices

All prsentations are named `presentation.html`. This helps when wanting to add them to a `.gitignore`.

When serving a presentation the folder and its subfolders are served as static content. That allows images to be served with the presentation. 

If there are multiple markdown files in a directory, they will read them by alphabetic order and assembled into a single presentation.

Ignored folders: `node_modules`. 

Ignored files: `README.md`.


## Issues

Feel free to create an [issue](https://github.com/anderslatif/remarkableslides/issues). 


[npm-version-image]: https://img.shields.io/npm/v/remarkableslides.svg
[npm-url]: https://www.npmjs.com/package/remarkableslides
[npm-install-size-image]: https://packagephobia.com/badge?p=remarkableslides
[npm-install-size-url]: https://packagephobia.com/result?p=remarkableslides
