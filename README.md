# remarkableslides
Build Markdown files into slides using remark.js.

<img src="https://github.com/anderslatif/KeysKey/blob/main/KeysKeyLogo.png" alt="logo" width="200"/>

# KeysKey

[![NPM Version][npm-version-image]][npm-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]



A CLI tool that automates the process of building and serving [remark.js](https://github.com/remarkjs/remark) slide presentations from markdown files. 

Additional features:

* can watch for changes in markdown and rebuild only what is needed
* markdown linting
* spellchecking

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

All flags are optional. 

<!-- todo create a markdown table -->
Linting
--linting-disable  linting is enabled by default. this disables it.
CheckSpelling
--spell-check   enables spell checking on the markdown files
--spell-check-language="lang" allows you to define a language  
<!-- todo link to the languages available and what to type exactly -->

Rebuilding on file changes
--listen  listens to changes in `.md` files and efficiently updates only the file that was changed

Server
--live  deploys a server on port 1234
--live-port=XXXX specifies the port for the server 


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

<div style="font-weight: bold; font-size: 20px; text-shadow: 2px 2px 4px #aaa; background: -webkit-linear-gradient(#e66465, #9198e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
  You can also embed HTML into your markdown
</div>

```

2. Now run the `remarkableslides` command in the directory and notice how it created `presentation.html`. 

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



