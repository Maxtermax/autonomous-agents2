import styled from '@emotion/styled'

export const Container = styled.header`
  align-items: center;
  background: var(--primary-translucid);
  display: flex;
  color: var(--primary-contrast);
  height: 80px;
  padding: 10px;
  position: absolute;
  min-width: 180px;
  justify-content: space-between;
  right: 30px;
  gap: 25px;
  & a {
    color: var(--primary-contrast);
  }
`;
