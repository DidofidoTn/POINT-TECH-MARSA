# 📱 Point Tech Marsa - React Native App

Application mobile React Native pour la boutique en ligne Point Tech Marsa avec intégration complète du backend Node.js.

## 🚀 Installation

```bash
cd mobile
npm install
```

## ▶️ Démarrage

```bash
expo start
```

### Sur Android
```bash
expo start --android
```

### Sur iOS
```bash
expo start --ios
```

## 📋 Fonctionnalités

### ✅ Implémentées
- ✅ Authentification (inscription/connexion)
- ✅ Boutique de produits avec filtres
- ✅ Système de notation et critiques
- ✅ Historique des commandes
- ✅ Chat en direct avec support
- ✅ Intégration backend API

### 🔄 En cours de développement
- 🔄 Panier d'achat
- 🔄 Profil utilisateur
- 🔄 Paiement Flouci
- 🔄 Paiement E-dinar
- 🔄 Système de notification

## 📡 Configuration API

Modifier l'URL API dans `services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // Votre URL backend
```

## 📚 Écrans

### ShopScreen
- Liste des produits
- Filtrage par catégorie
- Affichage des notes et critiques
- Bouton "Ajouter au panier"

### OrdersScreen
- Historique de toutes les commandes
- Statut de chaque commande
- Dates et montants

### ChatScreen
- Chat en temps réel avec le support
- Historique des messages
- Envoi/réception de messages

### AuthScreen
- Connexion
- Inscription avec tous les champs
- Gestion des tokens JWT

### CartScreen
- À développer

### ProfileScreen
- À développer

## 🔐 Authentification

Les tokens JWT sont stockés dans AsyncStorage:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const token = await AsyncStorage.getItem('authToken');
```

## 📦 Dépendances principales

- `react-native`: Framework mobile
- `expo`: Plateforme de développement
- `@react-navigation`: Navigation
- `axios`: Client HTTP
- `socket.io-client`: Chat en temps réel
- `react-native-vector-icons`: Icônes

## 🐛 Dépannage

- **Erreur de connexion**: Vérifier l'URL API et que le backend fonctionne
- **Erreur d'authentification**: Vérifier les variables JWT_SECRET
- **Erreur de navigation**: Vérifier les imports des écrans

## 📄 Licence

MIT - Point Tech Marsa © 2026
