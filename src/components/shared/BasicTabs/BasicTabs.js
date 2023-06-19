import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import styles from './styles'
import useClasses from '../../../hooks/useClasses'

export default function BasicTabs({
  tab1Label,
  tab2Label,
  value,
  onChange,
  defaultValue,
  setParentState,
  tabsName,
}) {
  const classes = useClasses(styles)

  return (
    <Box>
      <Tabs
        TabIndicatorProps={{ style: { display: 'none' } }}
        value={value}
        onChange={(e, newValue) => {
          setParentState({ [tabsName]: newValue }) // ex: {isFunded: 0} || {jobType: 1}
          onChange(newValue)
        }}
        className={classes.tabs}
      >
        <Tab
          className={classes.leftTab}
          defaultValue={defaultValue}
          label={tab1Label}
        />
        <Tab
          className={classes.rightTab}
          label={tab2Label}
          defaultValue={defaultValue}
        />
      </Tabs>
    </Box>
  )
}

BasicTabs.propTypes = {
  tabsName: PropTypes.string.isRequired,
  tab1Label: PropTypes.string.isRequired,
  tab2Label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  setParentState: PropTypes.func.isRequired,
  defaultValue: PropTypes.string.isRequired,
}
