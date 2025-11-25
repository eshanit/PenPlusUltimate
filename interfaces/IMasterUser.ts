interface MasterUser {
  _id: string;
  _rev: string;
  firstname: string;
  lastname: string;
  username: string;
  gender: string;
  password: string;
  profession: string;
  searchIndex: string;
  facility: string;
  district?: string;
  terms: boolean;
  createdAt: number;
  createdBy: string;
  updatedAt: number;
  updatedBy: string;
}

type IMasterUser = Readonly<MasterUser>;

export type { IMasterUser as default };
