import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import { PlusLg, Trash } from "react-bootstrap-icons";
import { useHistory, useParams } from "react-router-dom";

import {
  EditRestaurantButton,
  DeleteRestaurantButton,
} from "../../components/Utilities";

const API_URL = process.env.REACT_APP_BASE_URL + "/api";
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

  const deleteRestaurant = async (deleted: any) => {
    if (deleted.status === 200) {
      history.push("/restaurants");
    }
  };

  const editRestaurant = async (edited: any) => {
    setRestaurant({ loading: true, data: restaurant.data });

    if (edited.status === 200) {
      const newRestaurant = await getRestaurant();
      setRestaurant({ loading: false, data: newRestaurant.data });
    }
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
            <RestaurantControls>
              <EditRestaurantButton
                handleEdit={editRestaurant}
                restaurant={restaurant.data}
              />{" "}
              <DeleteRestaurantButton
                handleDelete={deleteRestaurant}
                restaurant={restaurant.data}
              />
            </RestaurantControls>
            <AddMenu />
          </Col>
          <Col md={9}>
            <Menus menus={restaurant.data.menus} />
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
            <Menu menuItems={menu.menuItems} menuId={menu.id} />
          </Tab>
        ))}
      </Tabs>
    );
  } else {
    return <p>No menus!</p>;
  }
}

function Menu(props: any) {
  const [menuItems, setMenuItems] = useState(props.menuItems);

  const addMenuItem = async (menuItem: any) => {
    setMenuItems([...menuItems, menuItem]);
  };

  const deleteMenuItem = async (menuItemId: any) => {
    const response = await axios.delete(`${API_URL}/menuItems/${menuItemId}`);

    if (response.status === 200) {
      setMenuItems(menuItems.filter((item: any) => item.id !== menuItemId));
    }
  };
  return (
    <>
      <Row className="border-bottom my-2">
        <Col md="8">Item</Col>
        <Col md="3">Price</Col>
        <Col md="1"></Col>
      </Row>
      <AddMenuItemForm addMenuItem={addMenuItem} menuId={props.menuId} />
      {menuItems.map((menuItem: any) => (
        <MenuItem
          menuItem={menuItem}
          key={menuItem.id}
          deleteMenuItem={async () => deleteMenuItem(menuItem.id)}
        />
      ))}
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

  const handleAdd = async () => {
    const newMenuItem = {
      name: itemName,
      price: itemPrice,
      menu_id: props.menuId,
    };
    const response = await axios.post(`${API_URL}/menuItems`, newMenuItem);

    if (response.status === 201) {
      props.addMenuItem(response.data);
    }
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

function MenuItem({ menuItem, deleteMenuItem }: any) {
  return (
    <Row className="my-2">
      <Col md="8">{menuItem.name}</Col>
      <Col md="3">{menuItem.price}</Col>
      <Col md="1" className="mx-auto">
        <Button
          variant="outline-danger"
          className="mx-auto"
          onClick={deleteMenuItem}
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
  return <div className="my-2">{props.children}</div>;
}
