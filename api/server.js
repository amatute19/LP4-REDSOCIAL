//Importar paquetes y dependencias
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");  // Importar el paquete cors
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");


dotenv.config();//biblioteca para carga de variables de entorno desde archivos .env

//Conexion a la BD
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Conectado a la base de datos MongoDB");
    app.listen(5000, () => {
      console.log("Servidor corriendo en el puerto 5000");
    });
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos", error);
  });
  app.use("/images", express.static(path.join(__dirname, "public/images")));


// Habilitar CORS para permitir todas las solicitudes desde http://localhost:3000
app.use(cors()); 
app.use(cors({ origin: 'http://localhost:3000' }));


// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


//Subida de archivos con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("Archivo cargado correctamente");
  }catch(err){
    console.log(err);
  }
});


//Rutas
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
