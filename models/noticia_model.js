var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var NoticiaSchema = new mongoose.Schema({
	imagemUrl: { type: String, required: true},
	titulo: { type: String, required: true, index: { unique: true } },
	resumo: { type: String, required: true},
	texto: { type: String, required: true},
	data: { type: Date, required: true},
    distanceTop: {type:Number, required: false}
});

module.exports = mongoose.model('Noticia', NoticiaSchema);