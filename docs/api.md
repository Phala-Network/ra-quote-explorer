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
  "checksum": "0x...",
  "url": "https://proof.t16z.com/reports/0x..."
}
</pre>

`url` is the URL to the report page.

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

### Code Examples

#### Python Example

```python
import requests

# File Upload Example
def upload_file(file_path):
    url = 'http://proof.t16z.com/api/upload'
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url, files=files)
        
    if response.status_code == 200:
        data = response.json()
        print(f"Success! Report URL: {data['url']}")
        print(f"Checksum: {data['checksum']}")
    else:
        print(f"Error: {response.json()['error']}")

# Raw Data Verification Example
def verify_hex_data(hex_string):
    # Remove '0x' prefix if present
    hex_string = hex_string.removeprefix('0x')
    url = f'http://proof.t16z.com/raw/{hex_string}'
    
    response = requests.get(url, allow_redirects=False)
    if response.status_code == 301:
        report_url = response.headers['Location']
        print(f"Success! Redirecting to report: {report_url}")
    else:
        print("Error: Invalid hex string")

# Usage examples
upload_file('path/to/your/file.txt')
verify_hex_data('0x1234abcd')
```

#### Python Async Example (with asyncio + httpx)

```python
import asyncio
import httpx
from pathlib import Path

# File Upload Example
async def upload_file_async(file_path: str | Path):
    url = 'http://proof.t16z.com/api/upload'
    
    async with httpx.AsyncClient() as client:
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = await client.post(url, files=files)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success! Report URL: {data['url']}")
            print(f"Checksum: {data['checksum']}")
            return data
        else:
            print(f"Error: {response.json()['error']}")
            return None

# Raw Data Verification Example
async def verify_hex_data_async(hex_string: str):
    # Remove '0x' prefix if present
    hex_string = hex_string.removeprefix('0x')
    url = f'http://proof.t16z.com/raw/{hex_string}'
    
    async with httpx.AsyncClient(follow_redirects=False) as client:
        response = await client.get(url)
        
        if response.status_code == 301:
            report_url = response.headers['Location']
            print(f"Success! Redirecting to report: {report_url}")
            return report_url
        else:
            print("Error: Invalid hex string")
            return None

# Usage examples
async def main():
    # Single request
    await upload_file_async('path/to/your/file.txt')
    await verify_hex_data_async('0x1234abcd')
    
    # Parallel requests
    files_to_upload = ['file1.txt', 'file2.txt']
    hex_strings = ['0x1234abcd', '0xdeadbeef']
    
    # Upload multiple files concurrently
    upload_tasks = [upload_file_async(f) for f in files_to_upload]
    upload_results = await asyncio.gather(*upload_tasks)
    
    # Verify multiple hex strings concurrently
    verify_tasks = [verify_hex_data_async(h) for h in hex_strings]
    verify_results = await asyncio.gather(*verify_tasks)

if __name__ == '__main__':
    asyncio.run(main())

#### Node.js Example

```javascript
// File Upload Example
async function uploadFile(filePath) {
  const FormData = require('form-data');
  const fs = require('fs');
  const fetch = require('node-fetch');

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await fetch('http://proof.t16z.com/api/upload', {
      method: 'POST',
      body: form
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`Success! Report URL: ${data.url}`);
      console.log(`Checksum: ${data.checksum}`);
    } else {
      console.error(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

// Raw Data Verification Example
async function verifyHexData(hexString) {
  // Remove '0x' prefix if present
  hexString = hexString.replace(/^0x/, '');
  
  try {
    const response = await fetch(`http://proof.t16z.com/raw/${hexString}`, {
      redirect: 'manual' // Prevent auto-redirect to handle it manually
    });

    if (response.status === 301) {
      const reportUrl = response.headers.get('location');
      console.log(`Success! Redirecting to report: ${reportUrl}`);
    } else {
      console.error('Error: Invalid hex string');
    }
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

// Usage examples
uploadFile('path/to/your/file.txt');
verifyHexData('0x1234abcd');
```

#### Browser JavaScript Example

```javascript
// File Upload Example
async function uploadFile(fileInput) {
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`Success! Report URL: ${data.url}`);
      console.log(`Checksum: ${data.checksum}`);
    } else {
      console.error(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

// Raw Data Verification Example
async function verifyHexData(hexString) {
  // Remove '0x' prefix if present
  hexString = hexString.replace(/^0x/, '');
  
  try {
    const response = await fetch(`/raw/${hexString}`);
    if (response.redirected) {
      window.location.href = response.url;
    } else {
      console.error('Error: Invalid hex string');
    }
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

// Usage examples with HTML
/*
<input type="file" id="fileInput" onChange="uploadFile(this)">
<button onClick="verifyHexData('0x1234abcd')">Verify Hex</button>
*/
```

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