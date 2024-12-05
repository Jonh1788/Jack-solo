<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Coinflip;
use App\Jobs\ResolveCoinflip;
use App\Events\CoinflipCreated;

class CoinflipController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
    
        // Coinflips pendentes para exibir na lista
        $coinflips = Coinflip::where('status', 'pending')->with('creator')->get();
    
        // Coinflips concluídos para calcular estatísticas gerais
        $completedCoinflips = Coinflip::where('status', 'completed')->get();
    
        // Valores investidos (soma de todos os coinflips concluídos)
        $totalInvested = $completedCoinflips->sum('amount') * 2; // Multiplicamos por 2 porque cada coinflip tem duas apostas
    
        // Quantidade de jogos (número de coinflips concluídos)
        $totalGames = $completedCoinflips->count();
    
        // Coinflips do usuário para calcular estatísticas pessoais
        $userCoinflips = Coinflip::where(function($query) use ($user) {
            $query->where('creator_id', $user->id)
                  ->orWhere('joiner_id', $user->id);
        })->where('status', 'completed')->get();
    
        // Meu investimento (soma das apostas do usuário)
        $userInvestment = $userCoinflips->sum('amount');
    
        // Ganhos e perdas do usuário
        $userWins = $userCoinflips->where('winner_id', $user->id)->sum('amount') * 2; // O usuário ganha o dobro do valor apostado
        $userLosses = $userInvestment - ($userWins / 2); // Perdas são o investimento menos o que foi recuperado nas vitórias
    
        // Total ganho (lucro líquido)
        $totalProfit = $userWins - $userInvestment * 2; // Ganhos menos o total apostado
    
        // Passar as estatísticas para a view
        return Inertia::render('Coinflip', [
            'coinflips' => $coinflips,
            'totalInvested' => $totalInvested,
            'totalGames' => $totalGames,
            'userInvestment' => $userInvestment,
            'userWins' => $userWins,
            'userLosses' => $userLosses,
            'totalProfit' => $totalProfit,
        ]);
    }

    public function create(Request $request)
{
    $user = $request->user();
    $amount = $request->input('amount');

    // Validate the amount
    $request->validate([
        'amount' => 'required|numeric|min:1',
    ]);

    // Check if user has enough balance
    if ($user->balance < $amount) {
        return response()->json(['error' => 'Saldo insuficiente'], 400);
    }

    // Deduct the amount from the user's balance
    $user->balance -= $amount;
    $user->save();

    // Create the coinflip
    $coinflip = Coinflip::create([
        'creator_id' => $user->id,
        'amount' => $amount,
        'status' => 'pending',
        'creator_side' => 'heads', // O criador é "cara"
    ]);
    event(new CoinflipCreated($coinflip));
    return response()->json(['coinflip' => $coinflip], 201);
}

public function join(Request $request, $id)
{
    $user = $request->user();
    $coinflip = Coinflip::find($id);

    if (!$coinflip || $coinflip->status !== 'pending') {
        return response()->json(['error' => 'Coinflip não disponível'], 404);
    }

    // Check if user is not the creator
    if ($coinflip->creator_id === $user->id) {
        return response()->json(['error' => 'Você não pode entrar no seu próprio Coinflip'], 400);
    }

    // Check if user has enough balance
    if ($user->balance < $coinflip->amount) {
        return response()->json(['error' => 'Saldo insuficiente'], 400);
    }

    // Deduct the amount from the user's balance
    $user->balance -= $coinflip->amount;
    $user->save();

    // Update the coinflip
    $coinflip->joiner_id = $user->id;
    $coinflip->joiner_side = 'tails'; // O participante é "coroa"
    $coinflip->status = 'ongoing';
    $coinflip->save();

    // Dispatch job to resolve the coinflip
    ResolveCoinflip::dispatch($coinflip->id);

    return response()->json(['coinflip' => $coinflip], 200);
}
}
