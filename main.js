import './style.css'
import Split from 'split-grid'
import { encode, decode } from 'js-base64'

const $ = (selector) => document.querySelector(selector)

const $html = $('#html')
const $js = $('#js')
const $css = $('#css')

const createHTML = ({ HTML, CSS, JS }) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        ${CSS}
      </style>
    </head>
    <body>
      ${HTML}
      <script>
        ${JS}
      </script>
    </body>
    </html>
  `
}

const update = () => {
  const HTML = $html.value
  const JS = $js.value
  const CSS = $css.value

  let hashedCode = ''

  if (HTML !== '') {
    hashedCode += `${encode(HTML)}`
  }

  if (JS !== '') {
    hashedCode += `|${encode(JS)}`
  }

  if (CSS !== '') {
    if (HTML === '') {
      hashedCode += '|'
    }
    if (JS === '') {
      hashedCode += '|'
    }
    hashedCode += `|${encode(CSS)}`
  }

  window.history.replaceState(null, null, `/${hashedCode}`)

  $('iframe').srcdoc = createHTML({ HTML, JS, CSS })
}

const codeFromURL = () => {
  if (!window.location.pathname || window.location.pathname === '/') return

  const urlSplit = window.location.pathname.slice(1).split('%7C')

  let HTML = ''
  let JS = ''
  let CSS = ''

  switch (urlSplit.length) {
    case 1:
      HTML = decode(urlSplit[0])
      JS = ''
      CSS = ''
      break
    case 2:
      HTML = decode(urlSplit[0])
      JS = decode(urlSplit[1])
      CSS = ''
      break
    case 3:
      HTML = decode(urlSplit[0])
      JS = decode(urlSplit[1])
      CSS = decode(urlSplit[2])
      break
  }

  $html.value = HTML
  $js.value = JS
  $css.value = CSS

  update()
}

codeFromURL()

Split({
  columnGutters: [
    {
      track: 1,
      element: $('.vertical-gutter')
    }
  ],
  rowGutters: [
    {
      track: 1,
      element: $('.horizontal-gutter')
    }
  ]
})

$html.addEventListener('input', update)

$js.addEventListener('input', update)

$css.addEventListener('input', update)
