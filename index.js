const express = require('express');
const multer = require('multer');
const fs = require('fs')

const app = express();
app.use(express.json());

/* CONFIGURAÇÕES DO MULTER */
// STORAGE
const storage = multer.diskStorage(
    {
        destination:(req, file, cb)=>{
            cb(null, './uploads')
        },
        filename:(req, file, cb)=>{
            cb(null, Date.now().toString() + '_' + file.originalname)
        }
    }
);

// FILTER
const fileFilter = (req, file, cb)=>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
        cb (null, true);
    }
    else {
        cb (null, false);
    }
}

// UPLOAD
/*
storage
limits
filterFile
*/
const upload = multer(
    {
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    }
);

/* ROTA POST DE UPLOAD */
app.post('/upload', upload.array('imagem', 2), (req, res)=>{

    console.log(req.files)
    console.log(req.body.nome)
    console.log(req.body.email)
    res.send('UPLOAD EFETUADO COM SUCESSO!')

});

app.delete('/delete/:imagem', (req, res)=> {

    let {imagem} = req.params;
    let caminho = './uploads/' + imagem;

    fs.unlink(caminho, (error)=>{

        if (error) {
            res.send('ERRO AO EXCLUIR IMAGEM!')
            console.log('ERROR: ' + error)
        } else {
            res.send('IMAGEM EXCLUIDA COM SUCESSO!')
        }

    });

});

console.log(Date.now().toString());

app.listen(3000, ()=>{
    console.log('SERVIDOR RODANDO - http://localhost:3000')
})