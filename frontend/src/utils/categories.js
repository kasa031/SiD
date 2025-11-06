// Sentral kategori-konfigurasjon for SiD
// Alle komponenter skal bruke denne for konsistens

export const CATEGORIES = [
  { value: 'miljo', label: 'Miljø' },
  { value: 'samfunn', label: 'Samfunn' },
  { value: 'helse', label: 'Helse' },
  { value: 'utdanning', label: 'Utdanning' },
  { value: 'transport', label: 'Transport' },
  { value: 'okonomi', label: 'Økonomi' },
  { value: 'politikk', label: 'Politikk' },
  { value: 'kultur', label: 'Kultur' },
];

// Hjelpefunksjon for å få kategori-label fra value
export const getCategoryLabel = (value) => {
  const category = CATEGORIES.find(cat => cat.value === value);
  return category ? category.label : value;
};

// Hjelpefunksjon for å sjekke om en kategori er gyldig
export const isValidCategory = (value) => {
  return CATEGORIES.some(cat => cat.value === value);
};

