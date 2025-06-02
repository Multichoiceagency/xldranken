export function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) {
    return 0
  }

  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  const longerLength = longer.length
  if (longerLength === 0) {
    return 1.0
  }

  const distance = editDistance(longer, shorter)
  return (longerLength - distance) / longerLength
}

function editDistance(str1: string, str2: string): number {
  str1 = str1.toLowerCase()
  str2 = str2.toLowerCase()

  const costs = new Array()
  for (let i = 0; i <= str1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= str2.length; j++) {
      if (i === 0) costs[j] = j
      else {
        if (j > 0) {
          let newValue = costs[j - 1]
          if (str1.charAt(i - 1) !== str2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }
    if (i > 0) costs[str2.length] = lastValue
  }
  return costs[str2.length]
}
