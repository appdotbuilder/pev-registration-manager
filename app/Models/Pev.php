<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Pev
 *
 * @property int $id
 * @property int $user_id
 * @property string $make
 * @property string $model
 * @property int $year
 * @property string $vin
 * @property string $license_plate
 * @property string|null $color
 * @property float|null $battery_capacity
 * @property int|null $range_miles
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $owner
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PevTransfer> $transfers
 * @property-read int|null $transfers_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Pev newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Pev newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Pev query()
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereBatteryCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereLicensePlate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereMake($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereRangeMiles($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereVin($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev whereYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pev active()
 * @method static \Database\Factories\PevFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Pev extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'make',
        'model',
        'year',
        'vin',
        'license_plate',
        'color',
        'battery_capacity',
        'range_miles',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'year' => 'integer',
        'battery_capacity' => 'decimal:2',
        'range_miles' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the owner of the PEV.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all transfer records for this PEV.
     */
    public function transfers(): HasMany
    {
        return $this->hasMany(PevTransfer::class);
    }

    /**
     * Scope a query to only include active PEVs.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Get the full vehicle name (make model year).
     *
     * @return string
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->year} {$this->make} {$this->model}";
    }
}