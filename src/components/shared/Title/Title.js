import styled from '@emotion/styled'
import '@fontsource/cairo'

const Title = styled.h1`
  font-weight: ${(props) => props.fontWeight || '400'};
  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
  font-size: ${(props) => props.fontSize || '2.5rem'};
  color: ${(props) => props.color || '#000022'};
  line-height: 120%;
  letter-spacing: ${(props) => props.letterSpacing || '0.125'};
  font-family: 'Cairo';
  width: ${(props) => props.width || undefined};
  max-width: ${(props) => props.maxWidth || undefined};
  height: ${(props) => props.height || undefined};
  min-width: ${(props) => props.minWidth || undefined};
  text-align: ${(props) => props.textAlign || 'left'};
  line-height: ${(props) => props.lineHeight || undefined};
  letter-spacing: ${(props) => props.letterSpacing || undefined};

  @media (max-width: 1000px) {
    font-size: 2rem;
  }
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
  @media (max-width: 390px) {
    font-size: 1rem;
  }
`

export default Title
