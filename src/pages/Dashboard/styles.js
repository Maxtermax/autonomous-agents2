import styled from "@emotion/styled";

export const Container = styled.ul`
  align-items: center;
  display: grid;
  place-content: center;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2em;
  padding: 0px;
  list-style-type: none;
  margin: 100px auto;
  max-width: var(--max-width);
  width: 100%;
  & a {
  background: var(--primary);
  height: 300px;
  position: relative;
`;

export const Card = styled.li`
  color: var(--primary-contrast);
  background-image: url(${({ src }) => src});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
`;
