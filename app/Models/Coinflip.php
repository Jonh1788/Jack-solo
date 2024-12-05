<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coinflip extends Model
{
    use HasFactory;

    protected $fillable = [
        'creator_id',
        'joiner_id',
        'amount',
        'status',
        'winner_side',
        'winner_id',
        'hash',
        'creator_side',
        'joiner_side',
    ];
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function joiner()
    {
        return $this->belongsTo(User::class, 'joiner_id');
    }

    public function winner()
    {
        return $this->belongsTo(User::class, 'winner_id');
    }
}