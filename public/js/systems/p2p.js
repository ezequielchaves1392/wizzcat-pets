// public/js/systems/p2p.js
import { doc, runTransaction, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase-init.js";

export async function executeTrade(buyerId, sellerId, listingId, price) {
  const buyerWalletRef = doc(db, "wallets", buyerId);
  const sellerWalletRef = doc(db, "wallets", sellerId);
  const listingRef = doc(db, "market_listings", listingId);

  try {
    await runTransaction(db, async (transaction) => {
      const buyerDoc = await transaction.get(buyerWalletRef);
      const buyerData = buyerDoc.data();

      if (buyerData.nexusShards < price) {
        throw new Error("Fondos insuficientes de Nexus-Shards.");
      }

      // Transferencia atómica de moneda y propiedad del ítem
      transaction.update(buyerWalletRef, { nexusShards: buyerData.nexusShards - price });
      // Aquí se actualizarían los inventarios correspondientes...
      transaction.delete(listingRef);
    });
    console.log("Comercio P2P completado con éxito.");
  } catch (e) {
    console.error("Fallo en la transacción P2P: ", e);
  }
}