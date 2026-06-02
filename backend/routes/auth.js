import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Stockage en mémoire (à remplacer par MySQL)
const users = [
  {
    id: 1,
    email: 'admin@pointtechmarsa.tn',
    firstName: 'Admin',
    lastName: 'Point Tech',
    phone: '+216 00 000 000',
    password: bcrypt.hashSync('tun2626T', 10),
    role: 'admin',
    createdAt: new Date(),
  },
];

let nextUserId = 2;

// Middleware de vérification du token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

// Middleware de vérification admin
export const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs' });
  }
  next();
};

// Inscription
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('phone').trim().notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone } = req.body;

    // Vérifier si l'email existe
    if (users.find((u) => u.email === email)) {
      return res.status(409).json({ success: false, message: 'Email déjà utilisé' });
    }

    const newUser = {
      id: nextUserId++,
      email,
      firstName,
      lastName,
      phone,
      password: bcrypt.hashSync(password, 10),
      role: 'user',
      createdAt: new Date(),
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  }
);

// Connexion
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
    });
  }
);

// Récupérer le profil utilisateur
router.get('/me', verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// Lister tous les utilisateurs (admin seulement)
router.get('/users', verifyToken, verifyAdmin, (req, res) => {
  const usersList = users.map((u) => ({
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    phone: u.phone,
    role: u.role,
    createdAt: u.createdAt,
  }));

  res.json({ success: true, users: usersList, total: usersList.length });
});

// Supprimer un utilisateur (admin seulement)
router.delete('/users/:id', verifyToken, verifyAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
  }

  if (users[index].role === 'admin') {
    return res.status(403).json({ success: false, message: 'Impossible de supprimer un admin' });
  }

  const deletedUser = users.splice(index, 1);
  res.json({ success: true, message: 'Utilisateur supprimé', user: deletedUser[0] });
});

// Changer le rôle d'un utilisateur (admin seulement)
router.patch('/users/:id/role', verifyToken, verifyAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Rôle invalide' });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
  }

  user.role = role;
  res.json({ success: true, message: 'Rôle mis à jour', user });
});

export default router;
