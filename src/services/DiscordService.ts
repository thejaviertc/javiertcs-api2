import axios from "axios";
import { Request } from "express";
import IpUtils from "../utils/IpUtils.js";
import IDiscordService from "./IDiscordService.js";

class DiscordService implements IDiscordService {
	/**
	 * Logs the access to any route of the API
	 */
	public async logRoute(req: Request) {
		if (process.env.NODE_ENV === "production") {
			const route = req.url;
			const ip = IpUtils.getIpFromRequest(req);

			await axios({
				method: "POST",
				url: process.env.DISCORD_WEBHOOK_LOGS,
				headers: { "Content-Type": "application/json" },
				data: JSON.stringify({
					embeds: [
						{
							title: "Route Access",
							color: 10070709,
							type: "rich",
							fields: [
								{ name: "Route", value: route, inline: false },
								{ name: "User IP", value: ip, inline: false },
							],
							timestamp: new Date(),
						},
					],
				}),
			});
		}
	}

	/**
	 * Logs a query
	 */
	public async logQuery(req: Request, invalidReason?: string) {
		if (process.env.NODE_ENV === "production") {
			const value = req.query.url;
			const ip = IpUtils.getIpFromRequest(req);

			const embed = {
				title: invalidReason ? "Invalid Query" : "Valid Query",
				color: invalidReason ? 15548997 : 5763719,
				type: "rich",
				fields: [
					{ name: "Value", value: value, inline: false },
					{ name: "User IP", value: ip, inline: false },
				],
				timestamp: new Date(),
			};

			if (invalidReason) {
				embed.fields.push({ name: "Reason", value: invalidReason, inline: false });
			}

			await axios({
				method: "POST",
				url: process.env.DISCORD_WEBHOOK_LOGS,
				headers: { "Content-Type": "application/json" },
				data: JSON.stringify({
					embeds: [embed],
				}),
			});
		}
	}

	/**
	 * Logs a ban
	 */
	public async logBan(ip: string) {
		await axios({
			method: "POST",
			url: process.env.DISCORD_WEBHOOK_BANS,
			headers: { "Content-Type": "application/json" },
			data: JSON.stringify({
				embeds: [
					{
						title: "New IP Banned",
						color: 15548997,
						type: "rich",
						fields: [{ name: "IP", value: ip, inline: false }],
						timestamp: new Date(),
					},
				],
			}),
		});
	}

	/**
	 * Logs an unhandled error
	 */
	public async logUnhandledError(error: Error) {
		await axios({
			method: "POST",
			url: process.env.DISCORD_WEBHOOK_ERRORS,
			headers: { "Content-Type": "application/json" },
			data: JSON.stringify({
				embeds: [
					{
						color: 15548997,
						type: "rich",
						fields: [{ name: "Unhandled Error", value: error.message }],
						timestamp: new Date(),
					},
				],
			}),
		});
	}
}

export default new DiscordService();
