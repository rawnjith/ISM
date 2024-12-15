export type Factor = {
  id: string;
  name: string;
};

export type SSIMValue = 'V' | 'A' | 'X' | 'O';

export type SSIMMatrix = {
  [key: string]: {
    [key: string]: SSIMValue;
  };
};

export type ReachabilityMatrix = {
  [key: string]: {
    [key: string]: number;
  };
};

export type PartitionLevel = {
  level: number;
  factors: string[];
};