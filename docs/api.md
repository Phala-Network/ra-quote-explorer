# API Documentation

## File Upload API

Upload a file for verification. This endpoint implements rate limiting and file size restrictions.

### Endpoint

```
POST /api/upload
```

### Request

- Content-Type: `multipart/form-data`
- Max file size: 20KB

#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | The file to be verified |

### Response

#### Headers

| Name | Description |
|------|-------------|
| X-RateLimit-Limit | Maximum number of requests allowed per window (10 per minute) |
| X-RateLimit-Remaining | Number of requests remaining in the current window |
| X-RateLimit-Reset | Time in seconds until the rate limit resets |

#### Success Response (200)

<pre>
{
  "success": true,
  "checksum": "0x..."
}
</pre>

#### Error Responses

##### Bad Request (400)
When file is missing or invalid:
<pre>
{
  "error": "Please upload a file",
  "remainingAttempts": 4
}
</pre>

##### Too Many Requests (429)
When rate limit is exceeded:
<pre>
{
  "error": "Too many requests. Please try again later."
}
</pre>

##### Forbidden (403)
When IP is blocked due to too many validation errors:
<pre>
{
  "error": "Too many validation errors. Please try again later."
}
</pre>

### Rate Limiting

- 10 requests per minute per IP
- 5 validation errors per hour before IP is blocked
- IP block duration: 24 hours

### Example

Using curl:
<pre>
curl -X POST \
  -F "file=@/path/to/your/file.txt" \
  -i \
  http://proof.t16z.com/api/upload
</pre>

## Raw Data Verification API

Convert hex data to file and verify it, then redirect to the report page.

### Endpoint

```
GET /raw/[checksum]?hex={hexString}
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| hex | string | Yes | Hex string of the data to verify |

### Response

#### Success Response (301)
Redirects to `/reports/{checksum}` if verification is successful

#### Error Response (400)
Returns "Bad Request" if hex string is invalid or verification fails

### Example

Using curl:
<pre>
curl -i "http://proof.t16z.com/raw?hex=0x1234abcd"
</pre>

Using fetch:
<pre>
const response = await fetch(`/raw?hex=${hexString}`);
if (response.redirected) {
  window.location.href = response.url;
}
</pre>

### Hex String Format

- Can optionally start with "0x"
- Must contain an even number of characters
- Must only contain valid hexadecimal characters (0-9, a-f, A-F)
- Empty strings are not allowed

Example valid hex strings:
- "1234abcd"
- "0x1234abcd"
- "DEADBEEF"