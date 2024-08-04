import axios from "axios";
import { Request, Response } from "express";
import { ACCESS_TOKEN } from "../webhooks/index.js";
import { db } from "../lib/db.js";

export const checkStatus = async (req: Request, res: Response) => {
  const params = req.params;
  try {
    if (typeof params.user !== "string" || typeof params.repo !== "string")
      return;
    console.log(
      `https://api.github.com/repos/${params.user}/${params.repo}/installation`
    );
    const apiRes = await axios.get(
      `https://api.github.com/repos/${params.user}/${params.repo}/installation`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      }
    );
    if (apiRes.status === 200) {
      await db.repo.create({
        data: {
          reponame: params.user + "/" + params.repo,
          link: "",
          organizationId: "",
          totalIssues: 0,
        },
      });
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
