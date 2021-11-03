import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import { Home, Restaurants, Restaurant } from "./routes";
import "./App.css";
import { Navbar, Container, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar bg="dark" variant="dark">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>Home</Navbar.Brand>
            </LinkContainer>
            <Nav className="me-auto">
              <LinkContainer to="/restaurants">
                <Nav.Link>Restaurants</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/menus">
                <Nav.Link>Menus</Nav.Link>
              </LinkContainer>
            </Nav>
          </Container>
        </Navbar>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/restaurants/:id">
            <Restaurant />
          </Route>
          <Route path="/restaurants">
            <Restaurants />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

export default App;
