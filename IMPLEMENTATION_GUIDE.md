# Bangladesh Election 2026 - Backend Implementation Guide

This document provides a complete implementation guide for the Laravel backend.

## Database Structure Overview

### Core Election Tables
1. **divisions** - 8 administrative divisions of Bangladesh
2. **districts** - 64 districts under divisions
3. **seats** - 300 parliamentary seats under districts
4. **parties** - Political parties (including special "Independent" party)
5. **symbols** - Election symbols/markas for independent candidates
6. **candidates** - Candidates linked to seats and parties/symbols

### Timeline & Events
7. **timeline_events** - Election timeline milestones

### Poll System
8. **polls** - User-created polls
9. **poll_options** - Options for each poll (max 5)
10. **poll_votes** - Vote records with phone numbers
11. **otps** - OTP verification records

### Content
12. **news** - AI-generated and manual news articles
13. **users** - Users (primarily phone-based authentication)

## Models Implementation

### Division Model (`app/Models/Division.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Division extends Model
{
    protected $fillable = [
        'name',
        'name_en',
        'total_seats',
    ];

    public function districts(): HasMany
    {
        return $this->hasMany(District::class);
    }

    public function seats(): HasMany
    {
        return $this->hasManyThrough(Seat::class, District::class);
    }
}
```

### District Model (`app/Models/District.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class District extends Model
{
    protected $fillable = [
        'division_id',
        'name',
        'name_en',
        'total_seats',
    ];

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    public function seats(): HasMany
    {
        return $this->hasMany(Seat::class);
    }
}
```

### Seat Model (`app/Models/Seat.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Seat extends Model
{
    protected $fillable = [
        'district_id',
        'name',
        'name_en',
        'area',
    ];

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function candidates(): HasMany
    {
        return $this->hasMany(Candidate::class);
    }
}
```

### Party Model (`app/Models/Party.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Party extends Model
{
    protected $fillable = [
        'name',
        'name_en',
        'symbol',
        'symbol_name',
        'color',
        'founded',
        'is_independent',
    ];

    protected $casts = [
        'is_independent' => 'boolean',
    ];

    public function candidates(): HasMany
    {
        return $this->hasMany(Candidate::class);
    }

    public static function independent()
    {
        return static::where('is_independent', true)->first();
    }
}
```

### Symbol Model (`app/Models/Symbol.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Symbol extends Model
{
    protected $fillable = [
        'symbol',
        'symbol_name',
        'is_available',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    public function candidates(): HasMany
    {
        return $this->hasMany(Candidate::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }
}
```

### Candidate Model (`app/Models/Candidate.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Candidate extends Model
{
    protected $fillable = [
        'name',
        'name_en',
        'party_id',
        'seat_id',
        'symbol_id',
        'age',
        'education',
        'experience',
        'image',
    ];

    protected $with = ['party', 'seat', 'symbol'];

    public function party(): BelongsTo
    {
        return $this->belongsTo(Party::class);
    }

    public function seat(): BelongsTo
    {
        return $this->belongsTo(Seat::class);
    }

    public function symbol(): BelongsTo
    {
        return $this->belongsTo(Symbol::class);
    }

    // Get the effective symbol for the candidate
    public function getEffectiveSymbolAttribute()
    {
        if ($this->party->is_independent) {
            return $this->symbol;
        }
        return [
            'symbol' => $this->party->symbol,
            'symbol_name' => $this->party->symbol_name,
        ];
    }
}
```

### Poll System Models

#### Poll Model (`app/Models/Poll.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poll extends Model
{
    protected $fillable = [
        'user_id',
        'question',
        'creator_name',
        'end_date',
        'status',
        'total_votes',
        'winner_phone',
        'winner_selected_at',
    ];

    protected $casts = [
        'end_date' => 'datetime',
        'winner_selected_at' => 'datetime',
    ];

    protected $with = ['options'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(PollOption::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(PollVote::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && $this->end_date->isFuture();
    }

    public function hasEnded(): bool
    {
        return $this->status === 'ended' || $this->end_date->isPast();
    }
}
```

#### PollOption Model (`app/Models/PollOption.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PollOption extends Model
{
    protected $fillable = [
        'poll_id',
        'text',
        'color',
        'votes',
    ];

    public function poll(): BelongsTo
    {
        return $this->belongsTo(Poll::class);
    }

    public function pollVotes(): HasMany
    {
        return $this->hasMany(PollVote::class);
    }
}
```

#### PollVote Model (`app/Models/PollVote.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PollVote extends Model
{
    protected $fillable = [
        'poll_id',
        'poll_option_id',
        'user_id',
        'phone_number',
    ];

    public function poll(): BelongsTo
    {
        return $this->belongsTo(Poll::class);
    }

    public function pollOption(): BelongsTo
    {
        return $this->belongsTo(PollOption::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

### OTP Model (`app/Models/Otp.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Otp extends Model
{
    protected $fillable = [
        'phone_number',
        'otp_code',
        'purpose',
        'poll_id',
        'is_verified',
        'expires_at',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function poll(): BelongsTo
    {
        return $this->belongsTo(Poll::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        return !$this->is_verified && !$this->isExpired();
    }
}
```

### News Model (`app/Models/News.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title',
        'summary',
        'content',
        'image',
        'date',
        'category',
        'is_ai_generated',
        'source_url',
    ];

    protected $casts = [
        'is_ai_generated' => 'boolean',
    ];

    public function scopeAiGenerated($query)
    {
        return $query->where('is_ai_generated', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
```

### TimelineEvent Model (`app/Models/TimelineEvent.php`)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimelineEvent extends Model
{
    protected $fillable = [
        'title',
        'status',
        'date',
        'description',
        'order',
    ];

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
```

## Next Steps

1. **Update User Model** - Add phone_number handling
2. **Create Seeders** - Seed all 8 divisions, 64 districts, 300 seats, parties, symbols
3. **Create Services** - WhatsApp API, OpenAI/Gemini integration
4. **Create Controllers** - API endpoints for all resources
5. **Create Routes** - API routing setup
6. **Create Middleware** - Phone verification, rate limiting
7. **Create Jobs** - Poll winner selection, news generation

This architecture provides a clean, relational database structure with proper normalization and relationships for the Bangladesh Election 2026 system.
