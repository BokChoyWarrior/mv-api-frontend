import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Container,
  Spinner,
  Modal,
  Image,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { Trash } from "react-bootstrap-icons";

const API_ENDPOINT = process.env.REACT_APP_BASE_URL + "/api/restaurants";
export default function Restaurant() {
  // Use type declaration here
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [restaurant, setRestaurant]: any = useState({
    isLoading: true,
    data: {},
  });

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleDeleteButton = () => setShowModal(true);

  const handleDelete = async () => {
    history.push("/restaurants");
    setShowModal(false);
  };

  const getRestaurant = async () => {
    const response = await axios.get(`${API_ENDPOINT}/${id}?getNested=true`);
    console.log(response);
    return response;
  };

  useEffect(() => {
    getRestaurant()
      .then((res: any) => {
        setRestaurant({ isLoading: false, data: res.data });
      })
      .catch((err) => {
        console.log(err);
        history.push("/restaurants");
      });
  }, []);

  if (restaurant.isLoading) {
    return (
      <Container className="my-auto">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  return (
    <>
      <Container fluid="md">
        <h1>{restaurant.data.name}</h1>
        <Image
          src={restaurant.data.image}
          style={{ maxWidth: "80%", maxHeight: "18rem" }}
        />
        <Menus menus={restaurant.data.menus} />
      </Container>

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

function Menus(props: any) {
  const menus = props.menus;

  if (menus.length > 0) {
    return (
      <Tabs defaultActiveKey={menus[0].id} className="mb-3">
        {menus.map((menu: any) => (
          <Tab key={menu.id} eventKey={menu.id} title={menu.title}>
            {menu.menuItems.map((menuItem: any) => (
              <MenuItem menuItem={menuItem} key={menuItem.id} />
            ))}
          </Tab>
        ))}
      </Tabs>
    );
  } else {
    return <p>No menus!</p>;
  }
}

function MenuItem(props: any) {
  return (
    <Row>
      <Col md="8">{props.menuItem.name}</Col>
      <Col md="3">{props.menuItem.price}</Col>
      <Col md="1">
        <Button variant="outline-danger">
          <Trash />
        </Button>
      </Col>
    </Row>
  );
}
