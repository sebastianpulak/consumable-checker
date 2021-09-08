// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { buildSdk } from "@rpglogs/api-sdk";
import btoa from 'btoa';

export default async function handler(req, res) {
  if (!req.query.code) {

    res.status(400).json({
      message: 'Invalid parameters provided.'
    });

    return;
  }

  const accessToken = req.query.token;
  const sdk = buildSdk(accessToken, 'classic.warcraft');

  try {
    const response = await sdk.getReportTable({
      code: req.query.code,
      //startTime: 359,
      endTime: 99999999999999,
      dataType: "Casts",
      abilityId: 28726
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