# Server Side

## API Design

### 1. POST /ticket

Start a new scan operation.
    
#### Input

`url` - URL of the file to be scanned
   
#### Output

##### 202

Success. A new scan operation is started.

`id` - ID of the scan operation

##### 208

Success. The file has already been scanned before. The previous result is returned.

`result` - Status of the scan operation, i.e. `malicious`, `safe`

##### 400

Failed due to invalid parameters.

##### 401

Authentication failed.


### 2. GET /ticket/:id

Get the result of the scan.
    
#### Input

`id` - ID of the scan operation
    
#### Output

##### 200

Success. The scan is completed.

`result` - Status of the scan operation, i.e. `malicious`, `safe`

##### 202

Scanning in progress.
