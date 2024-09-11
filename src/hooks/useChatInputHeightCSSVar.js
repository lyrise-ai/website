function useChatInputHeightCSSVar() {
  function setHeight(value) {
    document.documentElement.style.setProperty('--chat-input-height', value)
  }

  function resetHeight() {
    setHeight('1.2lh')
  }

  return {
    set: setHeight,
    reset: resetHeight,
  }
}
