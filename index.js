const axios = require('axios');
const decifra = require('./Caesar.js')
const sha1 = require('js-sha1');
let fs = require('fs');
const token = "cc165f62d6fd57a977491bbe397f631a4bca785e"
const streamToBlob = require('stream-to-blob');
const Blob = require('blob');
const formData = require('form-data')

function getPosts() {
    axios
        .get(`https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${token}`)
        .then((res) => {
            const numCasas = res["data"]["numero_casas"]
            const cifrado = res["data"]["cifrado"]
            const decifrado = decifra(cifrado, numCasas);
            res["data"]["decifrado"] = decifrado;
            res["data"]["resumo_criptografico"] = sha1(decifrado);
            // fs.writeFile("./answer.json", JSON.stringify(res["data"], null, 4), function (err) { console.log('Arquivo Criado') });
            sendFile(res["data"])
        })
        .catch((err) => {
            console.error(err)
        });
};

async function sendFile(obj) {
    let data = new formData()
    data.append('numero_casas', obj.numero_casas)
    data.append('token', obj.token)
    data.append('cifrado', obj.cifrado)
    data.append('decifrado', obj.decifrado)
    data.append('resumo_criptografico', obj.resumo_criptografico)
    // console.log(data)
    // let formDataToBufferObject = formDataToBuffer( data );
    axios.post(`https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${token}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then((res) => console.log(res)).catch((err) => console.log(err));
}

getPosts()




function formDataToBuffer( formData ) {
    let dataBuffer = new Buffer( 0 );
    let boundary   = formData.getBoundary();
    for( let i = 0, len = formData._streams.length; i < len; i++ ) {

        if( typeof formData._streams[i] !== 'function' ) {

            dataBuffer = bufferWrite( dataBuffer, formData._streams[i] );

            if( typeof formData._streams[i] !== 'string' || formData._streams[i].substring( 2, boundary.length + 2 ) !== boundary ) {
                dataBuffer = bufferWrite( dataBuffer, "\r\n" );
            }
        }
    }

    // Close the request
    dataBuffer = bufferWrite( dataBuffer, '--' + boundary + '--' );

    return dataBuffer;
}

// Below function appends the data to the Buffer.
function bufferWrite( buffer, data ) {

    let addBuffer;
    if( typeof data === 'string' ) {
        addBuffer = Buffer.from( data );
    }
    else if( typeof data === 'object' && Buffer.isBuffer( data ) ) {
        addBuffer = data;
    }

    return Buffer.concat( [buffer, addBuffer] );
}