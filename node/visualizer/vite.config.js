const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env


// export default defineConfig({
//         root: 'src/',
//     publicDir: '../static/',
//     base: './',
//     server: {
//         proxy: { "/api/v1": "http://localhost:5000",

//                 "/api/yt-click": "http://localhost:5000/dl-yt"
    
//     }
//     //   proxy: {
//     //     '/api/v1': {
//     //       target: 'http://localhost:5000/api/v1',
//     //       changeOrigin: true,
//     //       secure: tls.VERSION_TLSv1_2,
//     //       // Additional configurations if needed
//     //     },
//     //   },
//     },
//   });

export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',

    server:
    {
        
        host: true,
        open: !isCodeSandbox,
        cors: true,
        proxy: {
            '/api': {
                 target: 'https://localhost:5000',
                 changeOrigin: true,
                 secure: false,      
                 ws: true,
             }
        },
    },
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    }
}