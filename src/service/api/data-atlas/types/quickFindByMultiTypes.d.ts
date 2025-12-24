declare namespace DataAtlas {
  interface FindByMultiTypesItem {
    description: string;
    indexibleType: IndexibleType;
    businessDomain?: unknown;
    businessResponsibleDepartment?: unknown;
    subjectDomain?: unknown;
    businessTags?: unknown;
    nested: unknown[];
    additional: Additional;
    keyUser?: unknown;
    itManager?: unknown;
    subjectDomainGroup?: unknown;
    businessDataOwner?: unknown;
    cnName: string;
    idPath: unknown[];
    summary: string;
    code?: unknown;
    name: string;
    id: string;
    type?: unknown;
    path: string;
  }

}

  
interface Additional {
  sourceType: string;
  displayOnMap: string;
  type: string;
}

interface IndexibleType {
  name: string;
  cnName: string;
  cnNameInShort: string;
  filters?: unknown;
  filterDirIds?: unknown;
}