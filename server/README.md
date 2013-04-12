# Server Side

## API Design

### 1. POST /tickets

Start a new scan operation.
    
#### Input

`url` - URL of the file to be scanned
   
#### Output

##### 202

Success. A new scan operation is started.

`id` - ID of the scan operation

##### 400

Failed due to invalid parameters.


### 2. GET /tickets

Get the results of all scans.
    
#### Input

No input is required.
    
#### Output

##### 200

Success. The scan is completed. A JSON object containing the list of downloads and their status is returned.

Example:

```json
{
	"http://nodejs.org/dist/v0.10.4/node-v0.10.4.pkg": "safe",
	"http://github-windows.s3.amazonaws.com/GitHubSetup.exe": "pending",
	"http://malicious.com/virus.exe": "malicious"
}
```