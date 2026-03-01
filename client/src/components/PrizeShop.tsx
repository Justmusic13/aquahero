import React, { useState, useEffect } from 'react';
import { Prize } from '@/types';
import * as prizeService from '@/services/prize.service';
import { useAuth } from '@/hooks/useAuth';

interface PrizeShopProps {
  compact?: boolean;
}

const PrizeShop: React.FC<PrizeShopProps> = ({ compact = false }) => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [message, setMessage] = useState('');
  const { profile, reloadProfile } = useAuth();

  useEffect(() => {
    fetchPrizes();
  }, []);

  const fetchPrizes = async () => {
    try {
      const data = await prizeService.getPrizes();
      setPrizes(data);
    } catch (error) {
      console.error('Failed to fetch prizes', error);
    }
  };

  const handleRedeem = async (prize: Prize) => {
    if (!profile || profile.points < prize.point_cost) {
      setMessage('Not enough points!');
      return;
    }
    try {
      await prizeService.redeemPrize(prize.id);
      setMessage(`🎉 You redeemed "${prize.title}"!`);
      await reloadProfile();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to redeem prize');
    }
  };

  if (prizes.length === 0) {
    return compact ? null : (
      <div className="text-center p-4 text-gray-500">
        <p>No prizes set up yet! Ask a parent to add prizes in Settings.</p>
      </div>
    );
  }

  if (compact) {
    // Show a teaser with the closest reachable prize
    const sortedByReachability = [...prizes].sort((a, b) => {
      const diffA = a.point_cost - (profile?.points || 0);
      const diffB = b.point_cost - (profile?.points || 0);
      if (diffA <= 0 && diffB <= 0) return diffA - diffB;
      if (diffA <= 0) return -1;
      if (diffB <= 0) return 1;
      return diffA - diffB;
    });
    const nextPrize = sortedByReachability[0];
    const canAfford = (profile?.points || 0) >= nextPrize.point_cost;

    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{nextPrize.image_url ? '🎁' : '🏆'}</span>
          <div className="flex-1">
            <p className="font-bold text-sm">{canAfford ? '🎉 You can redeem:' : '🎯 Next prize:'}</p>
            <p className="font-bold">{nextPrize.title}</p>
            <p className="text-sm text-gray-600">
              {canAfford
                ? `${nextPrize.point_cost} pts — You have enough!`
                : `${nextPrize.point_cost - (profile?.points || 0)} more points to go!`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">🏆 Prize Shop</h3>
      {message && (
        <div className="p-3 rounded-lg bg-green-100 text-green-800 mb-4 text-center font-bold">
          {message}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prizes.map(prize => {
          const canAfford = (profile?.points || 0) >= prize.point_cost;
          return (
            <div
              key={prize.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                canAfford ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              {prize.image_url && (
                <img
                  src={prize.image_url}
                  alt={prize.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <h4 className="font-bold text-lg">{prize.title}</h4>
              {prize.description && <p className="text-sm text-gray-600 mb-2">{prize.description}</p>}
              <div className="flex justify-between items-center mt-3">
                <span className="font-bold text-lg">⭐ {prize.point_cost}</span>
                <button
                  onClick={() => handleRedeem(prize)}
                  disabled={!canAfford}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                    canAfford
                      ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Redeem!' : `Need ${prize.point_cost - (profile?.points || 0)} more`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrizeShop;
