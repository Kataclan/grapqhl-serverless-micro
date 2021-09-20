import { Farm } from "../../types";

const chains = {
  [137]: {
    chainId: 137,
    displayName: "PolygonMainnet",
    nativeTokenName: "MATIC",
    explorerPath: "",
  },
};

const farms: Farm[] = [
  {
    chain: chains[137],
    displayName: "Farm 1",
    description: "Farm 1 description",
    sitePath: "https://farmpath",
    masterchefAddress: "0x0000000000000000000000000000000000000000",
    tokenAddress: "0x0000000000000000000000000000000000000000",
    launchDate: new Date(Date.now()),
    audits: [
      {
        companyName: "Paladin",
        path: "https://auditpath",
      },
    ],
    farmRating: {
      upVotes: 0,
      downVotes: 0,
      stars: 0,
    },
    rugdocReview: {
      risk: "LOW",
      description: "",
      path: "",
    },
    jagosaferReview: {
      flag: "GREEN",
      rank: "chicken",
      description: "",
      path: "",
    },
  },
];

export default farms;
