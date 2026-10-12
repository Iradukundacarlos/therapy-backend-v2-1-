// ============================================
// DATABASE MODEL REGISTRY
// ============================================
// Importing models/index.js loads EVERY model file (each one calls Model.init(),
// which tells Sequelize about the table) and sets up the relationships.
// Import this file once at the start (index.js and the scripts do it).

import "./models/index.js";
