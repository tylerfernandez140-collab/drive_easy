<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Hero;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HeroController extends Controller
{
    public function index()
    {
        $hero = Hero::first();
        return inertia('Admin/LandingPageManagement', ['hero' => $hero]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'icon' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'tagline' => 'nullable|string|max:255',
            'heading' => 'nullable|string|max:255',
            'highlight' => 'nullable|string|max:255',
            'description' => 'nullable|string',

            // Feature cards
            'feature_one_title' => 'nullable|string|max:255',
            'feature_one_description' => 'nullable|string',
            'feature_two_title' => 'nullable|string|max:255',
            'feature_two_description' => 'nullable|string',
            'feature_three_title' => 'nullable|string|max:255',
            'feature_three_description' => 'nullable|string',
        ]);

        $hero = Hero::first() ?? new Hero();

        if ($request->hasFile('icon')) {
            if ($hero->icon_path && Storage::disk('public')->exists($hero->icon_path)) {
                Storage::disk('public')->delete($hero->icon_path);
            }
            $path = $request->file('icon')->store('hero', 'public');
            $data['icon_path'] = $path;
        }

        unset($data['icon']);
        $hero->fill($data)->save();

        return redirect()->back()->with('success', 'Landing page updated successfully.');
    }
}

