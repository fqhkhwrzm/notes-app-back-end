const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        // Menerapkan CROSS ORIGIN RESOURCE SHARING
        // Supaya bisa berinteraksi jika terdapat perbedaan origin web server, sebagai contoh:
        // origin web server kita http://localhost:5000/ dg port 5000, tetapi origin
        // notesapp-v1.dicodingacademy.com mempunyai port 80
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // Guanakan route configuration pada server
    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
