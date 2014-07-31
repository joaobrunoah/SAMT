var express = require('express');
var app = express();

var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');
var qt = require('quickthumb');

var path = require('path');
var logger = require('morgan');
var cookieParser aaa= require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user_model');
var jwt = require('jwt-simple');
var jwtauth = require('./lib/jwtauth');
var url = require('url');
var variables = require('./lib/samt_variables');

// UPLOAD IMAGE

app.use(qt.static(__dirname + '/'));



// END UPLOAD IMAGE

app.post('/upload', function (req, res){
	  var form = new formidable.IncomingForm();
	  form.parse(req, function(err, fields, files) {
	    res.writeHead(200, {'content-type': 'text/plain'});
	    res.write('received upload:\n\n');
	    res.end(util.inspect({fields: fields, files: files}));
	  });

	  form.on('end', function(fields, files) {
	    /* Temporary location of our uploaded file */
	    var temp_path = this.openedFiles[0].path;
	    /* The file name of the uploaded file */
	    var file_name = this.openedFiles[0].name;
	    /* Location where we want to copy the uploaded file */
	    var new_location = 'img/uploads/';

	    fs.copy(temp_path, new_location + file_name, function(err) {  
	      if (err) {
	        console.error(err);
	      } else {
	        console.log("success!")
	      }
	    });
	  });
	});

//SCHEMES DO MONGODB
var parceiroSchema = new mongoose.Schema({
	_id: Number,
	imagemUrl: String,
	nome: String,
	url: String
});

var noticiaSchema = new mongoose.Schema({
	_id: Number,
	imagemUrl: String,
	titulo: String,
	resumo: String,
	texto: String,
	data: Date
});

var eventoSchema = new mongoose.Schema({
	_id: Number,
	imagemUrl: String,
	titulo: String,
	resumo: String,
	data: Date
});

var projetoSchema = new mongoose.Schema({
	_id: Number,
	imagemUrl: String,
	nome: String,
	resumo: String
});

var Parceiro = mongoose.model('Parceiro',parceiroSchema);
var Noticia = mongoose.model('Noticia',noticiaSchema);
var Evento = mongoose.model('Evento',eventoSchema);
var Projeto = mongoose.model('Projeto',projetoSchema);

mongoose.connect('localhost');

app.set('port', process.env.PORT || 80);
app.set('jwtTokenSecret',variables.tokenSecret);
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

var requireAuth = function(req,res,next) {
	if(!req.user) {
		res.send(401,'Not authorized');
	} else {
		next();
	}
}

app.get('/api/parceiros', function(req, res, next) {
	var query = Parceiro.find();
	query.limit(100);

	query.exec(function(err, parceiros) {
		if (err) return next(err);
		res.send(parceiros);
	});
});

//app.post('/api/parceiros', bodyParser(), jwtauth, requireAuth, function(req, res, next) {
//	
//	Parceiro.count({}, function( err, count){
//				
//		if(err){
//			return next(err);
//		}
//				
//		var parceiro = new Parceiro({
//			_id:count+1,
//			nome:req.body.nome,
//			imagemUrl:req.body.imagemUrl,
//			url:req.body.url
//		});
//	
//		parceiro.save(function(err) {
//			if(err) {
//				return next(err);
//			}
//			res.send(200);
//		});
//	});
//	
//});

app.post('/api/parceiros', bodyParser(), jwtauth, requireAuth, function(req, res, next) {
	
	console.log(req.files.displayImage.size);
	res.send(200);
	
});

app.delete('/api/parceiros/:id', bodyParser(), jwtauth, requireAuth, function(req, res, next) {
	console.log(req.params.id);
	Parceiro.findById(req.params.id,function(err,parceiro){
		if(err) console.log(err);
		try{
			parceiro.remove();
			res.send(200);
		} catch (err) {
			res.send(500,err.message);
		}
		
	})
	
});

app.get('/api/noticias', function(req, res, next) {
	var query = Noticia.find();
	query.limit(10);
	query.exec(function(err, noticias) {
		if (err) return next(err);
		res.send(noticias);
	});
});

app.get('/api/noticias/:id', function(req, res, next) {
	  Noticia.findById(req.params.id, function(err, noticias) {
	    if (err) return next(err);
	    res.send(noticias);
	  });
});

app.post('/api/noticias', bodyParser(), jwtauth, requireAuth, function(req, res, next) {

	Noticia.count({}, function( err, count){
		
		if(err){
			return next(err);
		}
		
		var noticia = new Noticia({
			_id:count+1,
			imagemUrl: req.body.imagemUrl,
			titulo: req.body.titulo,
			resumo: req.body.resumo,
			texto: req.body.texto,
			data:new Date()
		});

		noticia.save(function(err) {
			if(err) {
				return next(err);
			}
			res.send(200);
		});

	});

});

app.get('/api/eventos', function(req, res, next) {
	var query = Evento.find();
	query.limit(10);
	query.exec(function(err, eventos) {
		if (err) return next(err);
		res.send(eventos);
	});
});

app.get('/api/eventos/:id', function(req, res, next) {
	  Evento.findById(req.params.id, function(err, eventos) {
	    if (err) return next(err);
	    res.send(eventos);
	  });
	});

app.post('/api/eventos', bodyParser(), jwtauth, requireAuth, function(req, res, next) {

	Evento.count({}, function( err, count){
		
		if(err){
			return next(err);
		}
		
		var evento = new Evento({
			_id:count+1,
			imagemUrl: req.body.imagemUrl,
			titulo: req.body.titulo,
			resumo: req.body.resumo,
			data:new Date()
		});

		evento.save(function(err) {
			if(err) {
				return next(err);
			}
			res.send(200);
		});

	});

});

app.get('/api/projetos', function(req, res, next) {
	var query = Projeto.find();
	query.limit(100);
	query.exec(function(err, projetos) {
		if (err) return next(err);
		res.send(projetos);
	});
});

app.get('/api/projetos/:id', function(req, res, next) {
	  Projeto.findById(req.params.id, function(err, projetos) {
	    if (err) return next(err);
	    res.send(projetos);
	  });
	});

app.post('/api/projetos', bodyParser(), jwtauth, requireAuth, function(req, res, next) {

	Projeto.count({}, function( err, count){
		
		if(err){
			return next(err);
		}
		
		var projeto = new Projeto({
			_id:count+1,
			imagemUrl: req.body.imagemUrl,
			nome: req.body.nome,
			resumo: req.body.resumo
		});

		projeto.save(function(err) {
			if(err) {
				return next(err);
			}
			res.send(200);
		});

	});

});

app.post('/api/login', function(req, res, next) {
	User.findOne({username: req.body.username }, function(err, user) {
	    if (err) return res.send(401);
	
	    if(!user) return res.send(401);
	    
	    // test a matching password
	    user.comparePassword(req.body.password, function(err, isMatch) {
	        if (err) return res.send(401);
	        if(!isMatch) return res.send(401);
	        
	        var expires = Date.now() + 1000*60*variables.minutos_para_expirar;
	        var token = jwt.encode({
	        	iss: user._id,
	        	exp: expires
	        }, app.get('jwtTokenSecret'));
	        res.json({
	        	'samtToken':token,
	        	'expires':expires
	        });
	    });
	});
});