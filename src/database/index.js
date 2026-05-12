const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://marianabarnabesilva_db_user:<marianabarnabesilva_db_user>@cluster0.4r41cmc.mongodb.net/api-node-js", {}, (error) => {
    if(error){
        console.log('Falha ao tentar autenticar com mongodb');
        console.log(error);
        return;
    }

    console.log('Conexão com mongodb estável');
});

mongoose.Promise = global.Promise;

module.exports = mongoose;