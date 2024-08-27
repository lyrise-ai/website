import { useEffect } from 'react'

const useScript = (url, async, type, innerHTML) => {
  useEffect(() => {
    const script = document.createElement('script')

    if (url) script.src = url

    if (type) script.type = type

    script.innerText = innerHTML

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
    // eslint-disable-next-line
  }, [url, innerHTML])
}

export default useScript