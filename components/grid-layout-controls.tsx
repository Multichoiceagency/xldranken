'use client'

import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faGrip, 
  faGripVertical,
  faTableCellsLarge
} from '@fortawesome/free-solid-svg-icons'

interface GridLayoutControlsProps {
  gridSize: number
  onGridSizeChange: (size: number) => void
  sortBy: string
  onSortChange: (value: string) => void
}

const gridSizes = [
  { value: 9, label: '9 per rij' },
  { value: 12, label: '12 per rij' },
  { value: 18, label: '18 per rij' },
  { value: 24, label: '24 per rij' },
]

const sortOptions = [
  { value: 'default', label: 'Standaard sortering' },
  { value: 'price-asc', label: 'Prijs laag - hoog' },
  { value: 'price-desc', label: 'Prijs hoog - laag' },
  { value: 'name-asc', label: 'Naam A - Z' },
  { value: 'name-desc', label: 'Naam Z - A' },
]

export function GridLayoutControls({
  gridSize,
  onGridSizeChange,
  sortBy,
  onSortChange,
}: GridLayoutControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show:</span>
        <div className="flex items-center gap-1">
          {gridSizes.map((size) => (
            <Button
              key={size.value}
              variant={gridSize === size.value ? "default" : "ghost"}
              size="sm"
              onClick={() => onGridSizeChange(size.value)}
              className="px-2"
            >
              {size.value}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onGridSizeChange(9)}
          className={gridSize === 9 ? "text-primary" : "text-muted-foreground"}
        >
          <FontAwesomeIcon icon={faGrip} className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onGridSizeChange(12)}
          className={gridSize === 12 ? "text-primary" : "text-muted-foreground"}
        >
          <FontAwesomeIcon icon={faGripVertical} className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onGridSizeChange(24)}
          className={gridSize === 24 ? "text-primary" : "text-muted-foreground"}
        >
          <FontAwesomeIcon icon={faTableCellsLarge} className="h-4 w-4" />
        </Button>
      </div>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sorteer op" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

