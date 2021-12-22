export enum ZeniGenerations {
  Gen0 = "gen0",
  Gen1 = "gen1",
}

export enum ZeniClasses {
  All = "all",
  Warrior = "warrior",
  Magi = "magi",
  Rogue = "rogue",
}

export const ZeniClassCodes: {
  [key: string]: string;
} = {
  [ZeniClasses.Warrior]: "warrior",
  [ZeniClasses.Magi]: "magi",
  [ZeniClasses.Rogue]: "rogue",
};

export enum ZeniRarities {
  Enlightened = "enlightened",
}

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
  tokenId: number;
  class: ZeniClasses;
  body: ZeniImageInfo;
  skin: ZeniImageInfo;
  eyes: ZeniImageInfo;
  mouth: ZeniImageInfo;
  forehead: ZeniImageInfo;
  necklace: ZeniImageInfo;
  crown: ZeniImageInfo;
  arn: string;
}
