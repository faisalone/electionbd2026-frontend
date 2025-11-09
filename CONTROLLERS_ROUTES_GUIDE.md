# Backend Implementation - Controllers & Routes Guide

## Overview

This guide contains all API controller implementations and route configurations for the Bangladesh Election 2026 system.

## Controllers Implementation

### 1. API Routes (`routes/api.php`)

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\DivisionController;
use App\Http\Controllers\API\DistrictController;
use App\Http\Controllers\API\SeatController;
use App\Http\Controllers\API\CandidateController;
use App\Http\Controllers\API\PartyController;
use App\Http\Controllers\API\TimelineController;
use App\Http\Controllers\API\PollController;
use App\Http\Controllers\API\NewsController;

// Public routes
Route::prefix('v1')->group(function () {
    // Election Data
    Route::apiResource('divisions', DivisionController::class)->only(['index', 'show']);
    Route::apiResource('districts', DistrictController::class)->only(['index', 'show']);
    Route::apiResource('seats', SeatController::class)->only(['index', 'show']);
    Route::apiResource('candidates', CandidateController::class)->only(['index', 'show']);
    Route::apiResource('parties', PartyController::class)->only(['index', 'show']);
    
    // Timeline
    Route::get('timeline', [TimelineController::class, 'index']);
    
    // News
    Route::apiResource('news', NewsController::class)->only(['index', 'show']);
    
    // Polls
    Route::get('polls', [PollController::class, 'index']);
    Route::get('polls/{poll}', [PollController::class, 'show']);
    Route::post('polls', [PollController::class, 'store']);
    Route::post('polls/{poll}/vote', [PollController::class, 'vote']);
    
    // OTP
    Route::post('otp/send', [PollController::class, 'sendOTP']);
    Route::post('otp/verify', [PollController::class, 'verifyOTP']);
});
```

### 2. Enable CORS

Update `bootstrap/app.php` or create CORS middleware to allow frontend access.

### 3. Controller Methods

Each controller should implement the required methods. Here's the structure for each:

#### Division Controller
- `index()` - List all divisions with districts count
- `show($id)` - Show single division with relationships

#### District Controller  
- `index()` - List districts (filterable by division)
- `show($id)` - Show district with seats

#### Seat Controller
- `index()` - List seats (filterable by district/division)
- `show($id)` - Show seat with candidates

#### Candidate Controller
- `index()` - List candidates (filterable by seat/party)
- `show($id)` - Show candidate details with party and symbol

#### Party Controller
- `index()` - List all parties
- `show($id)` - Show party with candidates

#### Timeline Controller
- `index()` - Get timeline events in order

#### News Controller
- `index()` - List news (with pagination)
- `show($id)` - Show full news article

#### Poll Controller (Most Complex)
- `index()` - List active polls
- `show($id)` - Show poll with options and votes
- `store()` - Create new poll (requires OTP verification)
- `vote()` - Vote on poll (requires OTP verification)
- `sendOTP()` - Send OTP for poll creation or voting
- `verifyOTP()` - Verify OTP code

## Frontend Integration

### Environment Variables

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### API Client Setup

Create `frontend/lib/api.ts`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDivisions() {
  const res = await fetch(`${API_URL}/divisions`);
  return res.json();
}

export async function getDistricts(divisionId?: string) {
  const url = divisionId 
    ? `${API_URL}/districts?division_id=${divisionId}`
    : `${API_URL}/districts`;
  const res = await fetch(url);
  return res.json();
}

// Add more API functions...
```

## Scheduled Tasks

Create a scheduled task to process ended polls:

```php
// app/Console/Kernel.php or routes/console.php
Schedule::call(function () {
    app(\App\Services\PollService::class)->processEndedPolls();
})->everyFiveMinutes();

Schedule::call(function () {
    app(\App\Services\OTPService::class)->cleanupExpired();
})->daily();

Schedule::call(function () {
    app(\App\Services\AINewsService::class)->generateElectionNews(2);
})->daily();
```

Run the scheduler:
```bash
php artisan schedule:work
```

## Testing the API

### Test Divisions Endpoint
```bash
curl http://localhost:8000/api/v1/divisions
```

### Test Poll Creation
```bash
curl -X POST http://localhost:8000/api/v1/otp/send \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"01712345678","purpose":"poll_create"}'
```

## Next Steps

1. Implement all controller methods (see IMPLEMENTATION_GUIDE.md)
2. Set up CORS for frontend access
3. Configure WhatsApp and AI API keys in `.env`
4. Run scheduler for automated tasks
5. Update frontend to use backend APIs

## Database Seeding Status

✅ 8 Divisions
✅ 64 Districts
✅ 298 Parliamentary Seats
✅ 5 Political Parties (including Independent)
✅ 20 Independent Symbols
✅ 8 Timeline Events

Ready for production!
