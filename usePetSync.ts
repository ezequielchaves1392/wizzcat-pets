import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Tu configuración de Firebase
import { PetEngine, PetStats } from './petEngine';

interface PetData {
  name: string;
  stage: string;
  stats: PetStats;
  lastUpdated: number;
}

export function usePetSync(petId: string) {
  const [pet, setPet] = useState<PetData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!petId) return;

    const petRef = doc(db, 'pets', petId);

    // Suscripción en tiempo real a Firestore
    const unsubscribe = onSnapshot(petRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PetData;
        
        // 1. Calcular el decaimiento pasivo basado en el tiempo que pasó offline
        const updatedStats = PetEngine.calculatePassiveDecay(data.stats, data.lastUpdated);
        const newPersonality = PetEngine.evaluatePersonality(updatedStats);

        const currentTimestamp = Date.now();

        // 2. Actualizar Firestore silenciosamente si hubo cambios pasivos significativos
        if (updatedStats.hunger !== data.stats.hunger || updatedStats.health !== data.stats.health) {
          await updateDoc(petRef, {
            stats: updatedStats,
            personality: newPersonality,
            lastUpdated: currentTimestamp
          });
        }

        setPet({
          ...data,
          stats: updatedStats
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error al sincronizar la mascota:", error);
      setLoading(false);
    });

    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, [petId]);

  return { pet, loading };
}