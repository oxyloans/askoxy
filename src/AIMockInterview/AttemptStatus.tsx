import React, { useEffect, useState } from 'react';
import { api } from './lib/api';

interface AttemptStatusProps {
  userId: string;
  onStatusChange?: (canAttempt: boolean, info?: {used:number;remaining:number;max:number}) => void;
}

export const AttemptStatus: React.FC<AttemptStatusProps> = ({ userId, onStatusChange }) => {
  const [status, setStatus] = useState<{
    canAttempt: boolean;
    used: number;
    remaining: number;
    max: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.getAttemptStatus(userId);
        setStatus(data);
        onStatusChange?.(data.canAttempt ?? data.remaining > 0, {used:data.used, remaining:data.remaining, max:data.max});
      } catch (error) {
        console.error('Failed to fetch attempt status:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div style={{padding:16,borderRadius:16,border:'1px solid var(--border)',background:'var(--surface)'}}>
        <div style={{height:14,width:140,borderRadius:999,background:'var(--border)',marginBottom:12}} />
        <div style={{height:10,width:110,borderRadius:999,background:'var(--border)'}} />
      </div>
    );
  }

  if (!status) return null;

  const percentage = (status.remaining / status.max) * 100;
  const color = percentage > 50 ? '#10b981' : percentage > 0 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{borderRadius:12,border:'1px solid var(--border)',background:'var(--surface)',padding:'10px 14px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:8}}>
        <span style={{fontSize:13,fontWeight:800,color:'var(--text-primary)'}}>Interview Attempts</span>
        <span style={{fontSize:11,fontWeight:800,padding:'3px 10px',borderRadius:999,background:color+'18',color}}>
          {status.canAttempt ? 'Available' : 'Limit Reached'}
        </span>
      </div>
      <div style={{height:5,borderRadius:999,background:'var(--border)',overflow:'hidden',marginBottom:8}}>
        <div style={{height:'100%',borderRadius:999,width:`${percentage}%`,background:color,transition:'width .3s'}} />
      </div>
      <div style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)'}}>
        Used: <span style={{fontWeight:900,color}}>{status.used}</span>
        <span style={{margin:'0 5px',color:'var(--text-muted)'}}>of</span>
        <span style={{fontWeight:900,color}}>{status.max}</span>
        <span style={{margin:'0 5px',color:'var(--text-muted)'}}>•</span>
        Remaining: <span style={{fontWeight:900,color}}>{status.remaining}</span>
      </div>
      {!status.canAttempt&&(
        <div style={{marginTop:8,borderRadius:8,padding:'6px 10px',fontSize:11,fontWeight:700,border:'1px solid '+color+'30',background:color+'10',color}}>
          You have used all {status.max} attempts.
        </div>
      )}
    </div>
  );
};
