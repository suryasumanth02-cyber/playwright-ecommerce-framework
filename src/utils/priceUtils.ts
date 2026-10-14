export class PriceUtils {
  /**
   * Extracts a numeric float value from a price string (e.g., "$29.99" -> 29.99, "Item total: $29.99" -> 29.99)
   */
  static extractPrice(text: string): number {
    const match = text.match(/[\d,.]+/);
    if (!match) {
      throw new Error(`Unable to extract price from string: "${text}"`);
    }
    const cleanNumber = match[0].replace(/,/g, '');
    return parseFloat(cleanNumber);
  }

  /**
   * Rounds a number to exactly two decimal places
   */
  static round(val: number): number {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  }

  /**
   * Calculates sum of item prices
   */
  static sumPrices(prices: number[]): number {
    const sum = prices.reduce((acc, curr) => acc + curr, 0);
    return this.round(sum);
  }

  /**
   * Verifies if an array of numbers is strictly ascending or equal
   */
  static isSortedAscending(numbers: number[]): boolean {
    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] > numbers[i + 1]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Verifies if an array of numbers is strictly descending or equal
   */
  static isSortedDescending(numbers: number[]): boolean {
    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] < numbers[i + 1]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Verifies if an array of strings is sorted alphabetically
   */
  static isAlphabetical(strings: string[], descending = false): boolean {
    const sorted = [...strings].sort((a, b) =>
      descending ? b.localeCompare(a) : a.localeCompare(b)
    );
    return JSON.stringify(strings) === JSON.stringify(sorted);
  }
}
