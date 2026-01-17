import { getSetting } from './db';

const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    PLN: 'zł',
    JPY: '¥',
};

export function getCurrencySymbol() {
    const currency = getSetting('currency') || 'USD';
    return currencySymbols[currency] || currency;
}

export function formatCurrency(amount: number) {
    const currency = getSetting('currency') || 'USD';
    const symbol = currencySymbols[currency] || currency;

    // For currencies like PLN, the symbol usually follows the amount
    if (currency === 'PLN') {
        return `${amount.toFixed(2)} ${symbol}`;
    }

    return `${symbol}${amount.toFixed(2)}`;
}
