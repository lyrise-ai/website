// this is the content of the hero section to re-enable the interactive chat section

import Link from 'next/link'
import React, { useState } from 'react'
import { LYRISEAI_PRODUCT_URL } from '../../../constants/main'
import { ChatFocusContext } from '../../../providers/ChatFocusContext'
import ArrowButton from '../../Buttons/ArrowButton'
import BotChat from './BotChat'
import PageSection from '@components/NewLanding/section/PageSection'

export default function ChatHeroSection() {
  const [isChatFocused, setIsChatFocused] = useState(false)

  return (
    // note: overflow was hidden here
    <PageSection className="md:max-w-[65vw] w-full m-auto gap-10 py-3 md:py-20 max-md:px-5">
      <div className="w-full md:max-lg:mr-10 h-[40vh] lg:h-[88vh]">
        <div
          className="h-[100%]" // as outer container is applying x-padding 5rem
        >
          <ChatFocusContext.Provider
            value={{ isChatFocused, setIsChatFocused }}
          >
            <BotChat />
          </ChatFocusContext.Provider>
        </div>
      </div>
    </PageSection>
  )
}
