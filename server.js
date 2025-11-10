const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
  
const upload = multer({ storage: storage });

let shapes = [
    {
        "_id": 1,
        "name": "Crimped Tetrahedron",
        "angle": 122.601252,
        "symmetry": "Tetrahedral",
        "discovery": "me",
        "faces": 16,
        "vertices": 22,
        "edges": 36,
        "families": ["tetrahedral", "crimped"],
        "img": "CTetra.jpg"
    },
    {
        "_id": 2,
        "name": "Standard Crimped Cube",
        "angle": 134.351303,
        "symmetry": "Octahedral",
        "discovery": "me",
        "faces": 30,
        "vertices": 44,
        "edges": 72,
        "families": ["cubic", "crimped"],
        "img": "CCube.jpg"
    },
    {
        "_id": 3,
        "name": "Alternating Crimped Cube",
        "angle": 134.351303,
        "symmetry": "Tetrahedral",
        "discovery": "me",
        "faces": 18,
        "vertices": 20,
        "edges": 36,
        "families": ["cubic", "crimped"],
        "img": "ACCube.jpg"
    },
    {
        "_id": 4,
        "name": "Crimped Octahedron",
        "angle": 141.310552,
        "symmetry": "Octahedral",
        "discovery": "me",
        "faces": 32,
        "vertices": 42,
        "edges": 72,
        "families": ["octahedral", "crimped"],
        "img": "COcta.jpg"
    },
    {
        "_id": 5,
        "name": "Crimped Dodecahedron",
        "angle": 148.197077,
        "symmetry": "Icosahedral",
        "discovery": "me",
        "faces": 72,
        "vertices": 110,
        "edges": 180,
        "families": ["dodecahedral", "crimped"],
        "img": "CDodec.jpg"
    },
    {
        "_id": 6,
        "name": "Crimped Icosahedron",
        "angle": 156.350686,
        "symmetry": "Icosahedral",
        "discovery": "me",
        "faces": 80,
        "vertices": 102,
        "edges": 180,
        "families": ["icosahedral", "crimped"],
        "img": "CIcosa.jpg"
    },
    {
        "_id": 7,
        "name": "3-Way Crimped Rhombic Dodecahedron",
        "angle": 149.936840,
        "symmetry": "Octahedral",
        "discovery": "me",
        "faces": 36,
        "vertices": 38,
        "edges": 72,
        "families": ["rhombic dodecahedral", "crimped"],
        "img": "3CRDodec.jpg"
    },
    {
        "_id": 8,
        "name": "4-Way Crimped Rhombic Dodecahedron",
        "angle": 147.830607,
        "symmetry": "Octahedral",
        "discovery": "me",
        "faces": 36,
        "vertices": 38,
        "edges": 72,
        "families": ["rhombic dodecahedral", "crimped"],
        "img": "4CRDodec.jpg"
    }
];

app.get("/api/shapes/", (req, res)=>{
    console.log("in get request");
    res.send(shapes);
});

app.get("/api/shapes/:id", (req, res)=>{
    const shape = shapes.find((shape)=>shape._id === parseInt(req.params.id));
    res.send(shape);
});

app.listen(3001, ()=>{
    console.log("server active");
});