var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var LojaSchema = new mongoose.Schema({
    produtos: [{
        nome: {type:String,required:false},
        imagemUrl: {type:String,required:false}
    }]
});

module.exports = mongoose.model('Loja', LojaSchema);