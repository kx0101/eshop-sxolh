import React, { useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from "../components/Message"
import CheckoutSteps from "../components/CheckoutSteps"
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';

const PlaceOrder = () => {
    const cart = useSelector(state => state.cart);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    let itemsPrice = addDecimals(cart.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    ))

    let shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 100)
    
    let taxPrice = addDecimals(Number((0.24 * itemsPrice).toFixed(2)));

    let totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2)

    const { order, success, error } = useSelector(state => state.orderCreate)

    useEffect(() => {
        if (success) {
            navigate(`/order/${order._id}`)
        }
    }, [navigate, success]) 
    
    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: itemsPrice,
            shippingPrice: shippingPrice,
            taxPrice: taxPrice,
            totalPrice: totalPrice
        }))
    }  

  return (
      <>
        <CheckoutSteps step1 step2 step3 step4 />
        <Row style={{ 'marginLeft': 5 }}>
            <Col md={8}>
                <ListGroup variant="fluid">
                    
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Address:</strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <strong>Method: </strong>
                        {cart.paymentMethod}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {cart.cartItems.length === 0 ? <Message>Your cart is empty</Message> : (
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item, index) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x {item.price} € = {item.qty * item.price} €
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>

                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">

                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>{itemsPrice} €</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>{shippingPrice} €</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>{taxPrice} €</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>{totalPrice} €</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            {error && <Message variant="danger">{error}</Message>}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Button type="button" className="btn-block" disabled={cart.cartItems === 0} onClick={placeOrderHandler}>
                                Place Order
                            </Button>
                        </ListGroup.Item>

                    </ListGroup>
                </Card>
            </Col>
        </Row>
      </>
  )
}

export default PlaceOrder