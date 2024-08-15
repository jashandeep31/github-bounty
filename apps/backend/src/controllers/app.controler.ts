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
        const organization = await db.organization.findUnique({
          where: {
            name: params.user,
          },
        });

        if (!organization) throw new Error("Organization not found ");
        await db.repo.create({
          data: {
            reponame: params.user + "/" + params.repo,
            link: `https://github.com/${params.user}/${params.repo}`,
            // TODO: Changing id is required brother
            organizationId: organization.id,
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
    console.log(error);
    return res.status(404).json({
      message: "Unable to  idenity app",
    });
  }
};
