import styled from '@emotion/styled'
import '@fontsource/cairo'

const Button = styled.button`
  font-size: 1.375;
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid #094bf6;
  background-color: inherit;
  text-transform: none;
  transform-origin: bottom left;
  cursor: pointer;
  &:hover {
    background-color: #f9fafc;
    box-shadow: 3px 4px 12px 1px rgba(66, 0, 255, 0.1);
  }

  &:hover .arrow {
    width: 120%;
  }

  @media (max-width: 346px) {
    .btnContainer {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
`

export default Button
