import express from 'express';
import { verifyToken, verifyAdmin } from './auth.js';

const router = express.Router();

// Stockage en mémoire
const products = [
  { id: 1, name: 'Ordinateur Portable DELL', category: 'ordinateurs', price: 1500, stock: 10, rating: 4.5, reviewCount: 25 },
  { id: 2, name: 'Ordinateur Portable HP', category: 'ordinateurs', price: 1200, stock: 15, rating: 4.3, reviewCount: 18 },
  { id: 3, name: 'Ordinateur de Bureau Asus', category: 'ordinateurs', price: 2000, stock: 8, rating: 4.7, reviewCount: 32 },
  { id: 4, name: 'Souris Logitech', category: 'peripheriques', price: 45, stock: 50, rating: 4.6, reviewCount: 40 },
  { id: 5, name: 'Clavier Mécanique RGB', category: 'peripheriques', price: 120, stock: 30, rating: 4.8, reviewCount: 55 },
];

let nextProductId = 6;

// Récupérer tous les produits
router.get('/', (req, res) => {
  const { category } = req.query;
  
  let filtered = products;
  if (category) {
    filtered = products.filter((p) => p.category === category);
  }

  res.json({ success: true, products: filtered, total: filtered.length });
});

// Récupérer un produit par ID
router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ success: false, message: 'Produit non trouvé' });
  }

  res.json({ success: true, product });
});

// Ajouter un produit (admin seulement)
router.post('/', verifyToken, verifyAdmin, (req, res) => {
  const { name, category, price, stock } = req.body;

  if (!name || !category || !price || stock === undefined) {
    return res.status(400).json({ success: false, message: 'Données manquantes' });
  }

  const newProduct = {
    id: nextProductId++,
    name,
    category,
    price,
    stock,
    rating: 0,
    reviewCount: 0,
  };

  products.push(newProduct);
  res.status(201).json({ success: true, message: 'Produit créé', product: newProduct });
});

// Mettre à jour un produit (admin seulement)
router.put('/:id', verifyToken, verifyAdmin, (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ success: false, message: 'Produit non trouvé' });
  }

  Object.assign(product, req.body);
  res.json({ success: true, message: 'Produit mis à jour', product });
});

// Supprimer un produit (admin seulement)
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Produit non trouvé' });
  }

  const deletedProduct = products.splice(index, 1);
  res.json({ success: true, message: 'Produit supprimé', product: deletedProduct[0] });
});

export default router;
