/**
 * Interface for an individual interface
 */
export interface LakeScheduleEntry {
  id: number;
  racedate: string;
  localschool: string;
  vsat: string;
  competitors: string;
  racename: string;
  starttime: string;
  gender: "Men" | "Women" | "Both";
  omitfromdatelist: number;
  hostschool: string;
  owner_id: number;
  EventDisplay: string;
  notes: string;
  recip: string;
  regattatype: "Sprint" | "Head"; // This isn't strictly accurate (wormtown is a sprint)
  clubtype: "Club" | "Col" | "Org" | "HS" | "Regattas";
  hide: number;
  "Entry ValueList": string;
  events: string;
  RaceYear: number;
  gcal_eTag: string;
  gcal_modTime: string;
  gcal_action: string;
  timeStart: string;
  timeEnd: string;
  racedateEnd: string;
  showOnSite: number;
  rampClosed: "" | 1;
}

/**
 * Type that is returned when the Lake Schedule is fetched
 */
export interface LakeSchedule {
  response: {
    dataInfo: {
      database: string;
      layout: string;
      table: string;
      totalRecordCount: number;
      foundCount: number;
      returnedCount: number;
    };
    data: {
      fieldData: LakeScheduleEntry;
      portalData: Record<string, never>;
      recordId: string;
      modId: string;
    }[];
  };
  messages: {
    code: string;
    message: string;
  }[];
}

/**
 * Parameters for performing a find request on the lake schedule
 */
export interface FindLakeScheduleBody {
  query: {
    racedate: string; // >=MM/DD/YY
    omitfromdatelist: number;
    showOnSite: number;
  }[];
  sort: {
    fieldName: string;
    sortOrder: string;
  }[];
  limit: number;
  offset: number;
}

/**
 * Interface representing an individual entry in the lake schedule entries
 */
export interface LakeScheduleLanesEntry {
  id: number;
  lk_schd_id: number | "";
  racetime: string;
  event: string;
  host: string;
  entry0: string;
  entry1: string;
  entry2: string;
  entry3: string;
  entry4: string;
  entry5: string;
  entry6: string;
  racedate: string;
  racedatetime: string;
  clbType: string;
  entryseed0: string;
  entryseed1: string;
  entryseed2: string;
  entryseed3: string;
  entryseed4: string;
  entryseed5: string;
  gcal_error: string;
  gcal_eTag: string;
  gcal_status: string;
  entrydisp0: string;
  entrydisp1: string;
  entrydisp2: string;
  entrydisp3: string;
  entrydisp4: string;
  entrydisp5: string;
  entrydisp6: string;
  results_code_display: string;
  racedateUnix: string;
  entryseed6: string;
  order0: number | "";
  order1: number | "";
  order2: number | "";
  order3: number | "";
  order4: number | "";
  order5: number | "";
  order6: number | "";
  splitprev0: number | "";
  splitprev1: number | "";
  splitprev2: number | "";
  splitprev3: number | "";
  splitprev4: number | "";
  splitprev5: number | "";
  splitprev6: number | "";
  splitwin0: number | "";
  splitwin1: number | "";
  splitwin2: number | "";
  splitwin3: number | "";
  splitwin4: number | "";
  splitwin5: number | "";
  splitwin6: number | "";
  time0: string;
  time1: string;
  time2: string;
  time3: string;
  time4: string;
  time5: string;
  time6: string;
  SummaryHTML: string;
  competitorList: string;
}

/**
 * Response for retrieving lake schedule lanes from the database
 */
export interface LakeScheduleLanes {
  response: {
    dataInfo: {
      database: string;
      layout: string;
      table: string;
      totalRecordCount: number;
      foundCount: number;
      returnedCount: number;
    };
    data: {
      fieldData: LakeScheduleLanesEntry;
      portalData: Record<string, never>;
      recordId: string;
      modId: string;
    }[];
  };
  messages: {
    code: string;
    message: string;
  }[];
}

/**
 * Arguments for fetching the lake schedule lanes
 */
export interface LakeScheduleLanesArg {
  query: {
    lk_schd_id: string; // Can be the specific ID, or an expression, e.g., >= ID
  }[];
  sort: {
    fieldName: string;
    sortOrder: string;
  }[];
  limit: number;
  offset: number;
}
