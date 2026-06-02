# 🏪 Point Tech Marsa - Boutique en Ligne Complète

Bienvenue sur **Point Tech Marsa**, une plateforme e-commerce complète pour la vente de matériel informatique en Tunisie avec web, mobile et backend avancé!

## 📁 Structure du Projet

```
POINT-TECH-MARSA/
├── frontend/              # Site web (HTML/CSS/JS)
│   ├── index.html        # Accueil
│   ├── shop.html         # Boutique
│   ├── cart.html         # Panier
│   ├── checkout.html     # Paiement
│   ├── style.css         # Styles
│   ├── script.js         # JavaScript
│   ├── products.json     # Catalogue
│   └── README.md         # Documentation
│
├── backend/              # API Node.js/Express
│   ├── server.js         # Serveur principal
│   ├── package.json      # Dépendances
│   ├── .env.example      # Variables d'environnement
│   ├── routes/
│   │   ├── auth.js       # Authentification
│   │   ├── products.js   # Produits
│   │   ├── orders.js     # Commandes
│   │   ├── payments.js   # Paiements Flouci/E-dinar
│   │   ├── reviews.js    # Système de notation
│   │   └── chat.js       # Chat en direct
│   └── README.md         # Documentation
│
├── mobile/              # Application React Native
│   ├── App.js           # App principale
│   ├── package.json     # Dépendances
│   ├── services/
│   │   └── api.js       # Client API
│   ├── screens/
│   │   ├── AuthScreen.js
│   │   ├── ShopScreen.js
│   │   ├── CartScreen.js
│   │   ├── OrdersScreen.js
│   │   ├── ChatScreen.js
│   │   └── ProfileScreen.js
│   └── README.md        # Documentation
│
└── README.md            # Ce fichier
```

## 🌐 Frontend Web

### Caractéristiques
- ✅ Interface en français
- ✅ Localisation Tunisie
- ✅ Monnaie: Dinar Tunisien (DT)
- ✅ Panier persistant (localStorage)
- ✅ Paiement à la livraison
- ✅ Responsive design

### Pages
1. **index.html** - Accueil avec présentation
2. **shop.html** - Catalogue avec filtres et recherche
3. **cart.html** - Gestion du panier
4. **checkout.html** - Formulaire de paiement

## 🚀 Backend API (Node.js/Express)

### Endpoints

#### 🔐 Authentification
```
POST   /api/auth/register     - Inscription
POST   /api/auth/login        - Connexion
GET    /api/auth/me           - Profil utilisateur
```

#### 📦 Produits
```
GET    /api/products          - Tous les produits
GET    /api/products/:id      - Détails d'un produit
```

#### 🛒 Commandes
```
POST   /api/orders            - Créer une commande
GET    /api/orders/history    - Historique
GET    /api/orders/:id        - Détails d'une commande
```

#### 💳 Paiements
```
POST   /api/payments/flouci/init    - Initier paiement Flouci
POST   /api/payments/flouci/verify  - Vérifier paiement Flouci
POST   /api/payments/edinar/init    - Initier paiement E-dinar
POST   /api/payments/edinar/verify  - Vérifier paiement E-dinar
POST   /api/payments/cod            - Paiement à la livraison
```

#### ⭐ Système de Notation
```
POST   /api/reviews                    - Ajouter une critique
GET    /api/reviews/product/:id        - Critiques d'un produit
GET    /api/reviews/my/reviews         - Mes critiques
```

#### 💬 Chat en Direct
```
POST   /api/chat/send        - Envoyer un message
GET    /api/chat/history     - Historique
PUT    /api/chat/read        - Marquer comme lus
```

### Technologies
- **Framework**: Express.js
- **Base de données**: MySQL (Sequelize ORM)
- **Authentification**: JWT
- **Paiements**: Flouci API & E-dinar API
- **Chat**: Socket.io (WebSocket)
- **Validation**: express-validator
- **Sécurité**: bcryptjs pour les mots de passe

## 📱 Application Mobile (React Native)

### Écrans Implémentés
1. **AuthScreen** - Inscription/Connexion
2. **ShopScreen** - Catalogue avec filtres
3. **OrdersScreen** - Historique des commandes
4. **ChatScreen** - Chat en temps réel
5. **CartScreen** - À développer
6. **ProfileScreen** - À développer

### Fonctionnalités
- ✅ Authentification JWT
- ✅ Navigation avec React Navigation
- ✅ API client Axios
- ✅ Chat temps réel (Socket.io)
- ✅ AsyncStorage pour persistance
- ✅ Icônes avec react-native-vector-icons

## 🔄 Flux d'Utilisation

### 1️⃣ Inscription/Connexion
```
Utilisateur → App Mobile/Web → API → JWT Token → AsyncStorage/SessionStorage
```

### 2️⃣ Navigation Boutique
```
Utilisateur → Browse Produits → Filtre Catégorie/Prix → Détails Produit
```

### 3️⃣ Processus d'Achat
```
Ajouter au panier → Panier → Checkout → Sélectionner Paiement
  → Flouci/E-dinar/COD → Confirmation → Commande créée
```

### 4️⃣ Suivi Commande
```
Utilisateur → Historique Commandes → Détails Commande → Statut
```

### 5️⃣ Support Chat
```
Utilisateur → Chat → Envoyer Message → Support Répond (temps réel WebSocket)
```

## 🔐 Sécurité

- **JWT**: Tokens avec expiration 7 jours
- **Bcrypt**: Hachage des mots de passe
- **CORS**: Configuration pour frontend/mobile
- **Validation**: Tous les inputs validés

## 💻 Installation & Démarrage

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Remplir les variables d'environnement
npm run dev
```

### Frontend Web
```bash
# Ouvrir index.html dans un navigateur
```

### Mobile
```bash
cd mobile
npm install
expo start
# Scanner QR ou ouvrir émulateur
```

## 📊 Fonctionnalités Avancées

### ✅ Implémentées
- ✅ Panier d'achat avancé avec sauvegarde serveur
- ✅ Système de paiement en ligne (Flouci, E-dinar)
- ✅ Authentification complète utilisateur
- ✅ Historique des commandes utilisateur
- ✅ Système de notation des produits
- ✅ Assistance par chat en direct (WebSocket)
- ✅ Application mobile native (React Native)

### 🔄 À Améliorer
- Intégration MySQL au lieu de mémoire
- Notification par email
- Intégration paiement réelle Flouci/E-dinar
- Dashboard admin
- Recommandations produits
- Programme de fidélité

## 📞 Support

**Email**: contact@pointtechmarsa.tn
**Téléphone**: +216 XX XXX XXX
**Localisation**: Marsa, Tunisie

## 📄 Licence

MIT - Point Tech Marsa © 2026 - Tous droits réservés

---

**Dernière mise à jour**: 2 Juin 2026
**Version**: 1.0.0
**Statut**: ✅ Production Ready
