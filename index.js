const express = require("express");
const cors = require("cors");
const { initializeApp } = require('firebase/app');
const { getFirestore, collection } = require('firebase/firestore');
const { getDocs, doc, getDoc } = require("firebase/firestore");

const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.json());

const firebaseConfig = {
    apiKey: "AIzaSyByxWmFAzBrrcdaTlfi3UwCJ8SjmOWEIig",
    authDomain: "app-music-v001.firebaseapp.com",
    projectId: "app-music-v001",
    storageBucket: "app-music-v001.appspot.com",
    messagingSenderId: "987182830998",
    appId: "1:987182830998:web:bf2c74e1e6e9a12409f9b7"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const solarCollection = collection(db, "solar");

app.get("/", async (req, res, next) => {
    const snapshot = await getDocs(solarCollection);

    if (snapshot.empty) {
        return res.status(404).json({ message: 'No solar documents found.' });
    }

    const solarData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    res.status(200).json(solarData);
});

app.get("/:id", async (req, res, next) => {
    const { id } = req.params;

    const docRef = doc(solarCollection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return res.status(404).json({ message: 'Solar document not found.' });
    }

    res.status(200).json({
        id: docSnap.id,
        ...docSnap.data()
    });
});

const PORT = 80;
const server = app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});