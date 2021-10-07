const https = require('https')
const pem = require('pem')
const debug = require('debug')('express-cluster:server');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const app = require('./src/app')

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    cluster.on('exit', (worker, code, signal) => {
        if (worker.suicide === true) {
            console.log(`${new Date()} Worker ${worker.process.pid} committed suicide`);
            cluster.fork();
        }
    });
} else {
    pem.createCertificate({ days: 1, selfSigned: true }, async (err, keys) => {
        if (err) {
            throw err
        }
        const options = {
            key: keys.clientKey,
            cert: keys.certificate
        }
        
        const server = https.createServer(options, app);
        
        server.listen(443)
        
        server.on('error', onError);
        server.on('listening', onListening);
        console.log(`Worker ${process.pid} started`);
        
        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }
            
            const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;
            
            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                default:
                throw error;
            }
        }
        
        function onListening() {
            const addr = server.address();
            const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
            debug('Listening on ' + bind);
        }
    })
}
