import './Utilities.css';

import { useState } from 'react';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export function LoadingSpinner() {
  return <div className="lds-dual-ring"></div>;
}

export function RestaurantCard(props: any) {
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
      <Col className="mx-auto my-2">
        <Card style={{ width: "24rem", height: "24rem" }}>
          <Card.Img
            variant="top"
            src={props.restaurant.image}
            style={{ height: "16rem" }}
          />
          <Card.Body>
            <Card.Title>{props.restaurant.name}</Card.Title>
            {/* <Card.Text>{props.restaurant.description}</Card.Text> */}
            <Button variant="outline-primary" onClick={handleViewButton}>
              View
            </Button>{" "}
            <EditRestaurantButton
              edit={props.handleEdit}
              restaurant={props.restaurant}
            />{" "}
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
          <Button variant="danger" onClick={handleDelete}>
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

export function EditRestaurantButton(props: any) {
  const [showModal, setShowModal] = useState(false);

  const [restaurantName, setRestarauntName] = useState(
    `${props.restaurant.data.name}`
  );
  const [restaurantImage, setRestarauntImage] = useState(
    `${props.restaurant.data.image}`
  );

  const [editButtonIsLoading, setEditButtonIsLoading] = useState(false);

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
    setEditButtonIsLoading(true);

    await props.edit({
      name: restaurantName,
      image: restaurantImage,
    });
    setEditButtonIsLoading(false);
    setShowModal(false);
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
