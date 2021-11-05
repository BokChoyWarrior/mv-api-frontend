import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Placeholder,
  Row,
} from "react-bootstrap";

import {
  RestaurantCard,
  DeleteRestaurantButton,
  ViewRestaurantButton,
  RestaurantControls,
  EditRestaurantButton,
} from "../../components/Utilities";

const API_URL = process.env.REACT_APP_BASE_URL + "/api";

export default function Restaurants() {
  const [restaurants, setRestaurants]: any = useState({
    loading: true,
    data: [],
  });

  // CRUD
  const createRestaurant = async (details: any) => {
    const response = await axios.post(`${API_URL}/restaurants`, details);
    if (response.status === 201) {
      setRestaurants({
        loading: false,
        data: [...restaurants.data, response.data],
      });
    }
  };
  const deleteRestaurant = async (id: any) => {
    const response = await axios.delete(`${API_URL}/restaurants/${id}`);
    if (response.status === 200) {
      setRestaurants({
        loading: false,
        data: restaurants.data.filter(
          (restaurant: any) => restaurant.id !== id
        ),
      });
    }
  };
  const editRestaurant = async (id: any, details: any) => {
    const response = await axios.put(`${API_URL}/restaurants/${id}`, details);
    if (response.status === 200) {
      refreshRestaurants();
    }
  };

  const refreshRestaurants = async () => {
    await axios
      .get(`${API_URL}/restaurants`)
      .then((res: any) => {
        setRestaurants({ loading: false, data: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    refreshRestaurants();
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
        {restaurants.data.map((restaurant: any) => (
          <RestaurantCard restaurant={restaurant} key={restaurant.id}>
            <RestaurantControls>
              <ViewRestaurantButton id={restaurant.id} />{" "}
              <EditRestaurantButton
                handleEdit={(details: any) =>
                  editRestaurant(restaurant.id, details)
                }
                restaurant={restaurant}
              />{" "}
              <DeleteRestaurantButton
                handleDelete={() => deleteRestaurant(restaurant.id)}
                name={restaurant.name}
              />
            </RestaurantControls>
          </RestaurantCard>
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
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={4} />
          </Placeholder>
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

    await props.create({
      name: restaurantName,
      image: restaurantImage,
    });
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
      </Modal>
    </>
  );
}

AddRestaurantButton.defaultProps = {
  disabled: false,
};
