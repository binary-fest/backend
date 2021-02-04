##  API Documentation
baseurl: https://api-binaryfest.herokuapp.com
###  Auth Api
#### - Register
- url : /api/auth/register
- req :
	```json
	{
		"username": "adminbinary",
		"password": "12345678",
		"role": "ADMIN"
	}
	```
- res :
	- success
		```json
		message: "User was created"
		```
	- error
		- user already in used
			```json
			message: "User Already in Used"
			```
		- another error
			```json
			message: "error message",
			error:
			```
#### - Login
- url : /api/auth/login
- req :
	```json
	{
		"username": "adminbinary",
		"password": "123456789"
	}
	```
- res :
	- success
		```json
		message: "Login success",
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluYmluYXJ5IiwiaWF0IjoxNjEyMjU2MTY4LCJleHAiOjE2MTIyNjY5Njh9.ueU-ZMPdTBZqbzlotOHyynIZxgEfFXLCnYIzk0fH1eA"
		```
	- error
		- user already in used
			```json
			message: "User Already in Used"
			```
		- another error
			```json
			message: "error message",
			error:
			```
###  Team Api
#### - Team Register
- url : /api/competition/iot/register
- req :
	```json
	{
		"team": {
			"name": "binary",
			"judul": "binary IoT",
			"instansi": "UTY",
			"competition": "IoT"
		},
		"members": [
			{
				"name": "anggota binary 1",
				"gender": "man",
				"isLeader": true,
				"phone": "12345678",
				"ktm_base64": "Base64 => encode",
				"picture_base64": "Base64 => encode",
				"screenshot_base64": "Base64 => encode"
			},
			{
				"name": "anggota binary 2",
				"gender": "woman",
				"isLeader": false,
				"phone": "87654321",
				"ktm_base64": "Base64 => encode",
				"picture_base64": "Base64 => encode",
				"screenshot_base64": "Base64 => encode"
			}
		],
		"proposal_base64" : "Base64 => encode"
	}
	```
- res :
	- success
		```json
		message: "Team was added"
		```
	- error
		- Request not valid
			```json
			message: "Request not valid"
			```
		- Leader must be 1
			```json
			message: "Leader must be 1"
			```
		- another error
			```json
			message: "error message",
			error:
			```