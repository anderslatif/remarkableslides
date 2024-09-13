export const presentationHeader = `<!DOCTYPE html>
<html>
<head>
    <style>
        $$CUSTOM_STYLES$$
    </style>

    <title>$$TAB_TITLE$$</title>
</head>
<body>
    <!-- The Remark.js container -->
<textarea id="source" style="display:none;">`;

export const presentationFooter = `</textarea>

<script src="https://remarkjs.com/downloads/remark-latest.min.js"></script>
<script>
    const slideshow = remark.create({
        source: document.getElementById('source').value
    });
</script>
</body>
</html>
`;

export const defaultCSS = `
body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #1e1e1e; /* Dark background for the body */
    margin: 0;
    padding: 0;
    overflow: hidden;
}

/* Full-Width Slideshow Container */
#slideshow {
    width: 100%;
    height: 100vh;
    position: relative;
}

/* Full-Width and Dark Mode Slide Styles */
.remark-slide-content {
    color: #ddd; /* Light text color for readability */
    background-color: #13151a; /* Dark background for slides */
    width: 100%;
    height: 100%;
    padding: 40px;
    padding-top: 0px;
    box-sizing: border-box;
}

/* Headers */
.remark-slide-content h1, .remark-slide-content h2 {
    color: rgb(8, 107, 194); /* Bright color for headers */
    margin-top: 5px;
}

.remark-slide-content h1 {
    font-size: 2em;
}

.remark-slide-content h2 {
    font-size: 1.2em;
}

/* Paragraphs */
.remark-slide-content p {
    font-size: 1.1em;
    line-height: 1.5;
}

/* Lists */
.remark-slide-content ul, .remark-slide-content ol {
    margin-left: 20px;
    font-size: 1.2em;
}

/* Images */
.remark-slide-content img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 20px auto;
}

/* Links */
a:link, a:visited {
    color: green;
}

/* Code */
.remark-slide-content pre {
    background: #333; /* Dark background for code blocks */
    border: 1px solid #444;
    color: #eee; /* Light text for code */
    padding: 8px;
    overflow: auto;
}

.remark-slide-content code {
    font-family: 'Courier New', Courier, monospace;
    background-color: #333;
    padding: 2px 5px;
    color: #eee;
}


table {
    /* center */
    margin-left: auto;
    margin-right: auto;
    border-collapse: collapse; /* This ensures that the border styles are applied uniformly */
}

th {
    color: darkgrey;
}

table, th, td {
    border: 1px solid rgba(255, 255, 255, 0.3); 
}

.title-card {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
}

.title-card h1 {
    color: cyan;
}

.exercise-card h1 {
    color: green;
}

.fullscreen-video {
    width: 40vw; 
    height: 50vh;
    border: none;
}
`;
