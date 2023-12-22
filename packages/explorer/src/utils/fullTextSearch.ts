export function fullTextSearch(text: string, search: string): boolean {
  // remove case + accent + special char
  search = search
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()]/g, "");
  text = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()]/g, "");
  return text.includes(search);
}
