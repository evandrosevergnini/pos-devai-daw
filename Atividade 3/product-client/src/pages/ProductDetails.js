import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getPassword, getUser } from "../helpers/Utils";

export default function ProductDetails({ item }) {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios({
      method: "get",
      url: "https://productifes-dispmoveisbsi.b4a.run/pegar_produtos.php",
      params: {
        limit: 5000,
        offset: 1,
      },
      auth: {
        username: getUser(),
        password: getPassword(),
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then((response) => {
      if (response.data["sucesso"] == 1) {
        const produtoEncontrado = response.data["produtos"].filter((produto) => produto.id == id)[0];
        console.log("Produto encontrado:", produtoEncontrado); // Debug
        setProduct(produtoEncontrado);
        setIsLoading(false);
      } else {
        window.alert(
          "Erro ao obter lista de produtos: \n".response.data["erro"]
        );
        setIsLoading(false);
      }
    });
  }, []);

  const goToProductList = () => {
    navigate("/home"); // Redireciona para a lista de produtos
  };

  const formatarData = (dataString) => {
    if (!dataString) return "Não informada";
    const data = new Date(dataString);
    return data instanceof Date && !isNaN(data) 
      ? data.toLocaleDateString('pt-BR')
      : "Data inválida";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // Ajusta os itens para o topo
        padding: "20px",
        boxSizing: "border-box",
        width: "100%",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1>Detalhes do Produto</h1>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            marginBottom: "20px",
          }}
        >
          <p>Carregando detalhes do produto...</p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            marginBottom: "20px",
          }}
        >
          <img
            src={product.img || "URL_DE_IMAGEM_PADRAO"}
            alt={product.nome || "Sem nome"}
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          />
          <p>
            <strong>Nome:</strong> {product.nome || "Não informado"}
          </p>
          <p>
            <strong>Preço:</strong> R$ {product.preco || "0,00"}
          </p>
          <p><strong>Descrição:</strong> {product.descricao || "Sem descrição"}</p>
          <p><strong>Categoria:</strong> {product.categoria || "Não categorizado"}</p>
          <p><strong>Quantidade em Estoque:</strong> {product.quantidade || 0}</p>
          <p><strong>Data de Cadastro:</strong> {formatarData(product.datacadastro)}</p>
        </div>
      )}

      <button
        onClick={goToProductList}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Voltar à Lista de Produtos
      </button>
    </div>
  );
}
