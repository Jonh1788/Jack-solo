<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sorteio;
use Carbon\Carbon;
use App\Events\Participants;
use App\Events\InicioSorteio;
use Illuminate\Support\Facades\DB;
use App\Jobs\FinalizarSorteio;
use App\Events\AnunciarGanhador;
use Inertia\Inertia;
use App\Models\User;
class SorteioController extends Controller
{
    public function anunciarGanhador($id){

        $sorteio = Sorteio::find($id);
        $winner = $sorteio->winner;
        $winnerNumber = $sorteio->winner_number;

        $sorteado = [
            'winner' => $winner,
            'winnerNumber' => $winnerNumber,
            'jackpotName' => $sorteio->name
        ];
        
        if($sorteio->finished){
            return response()->json(['error' => 'Sorteio já finalizado']);
        }
        
        $sorteio->finished = 1;
        $sorteio->save();
        $user = DB::table('users')->where('id', $winner)->first();
        broadcast(new AnunciarGanhador($sorteado))->toOthers();
        return response()->json([$sorteado]);
        
    }

    public function index(Request $request){
        $jackpotName = $request->input('jackpotName', 'jackpot1');

        $sorteio = Sorteio::where("name", $jackpotName)->where("finished", false)->first();

        // Obter o último sorteio finalizado
        $lastWinnerSorteio = Sorteio::where("finished", true)
                                    ->orderBy('id', 'desc')
                                    ->first();

        $lastWinner = null;
        if ($lastWinnerSorteio) {
            $winnerUserId = $lastWinnerSorteio->winner;
            $participants = $lastWinnerSorteio->participants;
            $totalNumbers = $lastWinnerSorteio->total_numbers;
    
            // Calcular o número de entradas do vencedor
            $winnerEntries = 0;
            if ($participants && $winnerUserId) {
                foreach ($participants as $participant) {
                    if ($participant['user_id'] == $winnerUserId) {
                        $winnerEntries += count($participant['numbers']);
                    }
                }
            }
    
            // Calcular a porcentagem de chance do vencedor
            $winnerPercentage = $totalNumbers > 0 ? ($winnerEntries / $totalNumbers) * 100 : 0;
    
            // Obter informações do usuário vencedor
            $winnerUser = User::find($winnerUserId);
    
            $lastWinner = [
                'user' => $winnerUser,
                'percentage' => $winnerPercentage,
                'prize' => $lastWinnerSorteio->prize,
            ];
        }
    
        // Obter o sortudo do dia
        $today = date('Y-m-d');
        $todaySorteios = Sorteio::where("finished", true)
                                ->whereDate('created_at', $today)
                                ->get();
    
        $luckyOne = null;
        $smallestPercentage = null;
    
        foreach ($todaySorteios as $sorteioItem) {
            $participants = $sorteioItem->participants;
            $totalNumbers = $sorteioItem->total_numbers;
            $winnerUserId = $sorteioItem->winner;
    
            $winnerEntries = 0;
            if ($participants && $winnerUserId) {
                foreach ($participants as $participant) {
                    if ($participant['user_id'] == $winnerUserId) {
                        $winnerEntries += count($participant['numbers']);
                    }
                }
            }
    
            $winnerPercentage = $totalNumbers > 0 ? ($winnerEntries / $totalNumbers) * 100 : 0;
    
            if ($smallestPercentage === null || $winnerPercentage < $smallestPercentage) {
                $smallestPercentage = $winnerPercentage;
                $luckyOne = [
                    'user_id' => $winnerUserId,
                    'percentage' => $winnerPercentage,
                    'prize' => $sorteioItem->prize,
                ];
            }
        }
    
        $luckyOneDatalaravel = null;
        if ($luckyOne) {
            $luckyOneUser = User::find($luckyOne['user_id']);
            $luckyOneDatalaravel = [
                'user' => $luckyOneUser,
                'percentage' => $luckyOne['percentage'],
                'prize' => $luckyOne['prize'],
            ];
        }
    
        $last10Sorteios = Sorteio::where("finished", true)
        ->orderBy('id', 'desc')
        ->take(10)
        ->get();

        $last10Games = [];
        foreach ($last10Sorteios as $sorteioItem) {
        $participants = $sorteioItem->participants;
        $totalNumbers = $sorteioItem->total_numbers;
        $winnerUserId = $sorteioItem->winner;

        $winnerEntries = 0;
        if ($participants && $winnerUserId) {
        foreach ($participants as $participant) {
        if ($participant['user_id'] == $winnerUserId) {
        $winnerEntries += count($participant['numbers']);
        break;
        }
        }
        }

        $winnerPercentage = $totalNumbers > 0 ? ($winnerEntries / $totalNumbers) * 100 : 0;

        $winnerUser = User::find($winnerUserId);

        $last10Games[] = [
        'round_id' => $sorteioItem->id,
        'user' => $winnerUser ? $winnerUser->name : 'Usuário desconhecido',
        'user_image' => $winnerUser ? $winnerUser->profile_image : null,
        'percentage' => $winnerPercentage,
        'prize' => $sorteioItem->prize,
        'hash' => $sorteioItem->hash,
        ];
        }

        // Preparar os dados para o front-end
        $data = [];
       
        $data['sorteio'] = $sorteio ?? null;
        
       
        $data['lastWinner'] = $lastWinner ?? null;
        
       
        $data['luckyOne'] = $luckyOneDatalaravel ?? null;
        
        
        $data['last10Games'] = $last10Games ?? null;
        

        $data['jackpotName'] = $jackpotName;

        return Inertia::render('Welcome', $data);
    }
    
    public function sorteio(Request $request){
        $valor = $request->input('valor');
        $userId = $request->input('userId');
        $jackpotName = $request->input('jackpotName', 'jackpot1');
        
        $user = DB::table('users')->where('id', $userId)->first();

        if($user->balance < $valor){
            return response()->json(['error' => 'Saldo insuficiente']);
        }

        $user->balance = $user->balance - $valor;
        DB::table('users')->where('id', $userId)->update(['balance' => $user->balance]);
        $sorteio = Sorteio::where('name', $jackpotName)->where('finished', false)->first();

        if(!$sorteio){
            $sorteio = Sorteio::create([
                'name' => $jackpotName,
                'participants' => [],
                'finished' => false,
                'date' => now(),
                'total_numbers' => 0,
                'prize' => 0,
                'hash' => null,
                'end_date' => null
            ]);
        }

        $sorteio->addParticipants($userId, $valor, $user->name, $user->profile_image);
        
        broadcast(new Participants($sorteio))->toOthers();

        $totalUniqueUserIdParticipants = collect($sorteio->participants)->pluck('user_id')->unique()->count();
        
        if($totalUniqueUserIdParticipants >= 2 && $sorteio->total_numbers >= 20 && !$sorteio->end_date){
            $sorteio->end_date = Carbon::now()->addMinutes(1);
            $sorteio->save();
            broadcast(new InicioSorteio($sorteio))->toOthers();
            FinalizarSorteio::dispatch($sorteio->id, $jackpotName)->delay(now()->addMinutes(1));
            //FinalizarSorteio::dispatch($sorteio->id);
           
        }

        return response()->json(['sorteio' => $sorteio]);
    }
}
