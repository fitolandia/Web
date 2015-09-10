    var express = require ('express');
    var mongoose = require('mongoose');
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var cloudinary = require('cloudinary');

    cloudinary.config({
        cloud_name: "dbyweozze",
        api_key: "444186294965343",
        api_secret: "WLGsZJxTFlf_BnjH--J1QCZn-8Q"
    });

    //servidor
    var app = express();
    app.set("view engine", "jade");

    //conexion a la base de datos
    mongoose.connect("mongodb://localhost/undersong");

    //Uso de Jade


    //declaro publica la carpeta public
    app.use(express.static("public"));


    //arreglo de consola para entender que carajo me esta mandando
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.use(multer({dest: 'uploads/'}));



    /*var storage = multer.diskStorage({
        destination: function(req,file,cb){
            cb(null, 'musicUpload/');
        },
        filename: function(req, file, cb){
            cb(null, Date.now()+file.originalname);
        }
    })*/
    /*var storage = multer({dest: 'uploads/'});
    var upload= multer({storage: storage});
    app.post ('/banda/longplay', upload.array('files',2), function(req, res, next){
        res.send({message: 'Archivos Guardados', files: req.files});
    });*/



    //esquema Usuario

    var usuarioSchema = {
        nombre:String,
        apellido:String,
        correo:String,
        contraseña: String,
        instrumento:String,
        fecha: Date
    };

    var Usuario=mongoose.model("Usuario",usuarioSchema);



    //creacion de disco en BD
    app.post("/inicio",function(solicitud,respuesta){
        var data={
            nombre:solicitud.body.nombre,
            apellido:solicitud.body.apellido,
            correo:solicitud.body.correo,
            contraseña:solicitud.body.contraseña,
            instrumento:solicitud.body.instrumento,
            fecha:Date

        };
        var persona = new Usuario(data);

        persona.save(function(err){
            console.log(persona);
            respuesta.render("index");

        });
    });

    //esquema de la BD
    var discoSchema = {
        titulo:String,
        temas:Array,
        imgUrl:String,
        descripcion:String
    };

    var Disco=mongoose.model("Disco",discoSchema);

    //Recorro la BD
    app.get("/banda/discografia",function(solicitud, respuesta){
        //call back
        Disco.find(function(error, documento){
            if(error){console.log(error);}
            respuesta.render("banda/discografia", { Discos: documento })
        });
    });

    /*app.post('/discografia', uploads.array('files', 2), function (req, res, next) {
        res.send({message:'Archivos guardados', files:req.files});
    });*/


    //creacion de disco en BD
    app.post("/discografia",function(solicitud,respuesta){
        var data={
            titulo:solicitud.body.titulo,
            temas:solicitud.body.temas,
            imgUrl:"data.png",
            descripcion:solicitud.body.descripcion
        };
        var disco = new Disco(data);

        cloudinary.uploader.upload(solicitud.files.image_avatar.path,
            function(result) {
                disco.imgUrl=result.url;
                disco.save(function(err){
                    console.log(disco);
                    respuesta.render("banda/longplay");
                });
            }
        );
    });

    /*var TemaSchema={
        tema:Array
    };

    app.post("/discografia"), function(solicitud, respuesta){
        var musica={
            pista: solicitud.body.tema
        };
        var Tema = new Musica(musica);

    };


    var Tema=mongoose.model("Tema",TemaSchema);
    app.get("/banda/discografia", function(solicitud, respuesta){
        Temas.find(function(error, documento){
            if(error){console.log(error);}
            respuesta.render("banda/discografia",{Tema: documento})
        });
    });*/




    //Inicio al login
    app.get("/",function(solicitud,respuesta){
        respuesta.render("index")
    });


    //Carpeta publica donde se alojan todas las imagenes publicas.
    app.use(express.static("public"));


    app.post("/discografia",function(solicitud,respuesta){
        console.log(solicitud.body);
        respuesta.render("banda/longplay")
    });


    app.get("/banda/discos", function(solicitud,respuesta){
        respuesta.render("banda/discos")
    });



    app.get("/banda/longplay", function(solicitud,respuesta){
        respuesta.render("banda/longplay")
    });

    console.log('server up');
    app.listen(8080);