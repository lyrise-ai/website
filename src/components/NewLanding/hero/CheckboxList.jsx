import React from 'react'

import Img from './../../Product/Img'

// healthcare
import healthCare1 from '/src/assets/hero/icons/healthcare/1.png'
import healthCare2 from '/src/assets/hero/icons/healthcare/2.png'
import healthCare3 from '/src/assets/hero/icons/healthcare/3.png'
import healthCare4 from '/src/assets/hero/icons/healthcare/4.png'

// // manufacturing
// import manufacturing1 from '/src/assets/hero/icons/healthcare/1.svg'
// import manufacturing2 from '/src/assets/hero/icons/healthcare/2.svg'
// import manufacturing3 from '/src/assets/hero/icons/healthcare/3.svg'
// import manufacturing4 from '/src/assets/hero/icons/healthcare/4.svg'

// // retail
// import retail1 from '/src/assets/hero/icons/healthcare/1.svg'
// import retail2 from '/src/assets/hero/icons/healthcare/2.svg'
// import retail3 from '/src/assets/hero/icons/healthcare/3.svg'
// import retail4 from '/src/assets/hero/icons/healthcare/4.svg'

// // transportation
// import transportation1 from '/src/assets/hero/icons/healthcare/1.svg'
// import transportation2 from '/src/assets/hero/icons/healthcare/2.svg'
// import transportation3 from '/src/assets/hero/icons/healthcare/3.svg'
// import transportation4 from '/src/assets/hero/icons/healthcare/4.svg'

// // finance
// import finance1 from '/src/assets/hero/icons/healthcare/1.svg'
// import finance2 from '/src/assets/hero/icons/healthcare/2.svg'
// import finance3 from '/src/assets/hero/icons/healthcare/3.svg'
// import finance4 from '/src/assets/hero/icons/healthcare/4.svg'

const mapToImgSrc = {
  healthcare: [healthCare1, healthCare2, healthCare3, healthCare4],
  // manufacturing: [
  //   manufacturing1,
  //   manufacturing2,
  //   manufacturing3,
  //   manufacturing4,
  // ],
  // retail: [retail1, retail2, retail3, retail4],
  // transportation: [
  //   transportation1,
  //   transportation2,
  //   transportation3,
  //   transportation4,
  // ],
  // finance: [finance1, finance2, finance3, finance4],
  manufacturing: [healthCare1, healthCare2, healthCare3, healthCare4],
  retail: [healthCare1, healthCare2, healthCare3, healthCare4],
  transportation: [healthCare1, healthCare2, healthCare3, healthCare4],
  finance: [healthCare1, healthCare2, healthCare3, healthCare4],
}

function CheckboxList({
  items = [
    {
      index: 0,
      title: 'item',
      subtitle: 'subtitle',
      imgSrc: 'https://picsum.photos/200',
    },
  ],
  categoryTitle,
  clearActiveItem = () => {},
}) {
  const [itemStates, setItemStates] = React.useState(() => {
    const initialState = {}
    items.forEach((item) => {
      initialState[item.title] = false
    })
    return initialState
  })

  const handleItemClick = (title) => {
    setItemStates((prevItemStates) => ({
      ...prevItemStates,
      [title]: !prevItemStates[title], // Toggle the value
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    clearActiveItem()
    console.log(itemStates)
  }

  return (
    <form
      className="text-left flex flex-col gap-2 w-full overflow-hidden"
      onSubmit={handleSubmit}
    >
      <h3 className="font-secondary font-semibold text-black" role='checkbox'>
        What use cases are you looking for?
      </h3>
      {items.map((item, index) => {
        const isItemChecked = itemStates[item.title]
        return (
          <div
            key={item.title}
            className={
              'flex gap-2 p-3 items-center rounded-xl bg-[#F7F9FF] border-2 border-[#EFF2FF] transition-all duration-300' +
              (isItemChecked ? ' !border-blue-500' : '')
            }
            onClick={() => handleItemClick(item.title)}
          >
            <input
              type="checkbox"
              value={item.title}
              checked={isItemChecked}
              readOnly
            />
            <div className="flex justify-center items-center w-12 h-12 bg-[#D1DBFF] border-[6px] border-[#EFF2FF] rounded-full">
              <Img
                src={mapToImgSrc[categoryTitle][index]}
                className="w-6 h-6 object-contain"
                alt="use case icon"
              />
            </div>
            <div>
              <div className="font-secondary text-black font-semibold text-xs mb-1">
                {item.title}
              </div>
              <div className="font-secondary text-gray-500 text-xs">
                {item.subtitle.substr(0, 42) +
                  (item.subtitle.length > 42 ? '...' : '')}
              </div>
            </div>
          </div>
        )
      })}
      <input
        type="submit"
        value={'Hire Top AI Engineers'}
        className="bg-blue-500 text-lg font-secondary text-white p-3 rounded-lg cursor-pointer w-fit m-auto"
      />
      <div className="text-black font-secondary m-auto text-sm font-semibold ">
        Need help?{' '}
        <a
          className="text-blue-500 underline cursor-pointer"
          target="_blank"
          href="https://meetings.hubspot.com/sales-lyrise"
        >
          Book a Consultation!
        </a>
      </div>
    </form>
  )
}

export default CheckboxList
