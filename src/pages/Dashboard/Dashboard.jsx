import { Link } from "react-router-dom";
import { Container, Card } from "./styles";
import thumbnail1 from "../../assets/thumbnails/example1.png";
import thumbnail2 from "../../assets/thumbnails/example2.png";
import thumbnail3 from "../../assets/thumbnails/example3.png";
import thumbnail4 from "../../assets/thumbnails/example4.png";
import thumbnail5 from "../../assets/thumbnails/example5.png";
import thumbnail6 from "../../assets/thumbnails/example6.png";
import thumbnail7 from "../../assets/thumbnails/example7.png";
import thumbnail8 from "../../assets/thumbnails/example8.png";

function Dashboard() {
  return (
    <section>
      <Container className="container">
        <Link to="/example1">
          <Card src={thumbnail1}>
            <h1 className="__card_title">Agent</h1>
          </Card>
        </Link>

        <Link to="/example2">
          <Card src={thumbnail2}>
            <h1 className="__card_title">Sinusoidal motion</h1>
          </Card>
        </Link>

        <Link to="/example3">
          <Card src={thumbnail3}>
            <h1 className="__card_title">complementary forces</h1>
          </Card>
        </Link>

        <Link to="/example4">
          <Card src={thumbnail4}>
            <h1 className="__card_title">movement with mass</h1>
          </Card>
        </Link>

        <Link to="/example5">
          <Card src={thumbnail5}>
            <h1 className="__card_title">collision</h1>
          </Card>
        </Link>

        <Link to="/example6">
          <Card src={thumbnail6}>
            <h1 className="__card_title">seek behaviour</h1>
          </Card>
        </Link>

        <Link to="/example7">
          <Card src={thumbnail7}>
            <h1 className="__card_title">flee behaviour</h1>
          </Card>
        </Link>

        <Link to="/example8">
          <Card src={thumbnail8}>
            <h1 className="__card_title">group behaviour</h1>
          </Card>
        </Link>
      </Container>
    </section>
  );
}

export default Dashboard;
