<?php

namespace App\Jobs;

use App\Models\Coinflip;
use App\Models\User;
use App\Events\CoinflipResolved;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Bus\Dispatchable;

class ResolveCoinflip implements ShouldQueue
{
    use Dispatchable, Queueable, SerializesModels;

    protected $coinflipId;

    public function __construct($coinflipId)
    {
        $this->coinflipId = $coinflipId;
    }

    public function handle()
    {
        $coinflip = Coinflip::find($this->coinflipId);

        if (!$coinflip || $coinflip->status !== 'ongoing') {
            return;
        }

        // Generate a hash for fairness
        $hashData = $coinflip->id . $coinflip->creator_id . $coinflip->joiner_id . $coinflip->amount . now();
        $hash = hash('sha256', $hashData);
        $coinflip->hash = $hash;

        // Determine the winner
        $seed = hexdec(substr($hash, 0, 8));
        mt_srand($seed);
        $winnerSide = mt_rand(0, 1) === 0 ? 'heads' : 'tails';

        // Assign winner
        $winnerId = $winnerSide === $coinflip->creator_side ? $coinflip->creator_id : $coinflip->joiner_id;
        $coinflip->winner_side = $winnerSide;
        $coinflip->winner_id = $winnerId;
        $coinflip->status = 'completed';
        $coinflip->save();

        // Update winner's balance
        $winner = User::find($winnerId);
        $totalAmount = $coinflip->amount * 2;
        $fee = $totalAmount * 0.1; // 10% fee
        $winner->balance += ($totalAmount - $fee);
        $winner->save();

        // Broadcast the result
        event(new CoinflipResolved($coinflip));
    }
}