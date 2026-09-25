export interface PetStats {
  hunger: number;
  energy: number;
  happiness: number;
  health: number;
}

export class PetEngine {
  // Tasas de decaimiento por minuto
  private static DECAY_RATES = {
    hunger: 0.5,
    energy: 0.3,
    happiness: 0.4,
    health: 0.2
  };

  public static calculatePassiveDecay(stats: PetStats, lastUpdatedTimestamp: number): PetStats {
    const now = Date.now();
    const elapsedMinutes = (now - lastUpdatedTimestamp) / (1000 * 60);

    let newHunger = Math.max(0, stats.hunger - (this.DECAY_RATES.hunger * elapsedMinutes));
    let newEnergy = Math.min(100, stats.energy + (this.DECAY_RATES.energy * elapsedMinutes)); // Recupera algo durmiendo
    let newHappiness = Math.max(0, stats.happiness - (this.DECAY_RATES.happiness * elapsedMinutes));
    let newHealth = stats.health;

    // Si el hambre o la felicidad llegan a 0, la salud comienza a deteriorarse
    if (newHunger === 0 || newHappiness === 0) {
      newHealth = Math.max(0, newHealth - (this.DECAY_RATES.health * elapsedMinutes));
    }

    return {
      hunger: Math.round(newHunger),
      energy: Math.round(newEnergy),
      happiness: Math.round(newHappiness),
      health: Math.round(newHealth)
    };
  }

  public static evaluatePersonality(stats: PetStats): 'balanced' | 'rebellious' | 'lazy' | 'genius' {
    if (stats.happiness < 30) return 'rebellious';
    if (stats.energy > 80 && stats.hunger > 50) return 'lazy';
    return 'balanced';
  }
}