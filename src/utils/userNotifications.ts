import { notifications } from '@mantine/notifications';

export const showSuccessNotification = (message: string) => {
  notifications.show({
    title: 'Succès',
    message,
    color: 'green',
  });
};

export const showErrorNotification = (message: string) => {
  notifications.show({
    title: 'Erreur',
    message,
    color: 'red',
  });
};

export const showInfoNotification = (message: string) => {
  notifications.show({
    title: 'Information',
    message,
    color: 'blue',
  });
};

export const showUserCreatedNotification = (userName: string) => {
  notifications.show({
    title: 'Bienvenue !',
    message: `Compte créé avec succès pour ${userName}`,
    color: 'green',
    autoClose: 5000,
  });
};

export const showUserWelcomeBackNotification = (userName: string) => {
  notifications.show({
    title: 'Bon retour !',
    message: `Connexion réussie, ${userName}`,
    color: 'blue',
    autoClose: 3000,
  });
};

export const showDiveAddedNotification = () => {
  notifications.show({
    title: 'Plongée ajoutée !',
    message: 'Votre plongée a été enregistrée avec succès',
    color: 'green',
    autoClose: 3000,
  });
};

export const showDiveErrorNotification = (error?: string) => {
  notifications.show({
    title: 'Erreur',
    message: error || 'Impossible d\'ajouter la plongée. Veuillez réessayer.',
    color: 'red',
    autoClose: 5000,
  });
};

export const showAuthErrorNotification = (message?: string) => {
  notifications.show({
    title: 'Problème de connexion',
    message: message || 'Un problème est survenu lors de la connexion. Certaines fonctionnalités peuvent être limitées.',
    color: 'orange',
    autoClose: 7000,
  });
};
