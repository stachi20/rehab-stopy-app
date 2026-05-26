import { Fragment, type ReactNode } from "react"

function parseInline(text: string, keyPrefix = ""): ReactNode[] {
  const nodes: ReactNode[] = []
  let i = 0
  let k = 0

  while (i < text.length) {
    const boldStart = text.indexOf("**", i)
    // single * search starts after current position; ignore if it's part of **
    let italicStart = -1
    for (let j = i; j < text.length; j++) {
      if (text[j] !== "*") continue
      if (text[j + 1] === "*") {
        j++
        continue
      }
      italicStart = j
      break
    }

    if (boldStart === -1 && italicStart === -1) {
      nodes.push(text.slice(i))
      break
    }

    if (boldStart !== -1 && (italicStart === -1 || boldStart < italicStart)) {
      const end = text.indexOf("**", boldStart + 2)
      if (end === -1) {
        nodes.push(text.slice(i))
        break
      }
      if (boldStart > i) nodes.push(text.slice(i, boldStart))
      nodes.push(
        <strong
          key={`${keyPrefix}b-${k++}`}
          className="font-semibold text-amber-900 bg-amber-100/70 dark:text-amber-200 dark:bg-amber-500/15 px-1 rounded-sm"
        >
          {text.slice(boldStart + 2, end)}
        </strong>
      )
      i = end + 2
    } else {
      const end = text.indexOf("*", italicStart + 1)
      if (end === -1) {
        nodes.push(text.slice(i))
        break
      }
      if (italicStart > i) nodes.push(text.slice(i, italicStart))
      nodes.push(
        <em
          key={`${keyPrefix}i-${k++}`}
          className="not-italic font-medium text-primary"
        >
          {text.slice(italicStart + 1, end)}
        </em>
      )
      i = end + 1
    }
  }

  return nodes
}

export function MD({ text }: { text: string }) {
  if (!text) return null
  const paragraphs = text.split(/\n\n+/)

  return (
    <>
      {paragraphs.map((para, pi) => {
        const lines = para.split("\n").map((l) => l.replace(/\s+$/, ""))

        const isNumbered = lines.length > 0 && lines.every((l) => /^\d+\.\s/.test(l))
        if (isNumbered) {
          return (
            <ol key={pi} className="list-decimal list-outside ml-5 space-y-1 my-2">
              {lines.map((l, li) => (
                <li key={li}>{parseInline(l.replace(/^\d+\.\s/, ""), `p${pi}l${li}-`)}</li>
              ))}
            </ol>
          )
        }

        const isBullet = lines.length > 0 && lines.every((l) => /^-\s/.test(l))
        if (isBullet) {
          return (
            <ul key={pi} className="list-disc list-outside ml-5 space-y-1 my-2">
              {lines.map((l, li) => (
                <li key={li}>{parseInline(l.replace(/^-\s/, ""), `p${pi}l${li}-`)}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={pi} className="my-2 first:mt-0 last:mb-0">
            {lines.map((l, li) => (
              <Fragment key={li}>
                {parseInline(l, `p${pi}l${li}-`)}
                {li < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        )
      })}
    </>
  )
}
