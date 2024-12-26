const express = require("express");
const serverless = require('serverless-http');

const fileUpload = require("express-fileupload");
const { ServicePrincipalCredentials, PDFServices, MimeType, ExtractPDFParams, ExtractElementType, ExtractPDFJob, ExtractPDFResult } = require("@adobe/pdfservices-node-sdk");
const { Readable } = require("stream");
const AdmZip = require("adm-zip");

const app = express();

// Middleware to handle file uploads
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/extractpdftext", async (req, res) => {
    let readStream;
    try {
        if (!req.files || !req.files.pdf) {
            return res.status(400).json({ error: "PDF file is required" });
        }

        const pdfFile = req.files.pdf;

        // Convert uploaded file data to a readable stream
        readStream = Readable.from(pdfFile.data);

        // Initial setup, create credentials instance
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
        });

        // Creates a PDF Services instance
        const pdfServices = new PDFServices({ credentials });

        // Creates an asset(s) from source file(s) and upload
        const inputAsset = await pdfServices.upload({
            readStream,
            mimeType: MimeType.PDF
        });

        // Create parameters for the job
        const params = new ExtractPDFParams({
            elementsToExtract: [ExtractElementType.TEXT]
        });

        // Creates a new job instance
        const job = new ExtractPDFJob({ inputAsset, params });

        // Submit the job and get the job result
        const pollingURL = await pdfServices.submit({ job });
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: ExtractPDFResult
        });

        // Get content from the resulting asset(s)
        const resultAsset = pdfServicesResponse.result.resource;
        const streamAsset = await pdfServices.getContent({ asset: resultAsset });

        // Read ZIP content directly from memory
        const zipChunks = [];
        for await (const chunk of streamAsset.readStream) {
            zipChunks.push(chunk);
        }
        const zipBuffer = Buffer.concat(zipChunks);
        const zip = new AdmZip(zipBuffer);
        const jsondata = zip.readAsText('structuredData.json');
        const data = JSON.parse(jsondata);

        // Extracted data to be sent as a response
        const extractedText = data.elements
            .filter(element => element.Text != null) // Filter out null values
            .map(element => element.Text);

        return res.json({ extractedText });
    } catch (err) {
        console.error("Exception encountered while executing operation", err);
        return res.status(500).json({ error: "An error occurred while processing the PDF" });
    } finally {
        readStream?.destroy();
    }
});

module.exports.handler = serverless(app)