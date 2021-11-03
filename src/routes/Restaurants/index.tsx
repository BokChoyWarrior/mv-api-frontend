import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Container,
  Modal,
  Placeholder,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";

const API_ENDPOINT = process.env.REACT_APP_BASE_URL + "/api/restaurants";

export default function Restaurants() {
  const [restaurants, setRestaurants]: any = useState({
    loading: true,
    data: [],
  });

  const deleteRestaurant = async (id: any) => {
    const response = await axios.delete(`${API_ENDPOINT}/${id}`);
    if (response.status === 200) {
      setRestaurants({
        loading: false,
        data: restaurants.data.filter(
          (restaurant: any) => restaurant.id !== id
        ),
      });
    }
  };

  const getRestaurants = async () => {
    const response = await axios.get(API_ENDPOINT);
    return response;
  };

  useEffect(() => {
    getRestaurants()
      .then((res: any) => {
        setRestaurants({ loading: false, data: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (restaurants.loading) {
    return (
      <Container className="my-auto">
        <Row xs="auto" md="auto" lg="auto">
          <PlaceholderRestaurant />
          <PlaceholderRestaurant />
          <PlaceholderRestaurant />
          <PlaceholderRestaurant />
          <PlaceholderRestaurant />
          <PlaceholderRestaurant />
        </Row>
      </Container>
    );
  }
  return (
    <Container fluid="md">
      <Row xs="auto" md="auto" lg="auto">
        {restaurants.data.map((item: any) => (
          <Restaurant
            restaurant={item}
            delete={deleteRestaurant}
            key={item.id}
          />
        ))}
      </Row>
    </Container>
  );
}

function Restaurant(props: any) {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleDeleteButton = () => setShowModal(true);

  const handleViewButton = () => {
    history.push(`/restaurants/${props.restaurant.id}`);
  };

  const handleDelete = async () => {
    props.delete(props.restaurant.id);
    setShowModal(false);
  };
  return (
    <>
      <Col className="mx-auto" style={{ margin: "20px 0" }}>
        <Card style={{ width: "24rem" }}>
          <Card.Img
            variant="top"
            src={props.restaurant.image}
            style={{ maxHeight: "16rem" }}
          />
          <Card.Body>
            <Card.Title>{props.restaurant.name}</Card.Title>
            {/* <Card.Text>{props.restaurant.description}</Card.Text> */}
            <Button variant="outline-primary" onClick={handleViewButton}>
              View
            </Button>{" "}
            <Button variant="outline-primary">Edit</Button>{" "}
            <Button variant="outline-danger" onClick={handleDeleteButton}>
              Delete
            </Button>
          </Card.Body>
        </Card>
      </Col>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Alert!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" size="lg" onClick={handleDelete}>
            DELETE
          </Button>
          <Button variant="outline-primary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function PlaceholderRestaurant() {
  return (
    <Col className="mx-auto" style={{ margin: "20px 0" }}>
      <Card style={{ width: "24rem" }}>
        <Card.Img
          variant="top"
          src="loading-animation.gif"
          style={{ maxHeight: "16rem" }}
        />
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          {/* <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{" "}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder> */}
          <Placeholder.Button
            variant="outline-primary"
            xs={3}
          ></Placeholder.Button>{" "}
          <Placeholder.Button
            variant="outline-primary"
            xs={3}
          ></Placeholder.Button>{" "}
          <Placeholder.Button
            variant="outline-danger"
            xs={3}
          ></Placeholder.Button>
        </Card.Body>
      </Card>
    </Col>
  );
}
