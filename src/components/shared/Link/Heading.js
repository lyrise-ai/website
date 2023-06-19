import styled from '@emotion/styled'
import '@fontsource/cairo'

const LinkHeading = styled.li`
  font-weight: 700;
  font-size: ${(props) => props.fontSize || '24px'};
  color: ${(props) => props.color || '#1C1C1C'};
  font-style: normal;
  line-height: 45px;
  text-transform: capitalize;
  font-family: 'Cairo';
`

export default LinkHeading
