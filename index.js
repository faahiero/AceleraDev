const axios = require('axios');
const decifra = require('./Caesar.js')
const sha1 = require('js-sha1');
const fs = require('fs');
const token = "cc165f62d6fd57a977491bbe397f631a4bca785e"
const FormData = require('form-data')


function getJson() {
    axios
        .get(`https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${token}`)
        .then((res) => {
            const numCasas = res["data"]["numero_casas"]
            const cifrado = res["data"]["cifrado"]
            const decifrado = decifra(cifrado, numCasas);
            res["data"]["decifrado"] = decifrado;
            res["data"]["resumo_criptografico"] = sha1(decifrado);
            fs.writeFile("./answer.json", JSON.stringify(res["data"], null, 4), function (err) { console.log('Arquivo Criado') });
            sendJsonFile();
        })
        .catch((err) => {
            console.error(err)
        });
};


async function sendJsonFile() {
    const formData = new FormData();
    formData.append('answer', fs.createReadStream('./answer.json'));
    const res = await axios.post(`https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${token}`, formData,
        {
            // You need to use `getHeaders()` in Node.js because Axios doesn't
            // automatically set the multipart form boundary in Node.
            headers: formData.getHeaders()
        }).then((res) => console.log(res)).catch((err) => console.log(err));
}

getJson()