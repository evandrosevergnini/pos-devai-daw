const router = require('express-promise-router')();
const basicAuth = require('express-basic-auth');

const productController = require('../controllers/product');

const auth = require('../controllers/auth');

const multer = require('multer');
const upload = multer({ dest : 'uploads'});

var challangeAuth = basicAuth( 
    {
        authorizer : auth.authenticate,
        authorizeAsync : true,
        unauthorizedResponse : { sucesso : 0, error: "usuario ou senha nao confere", cod_erro : 0 }
    }
);

router.get('/pegar_produtos', challangeAuth, productController.getAllProducts);
router.post('/criar_produto', challangeAuth, upload.single('img'), productController.addProduct);
// novas rotas implementadas
router.get('/pegar_detalhes_produto', challangeAuth, productController.pegarDetalhesProduto);
router.put('/atualizar_produto', challangeAuth, productController.atualizarProduto);
router.delete('/excluir_produto', challangeAuth, productController.excluirProduto);


module.exports = router;
