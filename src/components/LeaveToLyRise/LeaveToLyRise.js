import React from 'react'
import PropTypes from 'prop-types'
import Cards from '../HiringType/HiringCards/Cards'
import HiringHeading from '../HiringType/HiringHeading.js/HiringHeading'

const LeaveToLyRise = ({ cards }) => {
  return (
    <div className="container">
      <HiringHeading
        title="Leave it to LyRise."
        subtitle="Hire In less than two weeks."
      />
      <Cards cards={cards} section="LeaveToLyRise" />
    </div>
  )
}

LeaveToLyRise.propTypes = {
  cards: PropTypes.array.isRequired,
}

export default LeaveToLyRise
