# remarkableslides

[![NPM Version][npm-version-image]][npm-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]

Build Markdown files into slides using remark.js.

<img src="https://github.com/anderslatif/remarkableslides/blob/main/remarkableslides_logo.png" alt="remarkableslides logo" width="200"/>


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

| Flags    | Description                                                           |
|-----------|-----------------------------------------------------------------------|
| `--listen`| Listens to changes in `.md` files and only rebuilds the file that was changed. |
| `--live`  | Deploys a server on port 1234.                                        |

**Server options**

| Flags             | Description                          |
|--------------------|--------------------------------------|
| `--live-port=XXXX` | Specifies the port for the server.   |

**Linting and spelling options**

| Option                         | Description                                            |
|--------------------------------|--------------------------------------------------------|
| `--linting-disable`            | Linting is enabled by default. This disables it.       |
| `--spell-check`                | Enables spell checking on the markdown files.          |
| `--spell-check-language="lang"`| Allows you to define a language for spell checking.    |




# Server

Running the tool with the `--live` flag will create a HTTP server on port `1234`, that serves all the created presentation files. 

The endpoints are named after the markdown file names. If isn't unique then the endpoint will include folder names until it is.

To get an overview of endpints just visit `localhost:1234/`.


Use the `--live-port` flag to specify a different port. 

<!-- todo deal with endpoints by either prepending with an UUID for conflicting files or take more of the file path. -->


## Create your first slide presentation

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

if you create a CSS file titled `presentation.css` in the same place as your markdown files, then the html file will point to it. 

I have added some styles that make sense for me. You can always modify them directly in the `presentation.html` file. 


## Design choices

All prsentations are named `presentation.html`. This helps when wanting to add them to a `.gitignore`.

If there are multiple markdown files in a directory it will read them by alphabetic order and assemble them into a single presentation.

Blacklisted folders: `node_modules`. 

Blacklisted files: `README.md`.


## Issues

Feel free to create an [issue](https://github.com/anderslatif/remarkableslides/issues). 


[npm-version-image]: https://img.shields.io/npm/v/remarkableslides.svg
[npm-url]: https://www.npmjs.com/package/remarkableslides
[npm-install-size-image]: https://packagephobia.com/badge?p=remarkableslides
[npm-install-size-url]: https://packagephobia.com/result?p=remarkableslides