const express = require('express'); //se carga la libreria .. con el required importo
const bodyparser = require('body-parser'); //se carga la libreria del bodyparser
const levelup = require('levelup');

const app = express(); // es un objeto q permite levantar un servidr
const db = levelup('./data',{valueEncoding:'json'}); //guardar en data, datos de tipo json

app.use(bodyparser.urlencoded({extended: true})); // es necesaria para q en el pos llegue el formulario en formato json, tranforma el formato e formulario a json
app.use(bodyparser.json());

const router =  express.Router(); // rutas reales de trabajo

router.get('/', (req, res) => { //para la ruta basica del sistema / responde un hola mundo //hacer un handler de una peticion** se pueden deinir mucha rutas
    // a router se le antepone /api: genera .- localhost:3000/api/
    // las api deben estar en un subdominio para esto introducimos un route
   //res.send('Hello World'); //en el response envia un hello World
  res.json({message:'hola sy un API de googlse'});
})
//router para enviar informacion
router.post('/movies',(req,res) => {//api/movies //aqui procesamos la data
  //console.log(req.body);
  const id = req.body.nombre.toLowerCase().split(" ").join("-");
  db.put(id,req.body,(err)=>{
    if (err) return  res.json({message:"hubo un error al guardar los datos"});
  });
  res.json({message: "la pelicula se grabo con exito"});
});
//hacer un get de todoas las peliculas
router.get('/movies',(req,res) => {
  let movies = [];
  db.createValueStream().on('data',(data)=>{
    movies.push(data);
  }).on('end',_ => {
    res.json(movies);
  });//cuand haya data
});

//router para obtener la pelicula
router.get('/movies/:id',(req,res)=>{
  if(req.params.id){
      db.get(req.params.id,(err,movie)=>{
        if (err) return res.json({message: "Hubo un error al obtener"});
          res.json(movie);
      });
  }

});

app.use('/api',router); // ahora entramos a esta ruta

const port =  process.env.PORT || 3000; // es como el else si no corre en el puerto 3000 puede correr en cualquier otro * no funciona hay q hacer una funcion

app.listen(3000,() =>{
  console.log('el server est cprriendo en el puerto 3000');
});
