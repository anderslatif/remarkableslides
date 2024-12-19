# remarkableslides

[![NPM Version][npm-version-image]][npm-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]

> A CLI tool that makes it feel good to create slides from markdown files.

<img src="https://github.com/anderslatif/remarkableslides/blob/main/assets/remarkableslides_logo.png" alt="remarkableslides logo" width="150"/>

Make slides from markdown files using [remark.js](https://github.com/remarkjs/remark).

---

## Features

* Build markdown files into HTML documents for presentations
* Create a server that serves the presentations
* Can watch for changes in markdown and rebuild only what is needed
* Markdown linting
* Spell-checking

---

## How to run

Run the following and it will recursively look for `.md` files starting from the directory you are in.

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

---

## Try it in less than 1 minute!

1. Create an md file with any name and add the following content to it:

```md

<div class="title-card">
    <h1>Try Remarkable Slides now!</h1>
</div>

---

# Slide Title

Some text.

* Both bullet points
* And numbered lists 
 1. Are
 2. Supported

---

# Slide 2 Title

`---` is used to denote the next slide.

> This is a quote

**Bold** text is and *italic*.

---

<div style="color: cyan; font-size: 20px; text-shadow: 2px 2px 4px #aaa;">
  You can also embed HTML into your markdown
</div>

---

# Image slide

<img src="https://github.com/anderslatif/remarkableslides/blob/main/assets/remarkableslides_logo.png" alt="Remarkable Slides Logo"/>

<!-- You can point to local files as well -->
<!-- The above will also work in markdown on Github -->

---

# Example of a video slide

## What is DevOps?

[![What is DevOps?](http://img.youtube.com/vi/kBV8gPVZNEE/0.jpg)](https://www.youtube.com/watch?v=kBV8gPVZNEE)

---

# Pros and cons lists

* (+) Pro 1
* (+) Pro 2
* (-) Con 1
* (-) Con 2
* (!) Note!

<!-- The above will still render in markdown but in the HTML presentation 
'* (+/-/!)' becomes a bulleted list with the sign in paranthesis as the bullet point.
Basically the above will render as:

<ul style="list-style-type: '+ '"><li>Pro 1</li><li>Pro 2</li></ul>
<ul style="list-style-type: '- '"><li>Con 1</li><li>Con 2</li></ul>
<ul style="list-style-type: '! '"><li>Note!</li></ul>
 -->

```

2. Now run the `remarkableslides` command in the directory and notice how it creates `presentation.html`. 

```bash
$ npx remarkableslides
```

3. Check out [localhost:1234](http://localhost:1234). That's all!

4. The server will watch for changes. Change something and it will reload the page automatically.

---

## Flags

All flags are optional. The default behavior is that it compiles markdown files into presentations. Markdown linting and spell checks are disabled by default. The server that runs the presentations are also disabled by default. 


**Modes**

| Flags          | Description                                                                                                   |
|----------------|---------------------------------------------------------------------------------------------------------------|
| `--check-mode` | Default: False. Skips presentation creation. Ideal for spell checking or linting only.                        |
| `--listen-mode`| Default: True. Enables file monitoring without starting a server. Automatically deactivated with --check-mode.|
| `--live-mode`  | Default: True. Enables server deployment for presentations. Automatically deactivated with --check-mode.      |

**Server options**

| Flag                           | Description                           |
|--------------------------------|---------------------------------------|
| `--live-port=<port_number>`    | Specify the desired port for the server.  |


**Output Options**

| Flag                                    | Description                                                             |
|-----------------------------------------|-------------------------------------------------------------------------|
| `--output-md`                           | `Output to a single md file titled 'presentation.md'.                   |
| `--convert-to-pdf`                      | Output a pdf (will not have any formatting).                            |

Use `<div class='ignore-output-md'>...</div>` to exclude the enclosed content from the markdown output. This content, however, will still be visible in the presentation.

Use `<div class='ignore-presentation'>...</div>` to exclude the enclosed content from the presentation. 

**Other Options**

| Flag                                     | Description                                                             |
|-----------------------------------------|-------------------------------------------------------------------------|
| `--lint`                                | Lints the markdown files.                                               |
| `--spell-check`                         | Enables spell checking on the markdown files. Only supports English.    |
| `--add-table-of-contents`               | A table of contents will be inserted as the first slide.                |
| `--correct-markdown-list-numbering`     | Makes sure that numbers are in chronological order. Also works for nested lists. |


---

## Server

By default, a server starts on port 1234 and serves all created presentation files.

Endpoint names are derived from markdown file names. For directories containing multiple markdown files, endpoint names are combinations of those file names. If uniqueness is not achieved, folder names are incorporated into the endpoint name to ensure it is unique.

To get an overview of endpints just visit [localhost:1234](http://localhost:1234).

Use the `--live-port` flag to specify a different port. 

---

### CSS Themes

Here is how to change the CSS theme for the presentation:

#### 1. Modify the Presentation directly

Edit the `<style>` tag in the `presentation.html` file.

(Will not work with live reload).

#### 2. Create (a) CSS file(s)

Add CSS files in the same directory as the markdown files.

#### 3. Point to the CSS file

When invoking the command use the `--css` flag:

```bash
$ npx remarkableslides --css ../../link/to/your/css_file.css
```

#### 4. Use a ready-made theme

You can choose a theme with the `--theme` flag. 

```bash
$ npx remarkableslides --theme=default
```

The current support for CSS themes are:

| CSS Theme |
|-----------|
| default   |

The theme name corresponds to the file names in this [./lib/presentationUtil/css](./lib/presentationUtil/css) directory without the `.css` extension. 

If you would like to have your reasonable personal theme included in the library then make a PR with the CSS file to that folder.

---

## Design choices

All prsentations are named `presentation.html`. This helps when wanting to add them to a `.gitignore`.

When serving a presentation the folder and its subfolders are served as static content. That allows images to be served with the presentation. 

If there are multiple markdown files in a directory, they will read them by alphabetic order and assembled into a single presentation.

Ignored folders: `node_modules`.

Ignored files: `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`.

---

## Issues

Feel free to create an [issue](https://github.com/anderslatif/remarkableslides/issues). 


[npm-version-image]: https://img.shields.io/npm/v/remarkableslides.svg
[npm-url]: https://www.npmjs.com/package/remarkableslides
[npm-install-size-image]: https://packagephobia.com/badge?p=remarkableslides
[npm-install-size-url]: https://packagephobia.com/result?p=remarkableslides
