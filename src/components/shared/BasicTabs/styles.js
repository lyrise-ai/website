/* eslint-disable sonarjs/no-duplicate-string */
const styles = () => ({
  // Tabs Styles
  tabs: {
    border: ' 1px solid #D7D8DB !important',
    borderRadius: '5px !important',
    minHeight: '56px !important',
    height: '56px !important',
    display: 'flex',
  },

  leftTab: {
    minHeight: '40px !important',
    height: '56px !important',
    textTransform: 'none !important',
    borderRight: '1px solid #D7D8DB !important',
    fontFamily: 'Poppins !important',
    fontStyle: 'normal !important',
    fontWeight: '500 !important',
    fontSize: '14px !important',
    color: '#344054 !important',
    minWidth: '50% !important',
    flex: '1',
    '&.Mui-selected': {
      backgroundColor: '#2957FF !important',
      color: '#FFFFFF !important',
    },
  },

  rightTab: {
    minHeight: '40px !important',
    height: '56px !important',
    textTransform: 'none !important',
    fontFamily: 'Poppins !important',
    fontStyle: 'normal !important',
    fontWeight: '500 !important',
    fontSize: '14px !important',
    color: '#344054 !important',
    minWidth: '50% !important',
    flex: '1',
    '&.Mui-selected': {
      backgroundColor: '#2957FF !important',
      color: '#FFFFFF !important',
    },
  },
})

export default styles
