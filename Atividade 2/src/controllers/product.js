const db = require('../config/database');
const { ImgurClient } = require('imgur');
const dotenv = require('dotenv');
const { createReadStream } = require('fs');

exports.getAllProducts = async (req, res) => {
    if(req.query.hasOwnProperty('limit') && req.query.hasOwnProperty('offset')) {

        const { limit, offset } = req.query;
        try {
            const getAllProductsQuery = await db.query(
                "SELECT * FROM produtos LIMIT $1 OFFSET $2",
                [limit, offset]
            );
            if(getAllProductsQuery.rows.length !== 0) {
                res.status(200).send(
                    {
                        sucesso : 1,
                        produtos : getAllProductsQuery.rows,
                        qtde_produtos : getAllProductsQuery.rows.length
                    }
                );
            }
        }
        catch (err) {
            var errorMsg = "erro BD: ";-
                res.status(200).send(
                    {
                        sucesso : 0,
                        cod_erro : 2,
                        erro : errorMsg.concat(err)
                    }
                );
        }
    }
    else {
        var errorMsg = "faltam parametros";
        res.status(200).send(
            {
                sucesso : 0,
                cod_erro : 3,
                erro : errorMsg
            }
        );
    }
};


exports.addProduct = async (req, res) => {
    if('nome' in req.body && 'preco' in req.body && 'descricao' in req.body 
    && req.hasOwnProperty('file')) {
        const { nome, preco, descricao } = req.body;

        const imgurClient = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID });
        const imgurRes = await imgurClient.upload(
            {
                image: createReadStream(req.file.path),
                type: 'stream'
            }
        );
        if(imgurRes.status === 200) {
            try {
                const addProductQuery = await db.query(
                    "INSERT INTO produtos(nome, preco, descricao, img, usuarios_login) VALUES($1, $2, $3, $4, $5)",
                    [nome, preco, descricao, imgurRes.data.link, req.auth.user]
                );
                res.status(200).send(
                    {
                        sucesso : 1
                    }
                );
            }
            catch(err) {
                var erroMsg = "erro BD: ";
                res.status(200).send(
                    {
                        sucesso : 0,
                        cod_erro : 2,
                        erro : erroMsg.concat(err)
                    }
                );
            }
        }
        else {
            res.status(200).send(
                {
                    sucesso : 0,
                    cod_erro : 2,
                    erro : "erro IMGUR: falha ao subir imagem para o IMGUR"
                }
            );
        }
    }
    else {
        var erroMsg = "faltam parametros";
		res.status(200).send(
			{
				sucesso : 0,
				cod_erro : 3,
				erro : erroMsg
			}
		);
    }
};

// Novas funcionalidades
exports.pegarDetalhesProduto = async (req, res) => {
    const { product_id } = req.query;

    // Verifica se o ID foi fornecido
    if (!product_id) {
        return res.status(400).send({
            sucesso: 0,
            cod_erro: 3,
            erro: 'ID do produto não fornecido'
        });
    }

    try {
        // Consulta para buscar detalhes do produto
        const query = 'SELECT * FROM produtos WHERE id = $1';
        const result = await db.query(query, [product_id]);

        if (result.rows.length === 0) {
            return res.status(404).send({
                sucesso: 0,
                cod_erro: 4,
                erro: 'Produto não encontrado'
            });
        }

        // Retorna os detalhes do produto
        res.status(200).send({
            sucesso: 1,
            produto: result.rows[0]
        });
    } catch (err) {
        res.status(500).send({
            sucesso: 0,
            cod_erro: 2,
            erro: 'Erro ao buscar produto: ' + err.message
        });
    }
};

exports.atualizarProduto = async (req, res) => {
    const { product_id, nome, preco, descricao, img } = req.body;

    // Valida os dados recebidos
    if (!product_id || !nome || !preco || !descricao || !img) {
        return res.status(400).send({
            sucesso: 0,
            cod_erro: 3,
            erro: 'Dados incompletos. Certifique-se de enviar: product_id, nome, preco, descricao e img.'
        });
    }

    try {
        // Atualiza o produto no banco de dados
        const query = `
            UPDATE produtos 
            SET nome = $1, preco = $2, descricao = $3, img = $4 
            WHERE id = $5
        `;
        const result = await db.query(query, [nome, preco, descricao, img, product_id]);

        if (result.rowCount === 0) {
            return res.status(404).send({
                sucesso: 0,
                cod_erro: 4,
                erro: 'Produto não encontrado para atualização'
            });
        }

        res.status(200).send({
            sucesso: 1,
            message: 'Produto atualizado com sucesso'
        });
    } catch (err) {
        res.status(500).send({
            sucesso: 0,
            cod_erro: 2,
            erro: 'Erro ao atualizar produto: ' + err.message
        });
    }
};

exports.excluirProduto = async (req, res) => {
    const { product_id } = req.body;

    // Verifica se o ID foi fornecido
    if (!product_id) {
        return res.status(400).send({
            sucesso: 0,
            cod_erro: 3,
            erro: 'ID do produto não fornecido'
        });
    }

    try {
        // Exclui o produto no banco de dados
        const query = 'DELETE FROM produtos WHERE id = $1';
        const result = await db.query(query, [product_id]);

        if (result.rowCount === 0) {
            return res.status(404).send({
                sucesso: 0,
                cod_erro: 4,
                erro: 'Produto não encontrado para exclusão'
            });
        }

        res.status(200).send({
            sucesso: 1,
            message: 'Produto excluído com sucesso'
        });
    } catch (err) {
        res.status(500).send({
            sucesso: 0,
            cod_erro: 2,
            erro: 'Erro ao excluir produto: ' + err.message
        });
    }
};
