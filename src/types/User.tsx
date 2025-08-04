export interface User {
  userId: number;
  auth0UserId?: string; // Optionnel car pas présent dans votre modèle backend
  firstName: string;
  lastName: string;
  email: string;
  picture?: string; // Pas dans le backend mais utile pour l'affichage
  createdAt: Date;
}

export interface UserDto {
  auth0UserId: string;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
}

export interface UserResponse {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}
