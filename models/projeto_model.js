var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var ProjetoSchema = new mongoose.Schema({
    imagemUrl: { type: String, required: true},
    directory: { type: String, required: true},
    nome: { type: String, required: true, index: { unique: true } },
    resumo: { type: String, required: true},
    texto: { type: String, required: true},
    distanceTop: {type:Number, required: false}
});

module.exports = mongoose.model('Projeto', ProjetoSchema);