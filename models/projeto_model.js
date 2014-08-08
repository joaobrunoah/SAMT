var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var ProjetoSchema = new mongoose.Schema({
    imagemUrl: { type: String, required: true},
    directory: { type: String, required: true},
    nome: { type: String, required: true, index: { unique: true } },
    resumo: { type: String, required: true},
    texto: { type: String, required: true},
    distanceTop: {type:Number, required: false},
    cursos: [{
        data: {type:Date, required: false},
        bairro: {type:String, required: false},
        local: {type:String, required: false}
    }],
    fotos: [{
        nome: {type:String,required:false},
        imagemUrl: {type:String,required:false}
    }]
});

module.exports = mongoose.model('Projeto', ProjetoSchema);