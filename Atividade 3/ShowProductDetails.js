import '../styles/CreateProduct.css';
import { useState , useEffect } from 'react';
import axios from 'axios';
import { getPassword, getUser } from '../helpers/Utils';
import { useNavigate, useParams, Link } from "react-router-dom";


export default function ShowProductDetails() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
  
    useEffect(() => {
      const fetchProductDetails = async () => {
        axios({
            method: 'get',
            url: 'https://productifes-dispmoveisbsi.b4a.run/pegar_detalhes_produto.php',
            params: {
                id : productId
            },
            auth: {
                username: getUser(),
                password: getPassword()
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((response) => {
            console.log(response);
            if(response.data["sucesso"] == 1) {
                console.log(response);
                setProduct(response.data);
            }
            else {
                window.alert("Erro na requisição: \n" + response.data["erro"]);
            }
        });
      };
  
      fetchProductDetails();
    }, [productId]);
  
    if (!product) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h2>{product.nome}</h2>
        <p>Descrição: {product.descricao}</p>
        <p>Preço: R${product.preco}</p>
        <p><img 
            width={"300px"}
            src={product.img}
        /></p>
        <Link to="/"> Voltar </Link>
      </div>
    );
}