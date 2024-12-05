<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ImageController extends Controller
{
    public function uploadImage(Request $request){
        // Validar a imagem
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if($request->hasFile('image')){
            $image = $request->file('image');

            // Gerar um nome único para a imagem
            $imageName = time() . '.' . $image->getClientOriginalExtension();

            // Caminho onde a imagem será armazenada (dentro de storage/app/public/profile_images)
            $imagePath = 'profile_images/' . $imageName;

            // Armazenar a imagem no disco 'public'
            $image->storeAs('public/profile_images', $imageName);

            // Atualizar o campo profile_image do usuário autenticado
            $user = $request->user();
            $user->profile_image = url('storage/' . $imagePath);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Imagem enviada com sucesso',
                'image_url' => Storage::url($imagePath),
                'user' => $user,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Nenhuma imagem foi enviada.',
            ], 400);
        }
    }
}