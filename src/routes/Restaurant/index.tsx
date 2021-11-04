import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Modal, Row, Spinner, Tab, Tabs } from 'react-bootstrap';
import { PlusLg, Trash } from 'react-bootstrap-icons';
import { useHistory, useParams } from 'react-router-dom';

import { EditRestaurantButton } from '../../components/Utilities';

const BASE_URL = process.env.REACT_APP_BASE_URL + "/api";
const API_ENDPOINT = process.env.REACT_APP_BASE_URL + "/api/restaurants";
export default function Restaurant() {
  // Use type declaration here
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [restaurant, setRestaurant]: any = useState({
    isLoading: true,
    data: {},
  });

  const getRestaurant = async () => {
    const response = await axios.get(`${API_ENDPOINT}/${id}?getNested=true`);
    return response;
  };

  const deleteRestaurant = async () => {
    const deleted = await axios.delete(`${API_ENDPOINT}/${id}`);
    if (deleted.status === 200) {
      history.push("/restaurants");
    }
  };

  const editRestaurant = async (data: any) => {
    setRestaurant({ loading: true, data: restaurant.data });
    const edited = await axios.put(`${API_ENDPOINT}/${id}`, data);
    if (edited.status === 200) {
      const rest = await getRestaurant();
      setRestaurant({ loading: false, data: rest.data });
    }
  };

  const createMenuItem = async (menuId: any, menuItem: any) => {
    const menuItemToSend = menuItem;
    menuItemToSend.menu_id = menuId;

    const response = await axios.post(`${BASE_URL}/menuItems`, menuItemToSend);
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
        <Row>
          <Col md={3}>
            <h1>{restaurant.data.name}</h1>
            <Image
              src={restaurant.data.image}
              style={{ maxWidth: "80%", maxHeight: "18rem" }}
            />
            <RestaurantControls
              handleEdit={editRestaurant}
              handleDelete={deleteRestaurant}
              restaurant={restaurant}
            />
            <AddMenu />
          </Col>
          <Col md={9}>
            <Menus
              menus={restaurant.data.menus}
              createMenuItem={createMenuItem}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

function Menus(props: any) {
  const menus = props.menus;

  if (menus.length > 0) {
    return (
      <Tabs defaultActiveKey={menus[0].id} className="mb-3">
        {menus.map((menu: any) => (
          <Tab eventKey={menu.id} title={menu.title} key={menu.id}>
            <Menu
              key={menu.id}
              menu={menu}
              createMenuItem={props.createMenuItem}
            />
          </Tab>
        ))}
      </Tabs>
    );
  } else {
    return <p>No menus!</p>;
  }
}

function Menu(props: any) {
  const [menuItems, setMenuItems] = useState(props.menu.menuItems);

  const addMenuItem = (item: any) => {
    setMenuItems([...menuItems, item]);
  };

  const deleteItem = async (item_id: any) => {
    const deleted = await axios.delete(`${BASE_URL}/menuItems/${item_id}`);
    if (deleted.status === 200) {
      setMenuItems(menuItems.filter((item: any) => item.id !== item_id));
    }
  };

  return (
    <>
      <Row className="border-bottom my-2">
        <Col md="8">Item</Col>
        <Col md="3">Price</Col>
        <Col md="1"></Col>
      </Row>
      <AddMenuItemForm
        addMenuItem={async (menuItem: any) => {
          const createdItem = await props.createMenuItem(
            props.menu.id,
            menuItem
          );
          if (createdItem.status === 201) {
            addMenuItem(createdItem.data);
          }
        }}
      />
      {menuItems.map((menuItem: any) => (
        <MenuItem
          menuItem={menuItem}
          key={menuItem.id}
          deleteItem={async () => deleteItem(menuItem.id)}
        />
      ))}
    </>
  );
}

function MenuItem(props: any) {
  return (
    <Row className="my-2">
      <Col md="8">{props.menuItem.name}</Col>
      <Col md="3">{props.menuItem.price}</Col>
      <Col md="1" className="mx-auto">
        <Button
          variant="outline-danger"
          className="mx-auto"
          onClick={props.deleteItem}
        >
          <Trash />
        </Button>
      </Col>
    </Row>
  );
}

function AddMenu(props: any) {
  return <></>;
}

function RestaurantControls(props: any) {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleDeleteButton = () => setShowModal(true);

  const handleDelete = async () => {
    setShowModal(false);
    props.handleDelete();
  };

  return (
    <>
      <EditRestaurantButton
        edit={props.handleEdit}
        restaurant={props.restaurant}
      />{" "}
      <Button variant="outline-danger" onClick={handleDeleteButton}>
        Delete
      </Button>
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
function AddMenuItemForm(props: any) {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState(0);

  const handleNameFormChange = (event: any) => {
    setItemName(event.target.value);
  };

  const handlePriceFormChange = (event: any) => {
    setItemPrice(event.target.value);
  };

  const handleAdd = () => {
    props.addMenuItem({
      name: itemName,
      price: itemPrice,
    });
  };

  return (
    <Row className="my-2">
      {/* <Form onSubmit={handleCreate}> */}
      <Col md="8">
        <Form.Group controlId="menuItemName">
          <Form.Control
            type="text"
            placeholder="Item name"
            required
            onChange={handleNameFormChange}
          />
        </Form.Group>
      </Col>
      <Col md="3">
        <Form.Group controlId="menuItemPrice">
          <Form.Control
            type="number"
            placeholder="Price"
            onChange={handlePriceFormChange}
          />
        </Form.Group>
      </Col>
      <Col className="mx-auto" md="1">
        <Button variant="outline-primary" type="submit" onClick={handleAdd}>
          <PlusLg />
        </Button>
      </Col>
      {/* </Form> */}
    </Row>
  );
}
