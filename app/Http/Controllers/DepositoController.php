<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use App\Models\Transaction;
class DepositoController extends Controller
{   

    public function __construct()
    {
        
    }
    public function SuitPay(Request $request)
    {

        $user = $request->user;
        $name = $request->name;
        $lastName = $request->lastName;
        $cpf = $request->cpf;
        $completeName = $name . ' ' . $lastName;
        $amount = $request->amount;
        $response = $this->GetQRCode($amount, $completeName, $cpf, $user['email']);

        if($response){
            $transaction = new Transaction();
            $transaction->transaction_id = $response['idTransaction'];
            $transaction->user_id = $user['id'];
            $transaction->amount = $amount;
            $transaction->status = 'pending';
            $transaction->type = 'deposit';
            $transaction->save();
        }
        return response()->json($response);
    }

    public function GetQRCode($amount, $name, $cpf, $email)
    {
        $sandboxLink = "https://sandbox.ws.suitpay.app/api/v1/gateway/request-qrcode";
        $CS = "5b7d6ed3407bc8c7efd45ac9d4c277004145afb96752e1252c2082d3211fe901177e09493c0d4f57b650d2b2fc1b062d";
        $CI = "testesandbox_1687443996536";

        //$CI = "thegbl_1721217070763";
        //$CS = "5248f7104d8698db48a6a0d55aa07f66796f857930a22814cc86c8c4126f163a28014494e72447c597e6344cdb911c58";

        $callbackUrl = route('suitpay.callback');

        $payload = [
            'requestNumber' => rand(100000, 999999),
            'amount' => floatval($amount),
            'dueDate' => date('Y-m-d', strtotime('+1 day')),
            'description' => 'Déposito PixJackPot',
            'callbackUrl' => $callbackUrl,
            'client' => [
                'name' => $name,
                'document' => $cpf,
                'email' => $email
            ],
        ];
        

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'cs' => $CS,
            'ci' => $CI
        ])->post($sandboxLink, $payload);
        try{
            if($response->status() != 200){
                return response()->json(['message' => 'error']);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'error']);
        }

        return $response->json();
    }

    public function Callback(Request $request){
        $transactionId = $request->idTransaction;
        $status = $request->statusTransaction;
        $transaction = Transaction::where('transaction_id', $transactionId)->first();
        
        if($transaction){
            $transaction->status = $status;
            $transaction->save();
            $user = User::find($transaction->user_id);

            if($status == 'PAID_OUT'){
                $user->balance += $transaction->amount;
                $user->save();
            }

            return response()->json(['message' => "success"]);
        }
        
        return response()->json(['message' => "error"]);
    }

    public function CheckPaymentStatus(Request $request){
        $transactionId = $request->idTransaction;
        $transaction = Transaction::where('transaction_id', $transactionId)->first();
        if($transaction){
            return response()->json(['status' => $transaction->status]);
        }
        return response()->json(['status' => $transactionId]);
    }
}
