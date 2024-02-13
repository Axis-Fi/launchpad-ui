import express from "express";
import { getData, storeData } from "./ipfs";

const app = express();

app.get("/ipfs", async (req, res) => {
    const ipfsHash = req.query["hash"] as string;
    if (!ipfsHash) {
        return res.status(400);
    }

    // Fetch the object from IPFS
    const response = await getData(ipfsHash);

    res.json(response);
});

app.post("/ipfs", async (req, res) => {
    const object = req.body as string;

    // Store the object in IPFS
    const ipfsHash = await storeData(object);

    res.json({ hash: ipfsHash });
});
