const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const mongoose = require("mongoose");
const app = express();
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
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

mongoose
  .connect("mongodb+srv://zwetslootthomas_db_user:YeahWoo@monodihedrals.zteoioz.mongodb.net/")
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.error("could not connect ot mongodb...", err));

const shapeSchema = new mongoose.Schema({
    name:String,
    angle:Number,
    symmetry:String,
    discovery:String,
    faces:Number,
    vertices:Number,
    edges:Number,
    families:[String],
    trivia:String,
    img:String
});

const Shape = mongoose.model("Shape", shapeSchema);

// let shapes = [
//     {
//         "_id": 1,
//         "name": "Crimped Tetrahedron",
//         "angle": 122.601252,
//         "symmetry": "Tetrahedral",
//         "discovery": "me",
//         "faces": 16,
//         "vertices": 22,
//         "edges": 36,
//         "families": ["Tetrahedral", "Crimped"],
//         "trivia": "This is the first monodihedral polyhedron I discovered with sole intent of finding one, but the second I discovered overall. I found this one in hopes to assist the development of the program Michael Montgomery created (mentioned in the credits page). I had the idea to start from the geometry of a truncated triakis tetrahedron and managed to discover the geometry just before the program did.",
//         "img": "CTetra.jpg"
//     },
//     {
//         "_id": 2,
//         "name": "Standard Crimped Cube",
//         "angle": 134.351303,
//         "symmetry": "Octahedral",
//         "discovery": "me",
//         "faces": 30,
//         "vertices": 44,
//         "edges": 72,
//         "families": ["Cubic", "Crimped"],
//         "trivia": "",
//         "img": "CCube.jpg"
//     },
//     {
//         "_id": 3,
//         "name": "Alternating Crimped Cube",
//         "angle": 134.351303,
//         "symmetry": "Tetrahedral",
//         "discovery": "me",
//         "faces": 18,
//         "vertices": 20,
//         "edges": 36,
//         "families": ["Cubic", "Crimped"],
//         "trivia": "",
//         "img": "ACCube.jpg"
//     },
//     {
//         "_id": 4,
//         "name": "Crimped Octahedron",
//         "angle": 141.310552,
//         "symmetry": "Octahedral",
//         "discovery": "me",
//         "faces": 32,
//         "vertices": 42,
//         "edges": 72,
//         "families": ["Octahedral", "Crimped"],
//         "trivia": "",
//         "img": "COcta.jpg"
//     },
//     {
//         "_id": 5,
//         "name": "Crimped Dodecahedron",
//         "angle": 148.197077,
//         "symmetry": "Icosahedral",
//         "discovery": "me",
//         "faces": 72,
//         "vertices": 110,
//         "edges": 180,
//         "families": ["Dodecahedral", "Crimped"],
//         "trivia": "",
//         "img": "CDodec.jpg"
//     },
//     {
//         "_id": 6,
//         "name": "Crimped Icosahedron",
//         "angle": 156.350686,
//         "symmetry": "Icosahedral",
//         "discovery": "me",
//         "faces": 80,
//         "vertices": 102,
//         "edges": 180,
//         "families": ["Icosahedral", "Crimped"],
//         "trivia": "",
//         "img": "CIcosa.jpg"
//     },
//     {
//         "_id": 7,
//         "name": "3-Way Crimped Rhombic Dodecahedron",
//         "angle": 149.936840,
//         "symmetry": "Octahedral",
//         "discovery": "me",
//         "faces": 36,
//         "vertices": 38,
//         "edges": 72,
//         "families": ["Rhombic dodecahedral", "Crimped"],
//         "trivia": "",
//         "img": "3CRDodec.jpg"
//     },
//     {
//         "_id": 8,
//         "name": "4-Way Crimped Rhombic Dodecahedron",
//         "angle": 147.830607,
//         "symmetry": "Octahedral",
//         "discovery": "me",
//         "faces": 36,
//         "vertices": 38,
//         "edges": 72,
//         "families": ["Rhombic dodecahedral", "Crimped"],
//         "trivia": "",
//         "img": "4CRDodec.jpg"
//     }
// ];

app.get("/api/shapes/", async(req, res)=>{
    console.log("in get request");
    const shapes = await Shape.find();
    res.send(shapes);
});

app.get("/api/shapes/:id", (req, res)=>{
    const shape = shapes.find((shape)=>shape._id === parseInt(req.params.id));
    res.send(shape);
});

const validateShape = (shape) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.allow(""),
        angle: Joi.number().required(),
        symmetry: Joi.string().required(),
        discovery: Joi.string().required(),
        faces: Joi.number().required(),
        vertices: Joi.number().required(),
        edges: Joi.number().required(),
        families: Joi.allow(""),
        trivia: Joi.allow("")
    });
    console.log(schema.validate(shape));

    return schema.validate(shape);
};

app.post("/api/shapes", upload.single("img"), async(req, res)=>{
    const isValidShape = validateShape(req.body);
    console.log(isValidShape);

    if (!isValidShape || isValidShape.error) {
        res.status(400).send(isValidShape.error.details[0].message);
        return;
    }

    const shape = new Shape({
        name: req.body.name==="" ? "Unnamed" : req.body.name,
        angle: req.body.angle,
        symmetry: req.body.symmetry,
        discovery: req.body.discovery,
        faces: req.body.faces,
        vertices: req.body.vertices,
        edges: req.body.edges,
        families: [],
        //failies: req.body.families.split(","),
        trivia: req.body.trivia
    });

    if (req.file) {
        shape.img = req.file.filename;
        console.log(shape.img);
    }

    const newShape = await shape.save();
    res.status(200).send(shape);
});

app.put("/api/shapes/:id", upload.single("img"), async(req, res)=>{
    const isValidShape = validateShape(req.body);
    if (isValidShape.error) {
        res.status(400).send(isValidShape.error.details[0].message);
        return;
    }

    const fieldsToUpdate = {
        name: req.body.name==="" ? "Unnamed" : req.body.name,
        angle: req.body.angle,
        symmetry: req.body.symmetry,
        discovery: req.body.discovery,
        faces: req.body.faces,
        vertices: req.body.vertices,
        edges: req.body.edges,
        families: [],
        //failies: req.body.families.split(","),
        trivia: req.body.trivia
    }

    if (req.file) {
        fieldsToUpdate.img = req.file.filename;
    }

    const success = await Shape.updateOne({_id:req.params.id}, fieldsToUpdate);

    if (!success) {
        res.status(404).send("Couldn't find a shape with matching id");
        return;
    }

    const shape = await Shape.findById(req.params.id);
    res.status(200).send(shape);
});

app.delete("/api/shapes/:id", async(req, res)=>{
    const shape = await Shape.findByIdAndDelete(req.params.id);
    if (!shape) {
        res.status(404).send("Couldn't find a shape with a matching id");
        return;
    }

    res.status(200).send(shape);
});

app.listen(3001, ()=>{
    console.log("Server active");
});