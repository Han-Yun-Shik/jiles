// lib/isWithinPeriod.ts

export interface PeriodData {
  wr_sy: string;
  wr_sm: string;
  wr_sd: string;
  wr_sh: string;
  wr_si: string;
  wr_ss: string;
  wr_ey: string;
  wr_em: string;
  wr_ed: string;
  wr_eh: string;
  wr_ei: string;
  wr_es: string;
}

export function isWithinPeriod(data: PeriodData): boolean {
  if (
    !data.wr_sy || !data.wr_sm || !data.wr_sd ||
    !data.wr_sh || !data.wr_si || !data.wr_ss ||
    !data.wr_ey || !data.wr_em || !data.wr_ed ||
    !data.wr_eh || !data.wr_ei || !data.wr_es
  ) return false;

  const pad = (val: string) => val.padStart(2, '0');

  const start = new Date(
    `${data.wr_sy}-${pad(data.wr_sm)}-${pad(data.wr_sd)}T${pad(data.wr_sh)}:${pad(data.wr_si)}:${pad(data.wr_ss)}`
  );
  const end = new Date(
    `${data.wr_ey}-${pad(data.wr_em)}-${pad(data.wr_ed)}T${pad(data.wr_eh)}:${pad(data.wr_ei)}:${pad(data.wr_es)}`
  );
  const now = new Date();

  return now >= start && now <= end;
}
