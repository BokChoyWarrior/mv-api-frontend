import { useState } from 'react';
import { Button } from 'react-bootstrap';

export default function Home() {
  return (
    <>
      <h1>Homepage!</h1>
      <ClickyButton />
      <ClickyButton />
      <ClickyButton start={5} />
    </>
  );
}

function ClickyButton(props: any) {
  const [clicked, setClicked] = useState(props.start);

  const increment = () => {
    setClicked(clicked + 1);
  };

  return (
    <Button variant="primary" onClick={increment}>
      Clicked {clicked} times!
    </Button>
  );
}

ClickyButton.defaultProps = {
  start: 0,
};
