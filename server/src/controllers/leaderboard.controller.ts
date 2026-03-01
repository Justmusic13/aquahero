import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

const AVATAR_NAMES: Record<number, string> = {
  1: 'Robo Splash',
  2: 'Dino Drop',
  3: 'Cosmo Rinse',
  4: 'Dusty Lather',
  5: 'Astro Bubble',
  6: 'Shadow Suds',
};

const NPC_BASE_POINTS: Record<number, number> = {
  1: 850,
  2: 620,
  3: 940,
  4: 530,
  5: 770,
  6: 710,
};

export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get real players with today's shower status
    const result = await query(`
      SELECT p.child_name, p.points, p.avatar_id,
        EXISTS(
          SELECT 1 FROM shower_logs sl 
          WHERE sl.profile_id = p.id 
          AND sl.created_at >= CURRENT_DATE
        ) as has_showered_today
      FROM profiles p
      ORDER BY p.points DESC
    `);

    const realPlayers = result.rows;
    const usedAvatarIds = new Set(realPlayers.map((p: any) => p.avatar_id));

    // Generate NPC entries for unused avatars
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const hourOfDay = today.getHours();

    const npcEntries = [];
    for (let avatarId = 1; avatarId <= 6; avatarId++) {
      if (usedAvatarIds.has(avatarId)) continue;

      // Deterministic daily variation based on avatar and day
      const dailySeed = (avatarId * 137 + dayOfYear * 31) % 100;
      const hourBonus = Math.floor((hourOfDay / 24) * 50); // Points accumulate through the day
      const basePoints = NPC_BASE_POINTS[avatarId] || 500;
      const npcPoints = basePoints + dailySeed + hourBonus;

      // NPCs "shower" at different times throughout the day
      const npcShowerHour = (avatarId * 3 + 6) % 20 + 5; // Between 5 AM and midnight-ish
      const hasShowered = hourOfDay >= npcShowerHour;

      npcEntries.push({
        child_name: AVATAR_NAMES[avatarId],
        points: npcPoints,
        avatar_id: avatarId,
        is_npc: true,
        has_showered_today: hasShowered,
      });
    }

    // Combine and sort
    const allEntries = [
      ...realPlayers.map((p: any) => ({ ...p, is_npc: false, has_showered_today: p.has_showered_today })),
      ...npcEntries,
    ]
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({
        rank: index + 1,
        ...entry,
      }));

    res.json(allEntries);
  } catch (error) {
    next(error);
  }
};
