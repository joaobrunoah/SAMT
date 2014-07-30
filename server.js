var TOKEN_MINUTES_TO_EXPIRE = 60;

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user_model');
var jwt = require('jwt-simple');
var jwtauth = require('./lib/jwtauth');
var url = require('url');
var app = express();

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
app.set('jwtTokenSecret','Eu_Tenho_Um_Segredo');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//var adminUser = new User({
//	username: 'admin',
//	password: 'alomamae12'
//})

//adminUser.save(function(err){
//	if (err) throw err;
//});

//fetch user and test password verification
//User.findOne({ username: 'admin' }, function(err, user) {
//    if (err) throw err;
//
//    // test a matching password
//    user.comparePassword('alomamae12', function(err, isMatch) {
//        if (err) throw err;
//        console.log('alomamae12:', isMatch); // -&gt; Password123: true
//    });
//
//    // test a failing password
//    user.comparePassword('123Password', function(err, isMatch) {
//        if (err) throw err;
//        console.log('123Password:', isMatch); // -&gt; 123Password: false
//    });
//});

app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

var requireAuth = function(req,res,next) {
	if(!req.user) {
		console.log("Empty User!");
		res.end('Not authorized',401);
	} else {
		next();
	}
}

app.get('/api/parceiros', function(req, res, next) {
	var query = Parceiro.find();
	query.limit(12);
	/*if (req.query.genre) {
	    query.where({ genre: req.query.genre });
	  } else if (req.query.alphabet) {
	    query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
	  } else {
	    query.limit(12);
	  }*/
	query.exec(function(err, parceiros) {
		if (err) return next(err);
		res.send(parceiros);
	});
});

app.post('/api/parceiros', bodyParser(), jwtauth, requireAuth, function(req, res, next) {
	
	Parceiro.count({}, function( err, count){
				
		if(err){
			return next(err);
		}
				
		var parceiro = new Parceiro({
			_id:count+1,
			nome:req.body.nome,
			imagemUrl:req.body.imagemUrl,
			url:req.body.url
		});
	
		parceiro.save(function(err) {
			if(err) {
				return next(err);
			}
			res.send(200);
		});
	});
	
});

app.get('/api/noticias', function(req, res, next) {
	var query = Noticia.find();
	query.limit(12);
	/*if (req.query.genre) {
	    query.where({ genre: req.query.genre });
	  } else if (req.query.alphabet) {
	    query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
	  } else {
	    query.limit(12);
	  }*/
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

app.post('/api/noticias', [bodyParser(), jwtauth], function(req, res, next) {

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
	query.limit(12);
	/*if (req.query.genre) {
	    query.where({ genre: req.query.genre });
	  } else if (req.query.alphabet) {
	    query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
	  } else {
	    query.limit(12);
	  }*/
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

app.post('/api/eventos', [bodyParser(), jwtauth], function(req, res, next) {

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
	query.limit(12);
	/*if (req.query.genre) {
	    query.where({ genre: req.query.genre });
	  } else if (req.query.alphabet) {
	    query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
	  } else {
	    query.limit(12);
	  }*/
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

app.post('/api/projetos', [bodyParser(), jwtauth],function(req, res, next) {

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
	        
	        var expires = Date.now() + 1000*60*TOKEN_MINUTES_TO_EXPIRE;
	        var token = jwt.encode({
	        	iss: user._id,
	        	exp: expires
	        }, app.get('jwtTokenSecret'));
	        res.json({
	        	'token':token,
	        	'expires':expires,
	        	user:user.toJSON()
	        });
	    });
	});
});