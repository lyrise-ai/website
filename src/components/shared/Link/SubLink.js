import styled from '@emotion/styled'
import '@fontsource/cairo'

const SubLink = styled.span`
  font-weight: 500;
  font-size: ${(props) => props.fontSize || '20px'};
  color: ${(props) => props.color || '#1C1C1C'};
  font-style: normal;
  line-height: 37px;
  font-family: 'Cairo';
  text-decoration: none;
  display: inline-block;
  margin-bottom: 16px;
`

export default SubLink
