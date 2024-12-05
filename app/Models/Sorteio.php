<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sorteio extends Model
{
    use HasFactory;

    protected $table = 'sorteio';
    protected $guarded = [];

    protected $casts = [
        'participants' => 'array',
        'date' => 'datetime',
        'end_date' => 'datetime',
        'finished' => 'boolean'
    ];
    public function addParticipants(int $userId, int $amount, string $userName, $profile_image){

        $startNumber = $this->total_numbers + 1;
        $endNumber = $this->total_numbers + $amount;

        $participant = [
            'user_id' => $userId,
            'numbers' => range($startNumber, $endNumber),
            'name' => $userName,
            'profile_image' => $profile_image ?? null
        ];

        $participants = $this->participants ?: [];

        $participants[] = $participant;

        $this->participants = $participants;
        $this->total_numbers = $endNumber;
        $this->prize = $this->prize + $amount;
        $this->save();

    }

}
