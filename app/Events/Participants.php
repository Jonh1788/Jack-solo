<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Sorteio;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class Participants implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */

    public $sorteio;
    public function __construct(Sorteio $sorteio)
    {
        $this->sorteio = $sorteio;
    }


    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('jackpot-participants-' . $this->sorteio->name),
        ];
    }

    public function broadcastWith(): array 
    {
        return ['sorteio_id' => $this->sorteio->id,
                'name' => $this->sorteio->name,
                'participants' => $this->sorteio->participants,
                'date' => $this->sorteio->date,
                'end_date' => $this->sorteio->end_date];
    }
}
