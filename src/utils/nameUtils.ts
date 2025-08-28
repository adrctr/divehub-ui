/**
 * Utilitaires pour la gestion des noms d'utilisateurs
 */

export interface NameParts {
  firstName: string;
  lastName: string;
}

/**
 * Sépare un nom complet en prénom et nom de famille
 * @param fullName Le nom complet (ex: "Jean Dupont")
 * @returns Objet avec firstName et lastName
 */
export function splitFullName(fullName: string): NameParts {
  const trimmedName = fullName.trim();
  
  if (!trimmedName) {
    return { firstName: '', lastName: '' };
  }
  
  const nameParts = trimmedName.split(' ');
  
  if (nameParts.length === 1) {
    // Un seul nom, on le considère comme prénom
    return { firstName: nameParts[0], lastName: '' };
  }
  
  // Premier élément = prénom, le reste = nom de famille
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  
  return { firstName, lastName };
}

/**
 * Combine un prénom et nom de famille en nom complet
 * @param firstName Le prénom
 * @param lastName Le nom de famille
 * @returns Le nom complet
 */
export function combineNames(firstName?: string, lastName?: string): string {
  const first = typeof firstName === "string" ? firstName.trim() : "";
  const last = typeof lastName === "string" ? lastName.trim() : "";
  
  if (!first && !last) return '';
  if (!first) return last;
  if (!last) return first;
  
  return `${first} ${last}`;
}

/**
 * Génère des initiales à partir d'un prénom et nom de famille
 * @param firstName Le prénom
 * @param lastName Le nom de famille
 * @returns Les initiales (ex: "JD" pour "Jean Dupont")
 */
export function getInitials(firstName?: string, lastName?: string): string {
  const first = typeof firstName === "string" ? firstName.trim() : "";
  const last = typeof lastName === "string" ? lastName.trim() : "";
  
  let initials = '';
  if (first) initials += first.charAt(0).toUpperCase();
  if (last) initials += last.charAt(0).toUpperCase();
  
  return initials || '?';
}
