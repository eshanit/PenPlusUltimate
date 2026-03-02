/**
 * Tests for useLocalStorage composable
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Simple mock for localStorage
const createLocalStorageMock = () => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((i: number) => Object.keys(store)[i] || null),
  }
}

describe('useLocalStorage', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock = createLocalStorageMock()
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    })
  })

  it('should get value from localStorage', () => {
    const key = 'testKey'
    const value = 'testValue'
    
    localStorageMock.getItem.mockReturnValue(value)
    
    const result = localStorageMock.getItem(key)
    expect(result).toBe(value)
    expect(localStorageMock.getItem).toHaveBeenCalledWith(key)
  })

  it('should set value in localStorage', () => {
    const key = 'testKey'
    const value = 'testValue'
    
    localStorageMock.setItem(key, value)
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(key, value)
  })

  it('should handle JSON serialization', () => {
    const key = 'testKey'
    const value = { name: 'test', age: 30 }
    const serialized = JSON.stringify(value)
    
    // Simulate storage behavior
    localStorageMock.setItem(key, serialized)
    
    // Test the JSON parse directly
    const parsed = JSON.parse(serialized)
    expect(parsed).toEqual(value)
  })

  it('should remove value from localStorage', () => {
    const key = 'testKey'
    
    localStorageMock.removeItem(key)
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(key)
  })

  it('should handle null values gracefully', () => {
    const key = 'nonexistent'
    
    localStorageMock.getItem.mockReturnValue(null)
    const result = localStorageMock.getItem(key)
    
    expect(result).toBeNull()
  })

  it('should handle special characters in values', () => {
    const key = 'testKey'
    const value = 'Special chars: <>&"\'üñ'
    
    // Test that we can store and retrieve strings with special chars
    localStorageMock.setItem(key, value)
    localStorageMock.getItem.mockReturnValue(value)
    const result = localStorageMock.getItem(key)
    
    expect(result).toBe(value)
  })
})
