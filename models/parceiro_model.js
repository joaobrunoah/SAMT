var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ParceiroSchema = new mongoose.Schema({
	imagemUrl: { type: String, required: true},
	nome: { type: String, required: false},
    url: { type: String, required: false},
    directory: { type: String, required: false}
});

module.exports = mongoose.model('ParceiroNoKey', ParceiroSchema);