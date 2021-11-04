import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Modal, Placeholder, Row } from 'react-bootstrap';

import { RestaurantCard } from '../../components/Utilities';

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

  const createRestaurant = async (details: any) => {
    const response = await axios.post(API_ENDPOINT, details);
    if (response.status === 201) {
      setRestaurants({
        loading: false,
        data: [...restaurants.data, response.data],
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
        <AddRestaurantButton disabled={true} />
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
      <AddRestaurantButton create={createRestaurant} />
      <Row xs="auto" md="auto" lg="auto">
        {restaurants.data.map((item: any) => (
          <RestaurantCard
            restaurant={item}
            delete={deleteRestaurant}
            key={item.id}
          />
        ))}
      </Row>
    </Container>
  );
}

function PlaceholderRestaurant() {
  return (
    <Col className="mx-auto my-2">
      <Card style={{ width: "24rem", height: "24rem" }}>
        <Card.Img
          variant="top"
          src="grey_square.png"
          style={{ maxHeight: "16rem" }}
        />
        {/* <Placeholder as={Card.Img} animation="glow" /> */}
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={4} />
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

function AddRestaurantButton(props: any) {
  const [showModal, setShowModal] = useState(false);
  const [createButtonIsLoading, setCreateButtonIsLoading] = useState(false);

  const [restaurantName, setRestarauntName] = useState("");
  const [restaurantImage, setRestarauntImage] = useState("");

  const handleCloseModal = () => setShowModal(false);
  const handleCreateButton = () => {
    setShowModal(true);
  };

  const handleNameFormChange = (event: any) => {
    setRestarauntName(event.target.value);
  };
  const handleImageFormChange = (event: any) => {
    setRestarauntImage(event.target.value);
  };

  const handleCreate = async (event: any) => {
    event.preventDefault();
    setCreateButtonIsLoading(true);

    const result = await props.create({
      name: restaurantName,
      image: restaurantImage,
    });
    setCreateButtonIsLoading(false);
    setShowModal(false);
  };

  let button;
  if (props.disabled) {
    button = (
      <Button variant="primary" disabled>
        Create Restaurant
      </Button>
    );
  } else {
    button = (
      <Button variant="primary" onClick={handleCreateButton}>
        Create Restaurant
      </Button>
    );
  }

  return (
    <>
      <Row className="my-2">
        <Col>{button}</Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-3" controlId="restaurantName">
              <Form.Label>Restaurant Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Restaurant name"
                required
                onChange={handleNameFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="restaurantImage">
              <Form.Label>Image Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://..."
                onChange={handleImageFormChange}
              />
            </Form.Group>
            <Row className="mx-auto" xs="auto" md="auto" lg="auto">
              <Col className="mx-auto">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Col>
              <Col className="mx-auto">
                <Button variant="outline-danger">Cancel</Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="danger" size="lg" onClick={handleCreate}>
            DELETE
          </Button>
          <Button variant="outline-primary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

AddRestaurantButton.defaultProps = {
  disabled: false,
};
