import React, {useState, useEffect} from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Footer from '../components/Footer';
import Product from "../components/Product";
import axios from 'axios';

const Home = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        
        const fetchProducts = async () => {
            const { data } = await axios.get('/api/products');

            setProducts(data);
        }
        fetchProducts();
    }, [])

  return (
    <>
        <main className="py-3">
            <Container>
                <h1>Latest Products</h1>
                <Row>
                    {products.map(product => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </main>
        <Footer />
    </>
  )
}

export default Home