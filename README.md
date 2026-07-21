# n8n-nodes-powercode

Execute custom JavaScript code with 59+ built-in libraries in n8n workflows.

Power Code is the ultimate code execution node for n8n. Unlike the built-in Code node that ships with zero libraries, Power Code comes pre-loaded with 59+ production-ready JavaScript libraries — from data processing and validation to blockchain and media processing.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Installation

### n8n Community Edition

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter: `n8n-nodes-powercode`
5. Click **Install**
6. Find "Power Code" in your node list

### Docker Users

```yaml
environment:
  - N8N_COMMUNITY_PACKAGES_ENABLED=true
```

Then install through the UI as shown above.

## Operations

The Power Code node executes your custom JavaScript code in two modes:

- **Run Once for All Items** — Execute code once for all items. Access all items via `$input.all()` or `items` variable.
- **Run Once for Each Item** — Execute code once for each item. Access current item via `$input.item` or `item` variable.

All 59+ libraries are pre-loaded as global variables — no `require()` needed.

## Complete Library List (59 Working Libraries)

### Data Processing
`lodash (_)`, `dayjs`, `moment` (moment-timezone), `dateFns` (date-fns), `dateFnsTz` (date-fns-tz), `bytes`, `ms`, `uuid` (as `uuidv4`), `nanoid`

### Validation & Parsing
`joi`, `validator`, `Ajv`, `yup`, `zod`, `qs`

### Files & Documents
`ExcelJS` (exceljs) — supports streaming read/write for large files, `xlsxtream` — streaming XLSX reader, `XLSX` (xlsx) — classic XLSX read/write, `Papa` (papaparse), `ini`, `toml`

### Web & HTTP
`axios`, `cheerio`, `FormData` (form-data)

### Text & Content
`Handlebars`, `marked`, `htmlToText` (html-to-text), `xml2js`, `XMLParser` (fast-xml-parser), `YAML`, `pluralize`, `slug`, `stringSimilarity` (string-similarity), `fuzzy` (fuse.js)

### Security & Crypto
`CryptoJS` (crypto-js), `jwt` (jsonwebtoken), `bcrypt` (bcryptjs), `forge` (node-forge)

### Specialized
`QRCode` (qrcode), `iban`, `phoneNumber` (libphonenumber-js), `exiftool` (exiftool-vendored) — read/write EXIF metadata

### Natural Language
`franc` (franc-min), `compromise`

### Async Control
`pRetry` (p-retry)

### Data Operations
`jsonDiff` (json-diff-ts), `cronParser` (cron-parser)

### Blockchain & Crypto
`web3`, `solana` (@solana/web3.js), `bitcoin` (bitcoinjs-lib), `secp256k1` (@noble/secp256k1), `bip39` (@scure/bip39), `ccxt`, `coinGecko` (coingecko-api-v3)

### Media Processing
`ytdl` (@distube/ytdl-core), `ffmpeg` (fluent-ffmpeg), `ffmpegStatic` (ffmpeg-static)

## Usage Examples

### Data Transformation with lodash & dayjs

```js
const firstItem = items[0];
const name = _.get(firstItem, 'name', 'World');
return {
  greeting: 'Hello, ' + name + '!',
  timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};
```

### Web Scraping with axios & cheerio

```js
const response = await axios.get('https://example.com/products');
const $ = cheerio.load(response.data);
const products = [];
$('.product-card').each((i, elem) => {
  products.push({
    title: $(elem).find('.title').text().trim(),
    price: parseFloat($(elem).find('.price').text().replace('$', '')),
    inStock: $(elem).find('.stock-status').hasClass('available'),
  });
});
return _.filter(products, 'inStock');
```

### Excel File Processing (Streaming — supports large files)

```js
// Read large Excel files with streaming (memory efficient)
const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(binaryData);
for await (const worksheetReader of workbookReader) {
  for await (const row of worksheetReader) {
    // Process each row without loading entire file into memory
    const values = row.values;
  }
}

// Write Excel files with streaming
const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: fs.createWriteStream('output.xlsx') });
const sheet = workbook.addWorksheet('Report');
sheet.columns = [
  { header: 'Name', key: 'name' },
  { header: 'Email', key: 'email' },
];
items.forEach(item => sheet.addRow(item).commit());
await workbook.commit();
```

### JWT Authentication

```js
const token = jwt.sign(
  { userId: user.id, email: user.email },
  'your-secret-key',
  { expiresIn: '24h' }
);
const hashedPassword = await bcrypt.hash(password, 12);
return { token, hashedPassword };
```

### Data Validation

```js
const schema = joi.object({
  email: joi.string().email().required(),
  age: joi.number().min(18).max(100),
});
const { error, value } = schema.validate($input.item.json);
if (error) throw new Error(`Validation failed: ${error.message}`);
return value;
```

### EXIF Metadata Reading

```js
const { exiftool } = exiftool;
const tags = await exiftool.read('photo.jpg');
return {
  make: tags.Make,
  model: tags.Model,
  dateTaken: tags.DateTimeOriginal,
  gps: tags.GPSLatitude ? { lat: tags.GPSLatitude, lon: tags.GPSLongitude } : null,
};
```

## Compatibility

Compatible with n8n version 1.0+

## Version History

### 1.3.0
- Added `exiftool-vendored` library for reading/writing EXIF metadata

### 1.2.0
- Added `xlsx` library for classic XLSX read/write support

### 1.1.0
- Initial release with 59 built-in libraries

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [GitHub Repository](https://github.com/MaxLMGC/n8n-nodes-powercode)
