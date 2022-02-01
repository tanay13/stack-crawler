var admin = require("firebase-admin");

var serviceAccount = require("../../db.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("COnnected");
} catch (e) {
  console.log(e);
}
const db = admin.firestore();
exports.db = db;
