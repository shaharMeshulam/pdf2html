const Prince = require("prince");
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const http = require('http').createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(cors());

app.post('/html2pdf', async (req, res) => {
    const html = req.body.html;
    try {
        const result = await createPdf(html);
        console.log('result', result)
        res.send({ result: result });
    } catch (e) {
        res.sendStatus(500);
    }
})

async function createPdf(html) {
    const filePath = await createHTMLFile(html);
    return await convertHTMLToPDF(filePath);
}

async function createHTMLFile(html) {
    const timeStamp = + new Date();
    return await new Promise((resolve, reject) => {
        try {
            fs.writeFileSync(`./public/${timeStamp}.html`, html);
            // file written successfully
            resolve(`./public/${timeStamp}.html`);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    })

}

async function convertHTMLToPDF(filePath) {
    const timeStamp = + new Date();
    return await new Promise((resolve, reject) => {
        Prince()
            .inputs(filePath)
            .output(`./public/${timeStamp}.pdf`)
            .execute()
            .then(function () {
                resolve(`${timeStamp}.pdf`);
            }, function (error) {
                reject("ERROR: ", error)
            })
    })
}

const port = process.env.PORT || 3030;
http.listen(port, () => {
    console.log('Server is running on port: ' + port);
})