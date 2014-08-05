var express = require('express');
var app = express();

var formidable = require('formidable');
var util = require('util');
var inspect = util.inspect;
var fs = require('fs-extra');
var qt = require('quickthumb');

var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var jwtauth = require('./lib/jwtauth');
var url = require('url');
var variables = require('./lib/samt_variables');

// To handle Multipart requests
var Busboy = require('busboy');

// MongoDB Models
var User = require('./models/user_model');
var Parceiro = require('./models/parceiro_model');
var Noticia = require('./models/noticia_model');
var Evento = require('./models/evento_model');
var Projeto = require('./models/projeto_model');

mongoose.connect('localhost');

app.set('port', process.env.PORT || 80);
app.set('jwtTokenSecret',variables.tokenSecret);
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser());
app.use(qt.static(__dirname + '/public/img/'));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

// Middleware to check authentication
var requireAuth = function(req,res,next) {
	if(!req.user) {
		res.send(401,'Not authorized');
	} else {
		next();
	}
};

var clearText = function(text){
    var clean = text.replace(/'/g,"");
    clean = clean.replace(/\\(.)\\(.)/g,'\n');
    return clean;
};

//Insert first user
var adminUser = new User({
	username: 'admin',
	password: 'alomamae12'
});

User.findOne({username:adminUser.username},function(err,user){
    if(user){

    } else {
        adminUser.save(function (err) {
            if (err) throw err;
        });
    }
});

// REQUESTS

// REQUESTS FROM PARCEIROS
app.get('/api/parceiros', function(req, res, next) {
    var query = Parceiro.find();
    query.limit(100);

    query.exec(function(err, parceiros) {
        if (err) return next(err);
        res.send(parceiros);
    });
});

app.get('/api/parceiros/:id', function(req, res, next) {
    Parceiro.findById(req.params.id, function(err, parceiros) {
        if (err) return next(err);
        res.send(parceiros);
    });
});

app.post('/api/parceiros', jwtauth, requireAuth, function (req, res){

    var busboy = new Busboy({headers:req.headers});
    var imgDir = "";
    var nome = "";
    var url = "";
    var imgDir2web = "";
    var saveTo = "";

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        var appDir = path.dirname(require.main.filename);
        imgDir = "public" + path.sep + "img" + path.sep + "parceiros" + path.sep + filename;
        imgDir2web = "img/parceiros/" + filename;
        saveTo = appDir + path.sep + imgDir;
        console.log("Saving file in: " + saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        if(fieldname == 'nome'){
            nome = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'url') {
            url = inspect(val).replace(/'/g,"");
        }
    });
    busboy.on('finish', function() {
        console.log('Saving object in parceiros!');
        var parceiro = new Parceiro({
            nome:nome,
            url:url,
            imagemUrl:imgDir2web,
            directory:saveTo
        });

        parceiro.save();
        res.writeHead(200, { Connection: 'close' });
        res.end();
    });

    req.pipe(busboy);
});

app.put('/api/parceiros/:id', jwtauth, requireAuth, function (req, res){

    var busboy = new Busboy({headers:req.headers});
    var imgDir = "";
    var nome = "";
    var url = "";
    var imgDir2web = "";
    var saveTo = "";

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        var appDir = path.dirname(require.main.filename);
        imgDir = "public" + path.sep + "img" + path.sep + "parceiros" + path.sep + filename;
        imgDir2web = "img/parceiros/" + filename;
        saveTo = appDir + path.sep + imgDir;
        console.log("Saving file in: " + saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        if(fieldname == 'nome'){
            nome = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'url') {
            url = inspect(val).replace(/'/g,"");
        }
    });
    busboy.on('finish', function() {
        console.log('Updating object in parceiros!');
        Parceiro.findById(req.params.id,function(err,parceiro){
                if(!err){
                    parceiro.nome = nome;
                    parceiro.url = url;
                    if(imgDir2web!=""){
                        parceiro.directory=saveTo;
                        parceiro.imagemUrl=imgDir2web;
                    }
                    parceiro.save();
                    res.writeHead(200, { Connection: 'close' });
                    res.end();
                }
            });

    });

    req.pipe(busboy);
});

app.delete('/api/parceiros/:id', bodyParser(), jwtauth, requireAuth, function(req, res, next) {
	console.log(req.params.id);
	Parceiro.findById(req.params.id,function(err,parceiro){
		if(err) console.log(err);
		try{
            try {
                fs.remove(parceiro.directory, function (err) {
                    console.log("Could not remove image from " + parceiro.nome);
                });
            } catch (err2) {
                console.log(err2.message);
            }
			parceiro.remove();
			res.send(200);
		} catch (err) {
			res.send(500,err.message);
		}
		
	})
	
});

// END OF REQUESTS FROM PARCEIROS

// REQUESTS FROM NOTICIAS

app.get('/api/noticias', function(req, res, next) {
	Noticia.count({}, function(err,result){
        if (err){
            console.log(err.message);
            return res.send(500,err.message);
        }
        var query = Noticia.find();
        query.limit(1000);
        query.exec(function(err, noticias) {
            if (err) return next(err);
            var object = {elementos:noticias,count:result};
            console.log(object);
            res.send(object);
        });
    });
});

app.get('/api/noticias/:id', function(req, res, next) {
	  Noticia.findById(req.params.id, function(err, noticias) {
	    if (err) return next(err);
	    res.send(noticias);
	  });
});

app.post('/api/noticias', jwtauth, requireAuth, function (req, res){

    var busboy = new Busboy({headers:req.headers});
    var imgDir = "";
    var titulo = "";
    var resumo = "";
    var texto = "";
    var data = Date.now();
    var distanceTop = 0;
    var imgDir2web = "";
    var saveTo = "";

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        var appDir = path.dirname(require.main.filename);
        imgDir = "public" + path.sep + "img" + path.sep + "noticias" + path.sep + filename;
        imgDir2web = "img/noticias/" + filename;
        saveTo = appDir + path.sep + imgDir;
        console.log("Saving file in: " + saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        if(fieldname == 'titulo'){
            titulo = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'resumo') {
            resumo = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'texto') {
            texto = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'distanceTop') {
            distanceTop = inspect(val).replace(/'/g,"");
            if(distanceTop=='undefined'){
                distanceTop = 0;
            }
        }
    });
    busboy.on('finish', function() {
        console.log('Saving object in noticias!');
        var noticia = new Noticia({
            titulo:titulo,
            resumo:resumo,
            texto:texto,
            data:data,
            imagemUrl:imgDir2web,
            directory:saveTo,
            distanceTop:distanceTop
        });

        noticia.save(function (err, product, numberAffected) {
            if (err) return res.send(500,err.message);
            res.writeHead(200, { Connection: 'close' });
            res.end();
        });

    });

    req.pipe(busboy);
});

app.put('/api/noticias/:id', jwtauth, requireAuth, function (req, res){

    var busboy = new Busboy({headers:req.headers});
    var imgDir = "";
    var titulo = "";
    var resumo = "";
    var texto = "";
    var distanceTop = 0;
    var imgDir2web = "";
    var saveTo = "";

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        var appDir = path.dirname(require.main.filename);
        imgDir = "public" + path.sep + "img" + path.sep + "noticias" + path.sep + filename;
        imgDir2web = "img/noticias/" + filename;
        saveTo = appDir + path.sep + imgDir;
        console.log("Saving file in: " + saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        if(fieldname == 'titulo'){
            titulo = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'resumo') {
            resumo = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'texto') {
            texto = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'distanceTop') {
            distanceTop = inspect(val).replace(/'/g,"");
            if(distanceTop=='undefined'){
                distanceTop = 0;
            }
        }
    });
    busboy.on('finish', function() {
        console.log('Updating object in noticias!');
        Noticia.findById(req.params.id,function(err,noticia){
            if(!err){
                noticia.titulo=titulo;
                noticia.resumo=resumo;
                noticia.texto=texto;
                noticia.distanceTop=distanceTop;
                if(imgDir2web!=""){
                    noticia.directory=saveTo;
                    noticia.imagemUrl=imgDir2web;
                }

                noticia.save(function (err, product, numberAffected) {
                    if (err) return res.send(500,err.message);
                    res.writeHead(200, { Connection: 'close' });
                    res.end();
                });
            }
        });

    });

    req.pipe(busboy);
});

app.delete('/api/noticias/:id', bodyParser(), jwtauth, requireAuth, function(req, res, next) {
    console.log(req.params.id);
    Noticia.findById(req.params.id,function(err,noticia){
        if(err) console.log(err);
        try{
            try {
                fs.remove(noticia.directory, function (err) {
                    console.log("Could not remove image from " + noticia.titulo);
                });
            } catch (err2) {
                console.log(err2.message);
            }
            noticia.remove();
            res.send(200);
        } catch (err) {
            res.send(500,err.message);
        }
    })

});

// END OF REQUESTS FROM NOTICIAS

// REQUESTS FROM EVENTOS
app.get('/api/eventos', function(req, res, next) {

    Evento.count({}, function(err,result){
        if (err){
            console.log(err.message);
            return res.send(500,err.message);
        }
        var query = Evento.find();
        query.limit(1000);
        query.exec(function(err, eventos) {
            if (err) return next(err);
            var object = {elementos:eventos,count:result};
            console.log(object);
            res.send(object);
        });
    });
});

app.get('/api/eventos/:id', function(req, res, next) {
	  Evento.findById(req.params.id, function(err, eventos) {
	    if (err) return next(err);
	    res.send(eventos);
	  });
	});

app.post('/api/eventos', jwtauth, requireAuth, function (req, res){

    var busboy = new Busboy({headers:req.headers});
    var imgDir = "";
    var titulo = "";
    var resumo = "";
    var texto = "";
    var local = "";
    var data = "";
    var distanceTop = 0;
    var imgDir2web = "";
    var saveTo = "";

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        var appDir = path.dirname(require.main.filename);
        imgDir = "public" + path.sep + "img" + path.sep + "eventos" + path.sep + filename;
        imgDir2web = "img/eventos/" + filename;
        saveTo = appDir + path.sep + imgDir;
        console.log("Saving file in: " + saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        if(fieldname == 'titulo'){
            titulo = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'resumo') {
            resumo = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'texto') {
            texto = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'local') {
            local = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'data') {
            data = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'distanceTop') {
            distanceTop = inspect(val).replace(/'/g,"");
            if(distanceTop=='undefined'){
                distanceTop = 0;
            }
        }
    });
    busboy.on('finish', function() {
        console.log('Saving object in eventos!');
        var evento = new Evento({
            titulo:titulo,
            resumo:resumo,
            texto:texto,
            local:local,
            data:data,
            imagemUrl:imgDir2web,
            directory:saveTo,
            distanceTop:distanceTop
        });

        evento.save(function (err, product, numberAffected) {
            if (err) return res.send(500,err.message);
            res.writeHead(200, { Connection: 'close' });
            res.end();
        });

    });

    req.pipe(busboy);
});

app.put('/api/eventos/:id', jwtauth, requireAuth, function (req, res){

    var busboy = new Busboy({headers:req.headers});
    var imgDir = "";
    var titulo = "";
    var resumo = "";
    var texto = "";
    var local = "";
    var data = "";
    var distanceTop = 0;
    var imgDir2web = "";
    var saveTo = "";

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        var appDir = path.dirname(require.main.filename);
        imgDir = "public" + path.sep + "img" + path.sep + "eventos" + path.sep + filename;
        imgDir2web = "img/eventos/" + filename;
        saveTo = appDir + path.sep + imgDir;
        console.log("Saving file in: " + saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        if(fieldname == 'titulo'){
            titulo = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'resumo') {
            resumo = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'texto') {
            texto = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'local') {
            local = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'data') {
            data = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'distanceTop') {
            distanceTop = inspect(val).replace(/'/g,"");
            if(distanceTop=='undefined'){
                distanceTop = 0;
            }
        }
    });
    busboy.on('finish', function() {
        console.log('Updating object in eventos!');
        Evento.findById(req.params.id,function(err,evento){
            if(!err){
                evento.local=local;
                evento.data=data;
                evento.titulo=titulo;
                evento.resumo=resumo;
                evento.texto=texto;
                evento.distanceTop=distanceTop;
                if(imgDir2web!=""){
                    evento.directory=saveTo;
                    evento.imagemUrl=imgDir2web;
                }
                evento.save(function (err, product, numberAffected) {
                    if (err) return res.send(500,err.message);
                    res.writeHead(200, { Connection: 'close' });
                    res.end();
                });
            }
        });

    });

    req.pipe(busboy);
});

app.delete('/api/eventos/:id', bodyParser(), jwtauth, requireAuth, function(req, res, next) {
    console.log(req.params.id);
    Evento.findById(req.params.id,function(err,evento){
        if(err) console.log(err);
        try{
            try {
                fs.remove(evento.directory, function (err) {
                    console.log("Could not remove image from " + evento.titulo);
                });
            } catch (err2) {
                console.log(err2.message);
            }
            evento.remove();
            res.send(200);
        } catch (err) {
            res.send(500,err.message);
        }
    })

});

//END OF REQUESTS FROM EVENTOS

// REQUESTS FROM PROJETOS

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

app.post('/api/projetos', jwtauth, requireAuth, function (req, res){

    var busboy = new Busboy({headers:req.headers});
    var imgDir = "";
    var nome = "";
    var resumo = "";
    var texto = "";
    var distanceTop = 0;
    var imgDir2web = "";
    var saveTo = "";

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        var appDir = path.dirname(require.main.filename);
        imgDir = "public" + path.sep + "img" + path.sep + "projetos" + path.sep + filename;
        imgDir2web = "img/projetos/" + filename;
        saveTo = appDir + path.sep + imgDir;
        console.log("Saving file in: " + saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + val);
        if(fieldname == 'nome'){
            nome = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'resumo') {
            resumo = clearText(inspect(val));
        } else if (fieldname == 'texto') {
            texto = clearText(inspect(val));
        } else if (fieldname == 'distanceTop') {
            distanceTop = inspect(val).replace(/'/g,"");
            if(distanceTop=='undefined'){
                distanceTop = 0;
            }
        }
    });
    busboy.on('finish', function() {
        console.log('Saving object in projetos!');
        var projeto = new Projeto({
            nome:nome,
            resumo:resumo,
            texto:texto,
            imagemUrl:imgDir2web,
            directory:saveTo,
            distanceTop:distanceTop
        });

        projeto.save(function (err, product, numberAffected) {
            if (err) return res.send(500,err.message);
            res.writeHead(200, { Connection: 'close' });
            res.end();
        });
    });

    req.pipe(busboy);
});

app.put('/api/projetos/inserircursos/:id', jwtauth, requireAuth, function (req, res){

    Projeto.findById(req.params.id,function(err,projeto){
        if(err) return res.send(500,"Projeto Não Encontrado");
        projeto.cursos = req.body.cursos;

        projeto.save(function (err, product, numberAffected) {
            if (err) {
                console.log(err.message);
                return res.send(500,err.message);
            }
            res.writeHead(200, { Connection: 'close' });
            res.end();
        })
    })
});

app.put('/api/projetos/:id', jwtauth, requireAuth, function (req, res){

    var busboy = new Busboy({headers:req.headers});
    var imgDir = "";
    var nome = "";
    var resumo = "";
    var texto = "";
    var distanceTop = 0;
    var imgDir2web = "";
    var saveTo = "";

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        var appDir = path.dirname(require.main.filename);
        imgDir = "public" + path.sep + "img" + path.sep + "projetos" + path.sep + filename;
        imgDir2web = "img/projetos/" + filename;
        saveTo = appDir + path.sep + imgDir;
        console.log("Saving file in: " + saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + val);
        if(fieldname == 'nome'){
            nome = inspect(val).replace(/'/g,"");
        } else if (fieldname == 'resumo') {
            resumo = clearText(inspect(val));
        } else if (fieldname == 'texto') {
            texto = clearText(inspect(val));
        } else if (fieldname == 'distanceTop') {
            distanceTop = inspect(val).replace(/'/g,"");
            if(distanceTop=='undefined'){
                distanceTop = 0;
            }
        }
    });
    busboy.on('finish', function() {
        console.log('Updating object in projetos!');
        Projeto.findById(req.params.id,function(err,projeto){
            if(!err){
                projeto.nome=nome;
                projeto.resumo=resumo;
                projeto.texto=texto;
                projeto.distanceTop=distanceTop;
                if(imgDir2web!=""){
                    projeto.directory=saveTo;
                    projeto.imagemUrl=imgDir2web;
                }

                projeto.save(function (err, product, numberAffected) {
                    if (err) {
                        console.log(err.message);
                        return res.send(500,err.message);
                    }
                    res.writeHead(200, { Connection: 'close' });
                    res.end();
                });
            }
        });

    });

    req.pipe(busboy);
});

app.delete('/api/projetos/:id', bodyParser(), jwtauth, requireAuth, function(req, res, next) {
    console.log(req.params.id);
    Projeto.findById(req.params.id,function(err,projeto){
        if(err) console.log(err);
        try{
            try {
                fs.remove(projeto.directory, function (err) {
                    console.log("Could not remove image from " + projeto.nome);
                });
            } catch (err2) {
                console.log(err2.message);
            }
            projeto.remove();
            res.send(200);
        } catch (err) {
            res.send(500,err.message);
        }
    })

});

// END OF REQUESTS FROM PROJETOS


// REQUESTS FROM USUARIO

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

app.put('/api/user/mudar_senha', bodyParser(), jwtauth, requireAuth, function(req,res,next){
    var usuario = req.body.usuario;
    var senha_antiga = req.body.senha_antiga;
    var senha_nova = req.body.senha_nova;
    User.findOne({username: usuario}, function(err,user){
        if(err) return res.send(401,"Banco de Dados indisponível");
        if(!user) return res.send(401,"Usuário não encontrado");

        user.comparePassword(senha_antiga, function(err,isMatch){
            if(err || !isMatch) return res.send(401,"Senha Antiga não confere");

            user.password = senha_nova;
            user.save();
            return res.send(200,"Senha Alterada com Sucesso");
        })

    });
});

app.post('/api/user/add', bodyParser(), jwtauth, requireAuth, function(req,res,next){
    var usuario = req.body.usuario;
    var senha = req.body.senha;

    User.findOne({username: usuario}, function(err,user){
        if(err) return res.send(401,"Banco de Dados indisponível");
        if(user) return res.send(401,"Usuário já existente");

        var user = new User({
            username:usuario,
            password:senha
        });

        user.save();
        res.send(200,"Usuário Cadastrado com Sucesso");
    });
});