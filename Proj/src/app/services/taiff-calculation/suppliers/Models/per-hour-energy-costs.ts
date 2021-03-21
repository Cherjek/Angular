export interface IPerHourEnergyCosts {
  Id: number;
  Date: Date | string;
  Hour: number;
  Pc34Cost: number | null;
  Pc56Cost: number | null;
  Pc56FactOverCost: number | null;
  Pc56PlanOverCost: number | null;
}

export class PerHourEnergyCosts implements IPerHourEnergyCosts {
  Id: number;
  Date: Date | string;
  Hour: number;
  Pc34Cost: number | null;
  Pc56Cost: number | null;
  Pc56FactOverCost: number | null;
  Pc56PlanOverCost: number | null;
}
