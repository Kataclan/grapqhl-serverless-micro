export enum ZeniGenerations {
  Gen0 = 'gen0',
  Gen1 = 'gen1',
  Gen2 = 'gen2',
}

export enum ZeniRarities {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
  Enlightened = 'enlightened',
}

export enum ZeniClasses {
  All = 'all',
  Magi = 'magi',
  Rogue = 'rogue',
  Warrior = 'warrior',
}

export const GenerationCodes: {
  [key: string]: number;
} = {
  [ZeniGenerations.Gen0]: 0,
  [ZeniGenerations.Gen1]: 1,
  [ZeniGenerations.Gen2]: 2,
};

export const RarityCodes: {
  [key: string]: number;
} = {
  [ZeniRarities.Common]: 0,
  [ZeniRarities.Uncommon]: 1,
  [ZeniRarities.Rare]: 2,
  [ZeniRarities.Epic]: 3,
  [ZeniRarities.Legendary]: 4,
  [ZeniRarities.Enlightened]: 5,
};

export const ClassCodes: {
  [key: string]: number;
} = {
  [ZeniClasses.Magi]: 0,
  [ZeniClasses.Rogue]: 1,
  [ZeniClasses.Warrior]: 2,
};

export const CodeToClass: {
  [code: number]: string;
} = {
  [0]: ZeniClasses.Magi,
  [1]: ZeniClasses.Rogue,
  [2]: ZeniClasses.Warrior,
};

export interface Post {
  title: string;
  content: string;
}

export interface User {
  pid: number;
  name: string;
  surname: string;
  email: string;
  posts: string[];
}

export interface ZeniImageInfo {
  id: string;
  displayName: string;
  filePath: string;
  fileName: string;
  generation: ZeniGenerations;
  class: ZeniClasses;
  weight: number;
}

export interface Zeni {
  tokenId: string;
  arn: string;
  generation: ZeniGenerations;
  class: ZeniClasses;
  rarity: ZeniRarities;
  imgUrl: string;
  ipfsUrl: string;
  purification: number;
}

export interface ZeniImageCombo {
  generation: ZeniGenerations;
  class: ZeniClasses;
  classId: number;
  body: ZeniImageInfo;
  skin: ZeniImageInfo;
  eyes: ZeniImageInfo;
  mouth: ZeniImageInfo;
  forehead: ZeniImageInfo;
  necklace: ZeniImageInfo;
  crown: ZeniImageInfo;
  arn: string;
}

export type ZeniDecrypted = {
  generation: string;
  zeniClass: string;
  tokenIdByClass: string;
  bodyId: string;
  skinId: string;
  eyesId: string;
  mouthId: string;
  foreheadId: string;
  crownId: string;
  necklaceId: string;
};

export type MetadataAttribute = {
  trait_type: string | undefined;
  value: any;
  display_type?: string | undefined;
};
