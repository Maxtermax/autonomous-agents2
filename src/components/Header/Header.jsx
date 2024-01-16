import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Github } from "@styled-icons/bootstrap";
import { Container } from "./styles";

function Header({ title = "", next = "", back = "", code = "" }) {
  return (
    <Container>
      {title && <p>{title}</p>}
      <a title="code" href={code}>
        <Github size={35} />
      </a>
      {back && (
        <Link title="back" to={back}>
          <ArrowLeft size={35} />
        </Link>
      )}
      {next && (
        <Link title="next" to={next}>
          <ArrowRight size={35} />
        </Link>
      )}
    </Container>
  );
}

export default Header;
