import styled from '@emotion/styled'
import '@fontsource/cairo'

const SubTitle = styled.h6`
  font-weight: 500;
  font-size: ${(props) => props.fontSize || '1.5rem'};
  color: ${(props) => props.color || '#7B7B98'};
  font-style: normal;
  line-height: 140%;
  letter-spacing: -0.6px;
  font-family: 'Cairo';
  width: ${(props) => props.width || 488}; //!
  height: ${(props) => props.height || 102}; //!
  text-align: ${(props) => props.textAlign || 'left'};

  @media (max-width: 900px) {
    font-size: 1.4rem;
  }
  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
  @media (max-width: 300px) {
    font-size: 1rem;
  }
`

export default SubTitle
