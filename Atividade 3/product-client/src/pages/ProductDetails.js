import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getPassword, getUser } from "../helpers/Utils";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios({
      method: 'get',
      url: `https://productifes-dispmoveisbsi.b4a.run/pegar_produto.php?id=${id}`,
      auth: {
        username: getUser(),
        password: getPassword()
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then((response) => {
      if(response.data["sucesso"] == 1) {
        setProduct(response.data["produto"]);
      } else {
        window.alert("Erro ao obter detalhes do produto: \n" + response.data["erro"]);
      }
    });
  }, [id]);

  if (!product) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="product-details">
      <h1>{product.nome}</h1>
      <img src={product.img} alt={product.nome} />
      <p>Preço: {product.preco}</p>
      <p>Descrição: {product.descricao}</p>
    </div>
  );
}