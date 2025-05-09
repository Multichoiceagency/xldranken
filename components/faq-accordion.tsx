"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"

interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="divide-y divide-gray-200">
      {items.map((item, index) => (
        <div key={index} className="border-b border-gray-200 last:border-b-0">
          <button
            className="flex justify-between items-center w-full px-6 py-4 text-left focus:outline-none"
            onClick={() => toggleAccordion(index)}
            aria-expanded={openIndex === index}
          >
            <span className="font-medium text-gray-900">{item.question}</span>
            <FontAwesomeIcon
              icon={openIndex === index ? faChevronUp : faChevronDown}
              className={`w-5 h-5 transition-transform duration-200 ${
                openIndex === index ? "text-[#0F3059]" : "text-gray-400"
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="px-6 pb-4 text-gray-600">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
