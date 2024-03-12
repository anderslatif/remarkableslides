import express from 'express';
import fs from 'fs';
import path from 'path';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';

export function createServer(presentations, PORT = 1234) {
    const app = express();

    const liveReloadServer = livereload.createServer();
        liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 1000);
    });

    app.use(connectLivereload());

    const endpoints = [];
    
    presentations.forEach((presentation) => {

        const combinedTitle = presentation.filenames.map((filename) => filename.replace(".md", "")).join("_");

        const endpoint = generateUniqueEndpoint(endpoints, combinedTitle);
        endpoints.push(endpoint);
        
        app.get(endpoint, (req, res) => {
            res.sendFile(path.resolve(presentation.absolutePresentationPath));
        });
    });

    app.get("/", (req, res) => {
        res.send(`
            <html>
                <body>
                    <h1>Presentations</h1>
                    <ul>
                        ${endpoints.map((endpoint) => {
                            return `<li><a href="${endpoint}">${endpoint}</a></li>`
                        }).join('')}
                    </ul>
                </body>
            </html>
                        
        `)
    });
    
    app.listen(PORT, () => console.log("Server running on port", PORT));
}


function generateUniqueEndpoint(endpoints, absolutePath) {
    let filename = path.basename(absolutePath).replace('.html', '');
    let endpoint = `/${filename}`;

    // If the endpoint already exists, start adding parent directories until it becomes unique
    if (endpoints.includes(endpoint)) {
        const pathParts = absolutePath.split(path.sep).slice(0, -1); // Exclude the file name
        
        while (pathParts.length > 0 && endpoints.includes(endpoint)) {
            endpoint = `/${path.basename(pathParts.pop())}${endpoint}`;
        }
        
    }

    return endpoint;
}

