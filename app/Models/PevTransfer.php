<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PevTransfer
 *
 * @property int $id
 * @property int $pev_id
 * @property int $from_user_id
 * @property int|null $to_user_id
 * @property string|null $to_email
 * @property string|null $to_name
 * @property string|null $to_phone
 * @property string $status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon $initiated_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Pev $pev
 * @property-read \App\Models\User $fromUser
 * @property-read \App\Models\User|null $toUser
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer query()
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer whereFromUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer whereInitiatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer wherePevId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer whereToEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer whereToName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer whereToPhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer whereToUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PevTransfer whereUpdatedAt($value)
 * @method static \Database\Factories\PevTransferFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class PevTransfer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'pev_id',
        'from_user_id',
        'to_user_id',
        'to_email',
        'to_name',
        'to_phone',
        'status',
        'notes',
        'initiated_at',
        'completed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'initiated_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the PEV being transferred.
     */
    public function pev(): BelongsTo
    {
        return $this->belongsTo(Pev::class);
    }

    /**
     * Get the user transferring the PEV.
     */
    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    /**
     * Get the user receiving the PEV.
     */
    public function toUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }
}