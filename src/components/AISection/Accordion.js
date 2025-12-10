/* eslint-disable react/no-danger */
import * as React from 'react'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Divider from '@mui/material/Divider'
import '@fontsource/cairo'
import Image from 'next/legacy/image'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import styles from './accordion.module.css'

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}))

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(
  ({ theme, rotate, align }) => ({
    backgroundColor: align === 'right' ? '#F1F5F8' : '#F9FAFC',
    flexDirection: align === 'right' ? 'row' : 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: rotate.length !== 0 ? 'rotate(90deg)' : 'none',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }),
)

const AccordionDetails = styled(MuiAccordionDetails)(({ theme, align }) => ({
  backgroundColor: align === 'right' ? '#F1F5F8' : '#F9FAFC',
  padding: theme.spacing(2),
}))

export default function CustomizedAccordions({ AccordionData, rotate, align }) {
  const [expanded, setExpanded] = React.useState('panel1')

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  return (
    <div>
      {AccordionData.map((item, index) => (
        <div key={item.id} style={{ marginBottom: 15 }}>
          <Accordion
            expanded={expanded === `panel${index + 1}`}
            onChange={handleChange(`panel${index + 1}`)}
          >
            <AccordionSummary
              expandIcon={
                expanded === `panel${index + 1}` && align === 'right' ? (
                  <RemoveIcon fontSize="medium" style={{ color: '#4200FF' }} />
                ) : expanded !== `panel${index + 1}` && align === 'right' ? (
                  <AddIcon fontSize="medium" style={{ color: '#4200FF' }} />
                ) : (
                  <Image
                    src={item?.img}
                    alt="alt"
                    sx={{ fontSize: '0.9rem' }}
                  />
                )
              }
              rotate={rotate}
              align={align}
              className={styles.accordion__summary}
            >
              {item.AccordionSummary}
            </AccordionSummary>
            <AccordionDetails align={align}>
              <div
                className={styles.accordion__details}
                dangerouslySetInnerHTML={{
                  __html: `${item.AccordionDetails}`,
                }}
              />
            </AccordionDetails>
          </Accordion>

          {index !== AccordionData.length - 1 ? <Divider /> : null}
        </div>
      ))}
    </div>
  )
}

CustomizedAccordions.propTypes = {
  AccordionData: PropTypes.array.isRequired,
  rotate: PropTypes.string,
  align: PropTypes.string,
}

CustomizedAccordions.defaultProps = {
  rotate: '',
  align: 'left',
}
