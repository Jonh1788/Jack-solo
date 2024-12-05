<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use App\Models\Sorteio;
use App\Models\User;

use App\Events\AnunciarGanhador;

class FinalizarSorteio implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $sorteioId;
    protected $jackpotName;
    
    public function __construct($sorteioId, $jackpotName)
    {
        $this->sorteioId = $sorteioId;
        $this->jackpotName = $jackpotName;
    }

    public function handle()
    {
        $sorteio = Sorteio::find($this->sorteioId);
        if (!$sorteio) {
            return;
        }

        $participants = $sorteio->participants;

        // Coletar todos os números em um array plano
        $allNumbers = [];
        foreach ($participants as $participant) {
            foreach ($participant['numbers'] as $number) {
                $allNumbers[] = [
                    'number' => $number,
                    'user_id' => $participant['user_id']
                ];
            }
        }

        // Verificar se há números para sortear
        if (empty($allNumbers)) {
            return;
        }

        // Gerar hash dos dados do sorteio
        $participantsData = [];
        foreach ($participants as $participant) {
            $participantsData[] = [
                'user_id' => $participant['user_id'],
                'numbers' => $participant['numbers']
            ];
        }

        // Ordenar os dados para consistência
        usort($participantsData, function($a, $b) {
            return $a['user_id'] <=> $b['user_id'];
        });

        // Converter os dados para JSON
        $participantsJson = json_encode($participantsData);

        $hashData = $sorteio->id . $sorteio->name . $participantsJson;
        // Gerar o hash
        $hash = hash('sha256', $hashData);

        // Armazenar o hash no sorteio
        $sorteio->hash = $hash;

        // Converter o hash em um número inteiro para a semente
        $seed = hexdec(substr($hash, 0, 8));

        // Inicializar o gerador de números aleatórios com a semente
        mt_srand($seed);

        // Selecionar o vencedor
        $winnerIndex = mt_rand(0, count($allNumbers) - 1);
        $winnerEntry = $allNumbers[$winnerIndex];
        $winnerNumber = $winnerEntry['number'];
        $winnerUserId = $winnerEntry['user_id'];

        // Restaurar o gerador de números aleatórios
        mt_srand();

        // **Novo código para calcular a chance do vencedor**
        // Contar quantas entradas o vencedor tinha
        $winnerEntries = 0;
        foreach ($allNumbers as $entry) {
            if ($entry['user_id'] == $winnerUserId) {
                $winnerEntries++;
            }
        }

        // Calcular a chance do vencedor
        $totalEntries = count($allNumbers);
        $winnerChance = ($winnerEntries / $totalEntries) * 100;

        // Atualizar o sorteio com as informações do vencedor
        $sorteio->winner = $winnerUserId;
        $sorteio->winner_number = $winnerNumber;
        $sorteio->finished = 1;
        $sorteio->save();

        // Atualizar o saldo do usuário vencedor
        $user = User::find($winnerUserId);
        if ($user) {
            $user->balance += ($sorteio->prize - ($sorteio->prize * 0.1));
            $user->save();
        }

        // Disparar o evento de anúncio do vencedor
        $enviar = [
            "winner" => $winnerUserId,
            "winnerNumber" => $winnerNumber,
            "winnerChance" => $winnerChance,
            "jackpotName" => $this->jackpotName
        ];

        event(new AnunciarGanhador($enviar));
    }
}