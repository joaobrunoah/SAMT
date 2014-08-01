var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ParceiroSchema = new mongoose.Schema({
	imagemUrl: { type: String, required: false},
	nome: { type: String, required: true, index: { unique: true } },
    url: { type: String, required: false},
    directory: { type: String, required: false}
});

module.exports = mongoose.model('Parceiro', ParceiroSchema);