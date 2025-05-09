"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faTimes, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { faqData } from "@/lib/faq-data"

interface SearchResult {
  categoryId: string
  categoryName: string
  questionIndex: number
  question: string
  answer: string
  score: number
}

export function FaqSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchResultsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Search function
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results: SearchResult[] = []
    const searchTerms = query
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 2)

    // If no valid search terms, return empty results
    if (searchTerms.length === 0) {
      setSearchResults([])
      return
    }

    // Search through all FAQ items
    faqData.forEach((category) => {
      const categoryId = category.category.toLowerCase().replace(/\s+/g, "-")

      category.questions.forEach((item, questionIndex) => {
        const questionText = item.question.toLowerCase()
        const answerText = item.answer.toLowerCase()

        // Calculate score based on matches in question and answer
        let score = 0

        // Question matches are weighted higher
        searchTerms.forEach((term) => {
          // Exact matches in question get highest score
          if (questionText.includes(term)) {
            score += 10

            // Bonus for exact phrase match
            if (questionText.includes(query.toLowerCase())) {
              score += 50
            }

            // Bonus for word boundary matches
            const wordBoundaryRegex = new RegExp(`\\b${term}\\b`, "i")
            if (wordBoundaryRegex.test(questionText)) {
              score += 5
            }
          }

          // Answer matches get lower score
          if (answerText.includes(term)) {
            score += 5

            // Bonus for exact phrase match
            if (answerText.includes(query.toLowerCase())) {
              score += 20
            }

            // Bonus for word boundary matches
            const wordBoundaryRegex = new RegExp(`\\b${term}\\b`, "i")
            if (wordBoundaryRegex.test(answerText)) {
              score += 2
            }
          }
        })

        // Only include results with a score
        if (score > 0) {
          results.push({
            categoryId,
            categoryName: category.category,
            questionIndex,
            question: item.question,
            answer: item.answer,
            score,
          })
        }
      })
    })

    // Sort results by score (highest first)
    results.sort((a, b) => b.score - a.score)

    // Limit to top 5 results
    setSearchResults(results.slice(0, 5))
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim()) {
      setIsSearching(true)
      performSearch(query)
      setShowResults(true)
    } else {
      setIsSearching(false)
      setSearchResults([])
      setShowResults(false)
    }
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery)
      setShowResults(true)
      inputRef.current?.blur()
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowResults(false)
    setIsSearching(false)
  }

  // Navigate to a search result
  const navigateToResult = (result: SearchResult) => {
    // Close search results
    setShowResults(false)

    // Scroll to the category section
    const categoryElement = document.getElementById(result.categoryId)
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: "smooth" })

      // After scrolling to category, find and open the specific question
      setTimeout(() => {
        // Find the question button by index and click it to open
        const questionButtons = categoryElement.querySelectorAll("button[aria-expanded]")
        if (questionButtons && questionButtons[result.questionIndex]) {
          const button = questionButtons[result.questionIndex] as HTMLButtonElement
          if (button.getAttribute("aria-expanded") === "false") {
            button.click()
          }

          // Highlight the question temporarily
          button.classList.add("bg-yellow-50")
          setTimeout(() => {
            button.classList.remove("bg-yellow-50")
          }, 2000)
        }
      }, 500)
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Zoek in veelgestelde vragen..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowResults(true)
            }
          }}
          className="w-full px-4 py-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3059] focus:border-transparent shadow-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 w-5 h-5" />
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Zoekopdracht wissen"
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-400 w-5 h-5 hover:text-gray-600" />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div
          ref={searchResultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-lg z-10 max-h-[70vh] overflow-auto"
        >
          {isSearching && searchResults.length === 0 && (
            <div className="p-4 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
              </div>
            </div>
          )}

          {!isSearching && searchResults.length === 0 && searchQuery.trim() !== "" && (
            <div className="p-4 text-center text-gray-500">Geen resultaten gevonden voor "{searchQuery}"</div>
          )}

          {searchResults.length > 0 && (
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-500">
                {searchResults.length} {searchResults.length === 1 ? "resultaat" : "resultaten"} gevonden
              </div>

              {searchResults.map((result, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start"
                  onClick={() => navigateToResult(result)}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{result.question}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{result.answer}</p>
                    <p className="text-xs text-[#0F3059] mt-1">Categorie: {result.categoryName}</p>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 w-4 h-4 mt-1 ml-2 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
