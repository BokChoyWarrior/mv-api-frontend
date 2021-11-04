import "./Utilities.css";

import { useState } from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL + "/api";

export function LoadingSpinner() {
  return <div className="lds-dual-ring"></div>;
}

export function RestaurantCard(props: any) {
  const [restaurant, setRestaurant] = useState(props.restaurant);

  const getRestaurant = async () => {
    const response = await axios.get(`${API_URL}/restaurants/${restaurant.id}`);
    return response;
  };

  const editRestaurant = async (edited: any) => {
    if (edited.status === 200) {
      const newRestaurant = await getRestaurant();
      setRestaurant(newRestaurant.data);
    }
  };

  return (
    <>
      <Col className="mx-auto my-2">
        <Card style={{ width: "24rem", height: "24rem" }}>
          <Card.Img
            variant="top"
            src={restaurant.image}
            style={{ height: "16rem" }}
          />
          <Card.Body>
            <Card.Title>{restaurant.name}</Card.Title>
            {/* <Card.Text>{props.restaurant.description}</Card.Text> */}
            <ViewRestaurantButton id={restaurant.id} />{" "}
            <EditRestaurantButton
              handleEdit={editRestaurant}
              restaurant={restaurant}
            />{" "}
            {props.deleteButton}
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export function EditRestaurantButton(props: any) {
  const [showModal, setShowModal] = useState(false);

  const [restaurantName, setRestarauntName] = useState(
    `${props.restaurant.name}`
  );
  const [restaurantImage, setRestarauntImage] = useState(
    `${props.restaurant.image}`
  );

  const handleCloseModal = () => setShowModal(false);
  const handleEditButton = () => setShowModal(true);

  const handleNameFormChange = (event: any) => {
    setRestarauntName(event.target.value);
  };
  const handleImageFormChange = (event: any) => {
    setRestarauntImage(event.target.value);
  };

  const handleEdit = async (event: any) => {
    event.preventDefault();

    const newRestaurant = { name: restaurantName, image: restaurantImage };
    console.log(props.restaurant.id);
    const edited = await axios.put(
      `${API_URL}/restaurants/${props.restaurant.id}`,
      newRestaurant
    );

    setShowModal(false);
    props.handleEdit(edited);
  };

  return (
    <>
      <Button variant="outline-primary" onClick={handleEditButton}>
        Edit
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Edit Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEdit}>
            <Form.Group className="mb-3" controlId="restaurantName">
              <Form.Label>Restaurant Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Restaurant name"
                value={restaurantName}
                required
                onChange={handleNameFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="restaurantImage">
              <Form.Label>Image Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://..."
                value={restaurantImage}
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
                <Button variant="outline-danger" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export function DeleteRestaurantButton(props: any) {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleDeleteButton = () => setShowModal(true);

  const handleDelete = async () => {
    const deleted = await axios.delete(
      `${API_URL}/restaurants/${props.restaurant.id}`
    );
    setShowModal(false);
    props.handleDelete(deleted, props.restaurant.id);
  };

  return (
    <>
      <Button variant="outline-danger" onClick={handleDeleteButton}>
        Delete
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Alert!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {props.restaurant.name}?
        </Modal.Body>
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

export function ViewRestaurantButton(props: any) {
  const history = useHistory();

  const handleViewButton = () => {
    history.push(`/restaurants/${props.id}`);
  };
  return (
    <Button variant="outline-primary" onClick={handleViewButton}>
      View
    </Button>
  );
}
