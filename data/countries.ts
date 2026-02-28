export type Country = {
  name: string;
  code?: string;
  cities: string[];
};

// Small curated dataset for autocomplete demo. Replace with a full dataset or API.
export const countries: Country[] = [
  { name: 'United States', code: 'US', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia'] },
  { name: 'United Kingdom', code: 'GB', cities: ['London', 'Manchester', 'Birmingham', 'Leeds'] },
  { name: 'Canada', code: 'CA', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'] },
  { name: 'Australia', code: 'AU', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'] },
  { name: 'India', code: 'IN', cities: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai'] },
];
