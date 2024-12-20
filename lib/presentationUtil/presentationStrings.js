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
        source: document.getElementById('source').value,
        highlightStyle: 'monokai',
    });
</script>
</body>
</html>
`;

