<?php

namespace App\Events;

use App\Models\Coinflip;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class CoinflipResolved implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $coinflip;

    public function __construct(Coinflip $coinflip)
    {
        $this->coinflip = $coinflip;
    }

    public function broadcastOn()
    {
        return new Channel('coinflip-resolved');
    }

    public function broadcastWith()
    {
        return [
            'coinflip' => $this->coinflip->load('creator', 'joiner', 'winner'),
        ];
    }
}