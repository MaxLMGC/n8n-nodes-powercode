import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class PowerCode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Power Code',
		name: 'powerCode',
		icon: { light: 'file:powercode.svg', dark: 'file:powercode.dark.svg' },
		group: ['transform'],
		version: 1,
		description: 'Execute custom JavaScript code with 58+ built-in libraries',
		subtitle: 'Write and run custom code',
		defaults: {
			name: 'Power Code',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				options: [
					{
						name: 'Run Once for All Items',
						value: 'all',
						description:
							'Execute code once for all items. Access all items via $input.all() or items variable.',
					},
					{
						name: 'Run Once for Each Item',
						value: 'each',
						description:
							'Execute code once for each item. Access current item via $input.item or item variable.',
					},
				],
				default: 'all',
				description: 'How the code should be executed',
			},
			{
				displayName: 'JavaScript Code',
				name: 'code',
				type: 'string',
				noDataExpression: true,
				typeOptions: {
					editor: 'jsEditor',
					rows: 15,
				},
				default: `// Built-in libraries available:
//   _ / lodash, axios, cheerio, dayjs, moment, dateFns, dateFnsTz
//   joi / Joi, validator, uuid, Ajv, yup, zod, xml2js, XMLParser, YAML
//   papaparse / Papa, Handlebars, CryptoJS, forge, jwt, bcrypt / bcryptjs
//   QRCode, ExcelJS, xlsxtream, xlsx, fuzzy, stringSimilarity, slug, pluralize, qs, FormData
//   ini, toml, nanoid, bytes, phoneNumber, iban, web3, ytdl
//   ffmpeg, ffmpegStatic, utils, ccxt, coinGecko, solana, bitcoin
//   secp256k1, bip39, franc, compromise, pRetry, htmlToText
//   marked, jsonDiff, cronParser, ms
//
// Mode "each" variables:  item, $item, $index, $input
// Mode "all" variables:   items, $input
//
// Return a value to use as output.

const firstItem = items[0];
const name = _.get(firstItem, 'name', 'World');
return {
	greeting: 'Hello, ' + name + '!',
	timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};`,
				required: true,
				description: 'The JavaScript code to execute',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const mode = this.getNodeParameter('mode', 0, 'all') as string;

		// Load all built-in libraries
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const _ = require('lodash');
		const lodash = _;
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const axios = require('axios');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const cheerio = require('cheerio');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const dayjs = require('dayjs');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const moment = require('moment-timezone');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const dateFns = require('date-fns');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const dateFnsTz = require('date-fns-tz');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const joi = require('joi');
		const Joi = joi;
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const validator = require('validator');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const { v4: uuidv4 } = require('uuid');
		const uuid = { v4: uuidv4 };
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const Ajv = require('ajv');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const yup = require('yup');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const xml2js = require('xml2js');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const { XMLParser } = require('fast-xml-parser');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const YAML = require('yaml');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const papaparse = require('papaparse');
		const Papa = papaparse;
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const Handlebars = require('handlebars');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const CryptoJS = require('crypto-js');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const forge = require('node-forge');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const jwt = require('jsonwebtoken');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const bcrypt = require('bcryptjs');
		const bcryptjs = bcrypt;
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const QRCode = require('qrcode');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const ExcelJS = require('exceljs');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const xlsxtream = require('xlsxtream');
		let xlsx: Record<string, unknown>;
		let XLSX: Record<string, unknown>;
		try {
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			xlsx = require('xlsx');
			XLSX = xlsx;
		} catch (e) {
			// xlsx native module (wmf) may fail in sandboxed environments
			xlsx = {};
			XLSX = {};
		}
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const fuzzy = require('fuse.js');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const stringSimilarity = require('string-similarity');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const slug = require('slug');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const pluralize = require('pluralize');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const qs = require('qs');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const FormData = require('form-data');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const ini = require('ini');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const toml = require('toml');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const { nanoid } = require('nanoid');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const bytes = require('bytes');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const phoneNumber = require('libphonenumber-js');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const iban = require('iban');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const web3 = require('web3');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const ytdl = require('@distube/ytdl-core');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const ffmpeg = require('fluent-ffmpeg');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const ffmpegStatic = require('ffmpeg-static');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const ccxt = require('ccxt');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const coinGecko = require('coingecko-api-v3');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const solana = require('@solana/web3.js');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const bitcoin = require('bitcoinjs-lib');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const secp256k1 = require('@noble/secp256k1');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const bip39 = require('@scure/bip39');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const franc = require('franc-min');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const compromise = require('compromise');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const pRetry = require('p-retry');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const htmlToText = require('html-to-text');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const marked = require('marked');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const jsonDiff = require('json-diff-ts');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const cronParser = require('cron-parser');
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const ms = require('ms');

		const utils = {
			sleep: (duration: number) => new Promise((resolve) => setTimeout(resolve, duration)),
			clone: <T>(obj: T): T => JSON.parse(JSON.stringify(obj)),
		};

		if (mode === 'all') {
			// Run Once for All Items
			try {
				const code = this.getNodeParameter('code', 0, '') as string;
				const allItems = items.map((item) => item.json);

				const fn = async function (this: IExecuteFunctions) {
					const $json = items.length > 0 ? items[0].json : undefined;
					const allItemsRef = allItems;
					const $input = {
						all: () => allItemsRef,
						first: () => allItemsRef[0],
						item: allItemsRef[0],
					};
					return eval(`(async () => { ${code} })()`);
				}.bind(this);

				const result = await fn();

				if (Array.isArray(result)) {
					for (let i = 0; i < result.length; i++) {
						returnData.push({
							json: result[i],
							pairedItem: { item: i },
						});
					}
				} else if (result !== undefined) {
					returnData.push({
						json: result,
						pairedItem: { item: 0 },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: 0 },
					});
				} else {
					throw new NodeOperationError(this.getNode(), error as Error, {
						itemIndex: 0,
					});
				}
			}
		} else {
			// Run Once for Each Item
			for (let i = 0; i < items.length; i++) {
				try {
					const code = this.getNodeParameter('code', i, '') as string;
					const currentItem = items[i].json;
					const allItemsForEach = items.map((item) => item.json);

					const fn = async function (this: IExecuteFunctions) {
						const $json = currentItem;
						const item = currentItem;
						const $item = currentItem;
						const $index = i;
						const $input = {
							all: () => allItemsForEach,
							first: () => allItemsForEach[0],
							item: currentItem,
						};
						return eval(`(async () => { ${code} })()`);
					}.bind(this);

					const result = await fn();

					returnData.push({
						json: result !== undefined ? result : currentItem,
						pairedItem: { item: i },
					});
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({
							json: { error: (error as Error).message },
							pairedItem: { item: i },
						});
						continue;
					}
					throw new NodeOperationError(this.getNode(), error as Error, {
						itemIndex: i,
					});
				}
			}
		}

		return [returnData];
	}
}
