import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

// function CustomTabPanel(props) {
//   const { children, value, index, ...other } = props

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   )
// }

/* <CustomTabPanel value={value} index={0}>
  Item One
</CustomTabPanel> */

const tabs = [
  'View all',
  'Design',
  'Product',
  'Software Engineering',
  'Customer Success',
]

export default function TabsHandler({ value, setValue }) {
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: '#EAECF0' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#2957FF !important',
            },
            '& .MuiTabs-flexContainer': {
              gap: { xs: '10px !important', md: '20px !important' },
            },
            '& .MuiTabs-scrollButtons.Mui-disabled': {
              display: 'none',
            },
          }}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          {tabs.map((item, index) => (
            <Tab
              key={index}
              label={item}
              sx={{
                paddingInline: '0px !important',

                color: value === item ? '#2957FF !important' : '#475467',
                fontWeight: '600',
                fontSize: { xs: '14px !important', md: '16px !important' },
                lineHeight: '19.2px',
                minWidth: 'fit-content !important',
                textTransform: 'none !important',
                fontFamily: 'Poppins !important',
              }}
              value={item}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  )
}
