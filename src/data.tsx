import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BookingRequest, crm, LedgerLine, Settings, Summary, Visits } from './crm';
import { signOut, supabase } from './supabase';

// gate: her card is incomplete, so Your Details is the only screen she can see (rules.md section 6)
type Auth = { signedIn: boolean; setSignedIn: (v: boolean) => void; gate: boolean; setGate: (v: boolean) => void };
const AuthCtx = createContext<Auth>({ signedIn: false, setSignedIn: () => {}, gate: false, setGate: () => {} });
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ initial, children }: { initial: boolean; children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(initial);
  const [gate, setGate] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setSignedIn(false);
        setGate(false);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);
  const value = useMemo(() => ({ signedIn, setSignedIn, gate, setGate }), [signedIn, gate]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

type Data = {
  summary: Summary | null;
  settings: Settings | null;
  ledger: LedgerLine[] | null;
  visits: Visits | null;
  requests: BookingRequest[] | null;
  failed: boolean;
  ledgerFailed: boolean;
  visitsFailed: boolean;
  updatedAt: number | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
  loadLedger: () => Promise<void>;
  loadVisits: () => Promise<void>;
};

const DataCtx = createContext<Data | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { signedIn, setGate } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [requests, setRequests] = useState<BookingRequest[] | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [ledger, setLedger] = useState<LedgerLine[] | null>(null);
  const [visits, setVisits] = useState<Visits | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ledgerFailed, setLedgerFailed] = useState(false);
  const [visitsFailed, setVisitsFailed] = useState(false);
  const loaded = useRef({ ledger: false, visits: false });

  const loadLedger = useCallback(async () => {
    try {
      setLedger(await crm.ledger());
      loaded.current.ledger = true;
      setLedgerFailed(false);
    } catch (e) {
      console.error('app_ledger', e);
      setLedgerFailed(true);
    }
  }, []);

  const loadVisits = useCallback(async () => {
    try {
      setVisits(await crm.visits());
      loaded.current.visits = true;
      setVisitsFailed(false);
    } catch (e) {
      console.error('app_visits', e);
      setVisitsFailed(true);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [s, st, rq] = await Promise.all([
        crm.summary(),
        settings ? Promise.resolve(settings) : crm.settings(),
        crm.bookingRequests().catch(() => [] as BookingRequest[]),
      ]);
      setSummary(s);
      setSettings(st);
      setRequests(rq);
      setUpdatedAt(Date.now());
      setFailed(false);
      const extra: Promise<void>[] = [];
      if (loaded.current.ledger) extra.push(loadLedger());
      if (loaded.current.visits) extra.push(loadVisits());
      await Promise.all(extra);
    } catch (e) {
      // keep what is on screen; she can pull to refresh
      console.error('app_summary', e);
      setFailed(true);
    } finally {
      setRefreshing(false);
    }
  }, [settings, loadLedger, loadVisits]);

  useEffect(() => {
    if (!signedIn) {
      setSummary(null);
      setSettings(null);
      setLedger(null);
      setVisits(null);
      setRequests(null);
      setFailed(false);
      setLedgerFailed(false);
      setVisitsFailed(false);
      setUpdatedAt(null);
      loaded.current = { ledger: false, visits: false };
      return;
    }
    (async () => {
      try {
        // app_link records the visit and confirms the phone still maps to a live client
        const link = await crm.link();
        if (link.status !== 'linked') {
          await signOut();
          return;
        }
        setGate(link.complete === false);
      } catch (e) {
        console.error('app_link', e);
      }
      await refresh();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn]);

  const value = useMemo(
    () => ({ summary, settings, ledger, visits, requests, failed, ledgerFailed, visitsFailed, updatedAt, refreshing, refresh, loadLedger, loadVisits }),
    [summary, settings, ledger, visits, requests, failed, ledgerFailed, visitsFailed, updatedAt, refreshing, refresh, loadLedger, loadVisits],
  );
  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

export function useData(): Data {
  const d = useContext(DataCtx);
  if (!d) throw new Error('useData outside DataProvider');
  return d;
}

// ticks once a minute so "Updated 2 minutes ago" stays right
export function useNow(): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);
  return now;
}
