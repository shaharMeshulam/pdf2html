const Prince = require("prince");

const html_to_pdf = require('html-pdf-node');
var pdf = require('html-pdf');
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const puppeteer = require('puppeteer')
 
// async function printPDF() {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto('https://blog.risingstack.com', {waitUntil: 'networkidle0'});
//   const pdf = await page.pdf({ format: 'A4' });
 
//   await browser.close();
//   return pdf
// }

const app = express();
const http = require('http').createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'public')))

app.use(cors());

app.post('/html2pdf', async (req, res) => {
    const html = req.body.html;
    try {
        const result = await createPdf(html);
        console.log('result', result)
        res.send({ result: result });
    } catch (e) {
        console.log('e:', e);
        res.send({ error: e });
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

// async function convertHTMLToPDF(html) {
//     // let file = { content: html };
//     // let options = { format: 'A4' };
//     const timeStamp = + new Date();
//     return await new Promise((resolve, reject)=> {
//         // html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
//         //     console.log("PDF Buffer:-", pdfBuffer);
//         //     resolve(pdfBuffer);
//         // }).catch(e => reject({e,file,options}));
//         pdf.create(html).toFile(`./public/${timeStamp}.pdf`, function(err, res) {
//             if (err) reject(err);
//             resolve(res); // { filename: '/app/businesscard.pdf' }
//           });
//     })
// }

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