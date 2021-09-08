// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { buildSdk } from "@rpglogs/api-sdk";
import btoa from 'btoa';

export default async function handler(req, res) {
  if (!req.query.token) {

    res.status(400).json({
      message: 'Invalid parameters provided.'
    });

    return;
  }

  const accessToken = req.query.token;
  const sdk = buildSdk(accessToken, 'classic.warcraft');

  try {
    const response = await sdk.getGuildReports({
      guildName: "Zeal",
      guildServerRegion: "EU",
      guildServerSlug: "Shazzrah",
      limit: 50,
      includeFights: false,
    });

    // if (!response?.data?.length) {
    //   res.status(404).json({ message: 'Report not found.' });
    //   return;
    // }

    res.status(200).json(response);
  } catch (error) {
    console.log(error);

    res
      .status(error?.response?.status ?? 500)
      .json({
        message: error?.response?.error ?? 'An error occurred.'
      });
  }
}