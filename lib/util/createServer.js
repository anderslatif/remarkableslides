import express from 'express';
import path from 'path';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';

export function createServer(presentations, PORT = 1234) {
    const app = express();

    const liveReloadServer = livereload.createServer();
        liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 100);
    });

    app.use(connectLivereload());

    const endpoints = [];
    
    presentations.forEach((presentation) => {

        app.use(express.static(presentation.directoryPath))

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

    function handleExit(options, exitCode) {
        if (options.cleanup) {
          server.close(() => {
          });
        }
        if (exitCode || exitCode === 0);
        if (options.exit) process.exit();
      }
      
      // Do something when app is closing
      process.on('exit', handleExit.bind(null, { cleanup: true }));
      
      // Catches ctrl+c event
      process.on('SIGINT', handleExit.bind(null, { exit: true }));
      
      // Catches "kill pid" (for example: nodemon restart)
      process.on('SIGUSR1', handleExit.bind(null, { exit: true }));
      process.on('SIGUSR2', handleExit.bind(null, { exit: true }));
      
      // Catches uncaught exceptions
      process.on('uncaughtException', handleExit.bind(null, { exit: true }));
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

