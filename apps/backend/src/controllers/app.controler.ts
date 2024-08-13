import axios from "axios";
import { Request, Response } from "express";
import { ACCESS_TOKEN } from "../webhooks/index.js";
import { db } from "../lib/db.js";

export const checkStatus = async (req: Request, res: Response) => {
  const params = req.params;
  try {
    if (typeof params.user !== "string" || typeof params.repo !== "string")
      return;

    const apiRes = await axios.get(
      `https://api.github.com/repos/${params.user}/${params.repo}/installation`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      }
    );
    if (apiRes.status === 200) {
      const isRepo = await db.repo.findUnique({
        where: {
          reponame: params.user + "/" + params.repo,
        },
      });
      if (!isRepo) {
        await db.repo.create({
          data: {
            reponame: params.user + "/" + params.repo,
            link: `https://github.com/${params.user}/${params.repo}`,
            // TODO: Changing id is required brother
            organizationId: "57db0784-2eba-4c4f-8a83-7c808c09b3c6",
            totalIssues: 0,
          },
        });
      }
      return res.status(200).json({
        message: "App is installed",
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    return res.status(404).json({
      message: "Unable to  idenity app",
    });
  }
};
