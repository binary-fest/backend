##  API Documentation
- baseurl: https://api-binaryfest.herokuapp.com
- development url: https://binaryfest-1111.herokuapp.com
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
			"title": "binary IoT",
			"institute": "UTY",
			"email": "binary@gmail.com",
			"competition_type": "IoT",
			"url_files": "https://binaryfest.or.id/files"
		},
		"members": [
			{
				"name": "anggota binary 1",
				"student_id": "519031188",
				"gender": "man",
				"isLeader": true,
				"phone": "12345678"
			},
			{
				"name": "anggota binary 2",
				"student_id": "519041055",
				"gender": "woman",
				"isLeader": false,
				"phone": "87654321"
			}
		]
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
		- Email must be unique each team
			```json
			message: "Email has been registered by another team"
			```
		- another error
			```json
			message: "error message",
			error:
			```
### Service API
#### - Send Email
- url: /api/service/send-email
- req:
	```json
	{
		"mailType": "registration",
		"subject": "Pendaftaran BinaryFest2021",
		"receiver": [
			{
				"data": {
					"name": "Tim Gundala"
				},
				"address": "timgundala@gmail.com"
			},
			{
				"data": {
					"name": "Tim Superman"
				},
				"address": "timsuperman@gmail.com"
			},
			{
				"data": {
					"name": "Tim Thor"
				},
				"address": "timthor@gmail.com"
			},
			{
				"data": {
					"name": "Tim Batman"
				},
				"address": "timbatman@gmail.com"
			}
		]
	}
	```
- res:
	- success
		```json
		message: "Email was sent",
		success: [
			"timbatman@gmail.com", 
			"timthor@gamil.com",
			"timsuperman@gmail.com"
		],
		failed: ["timgundala@gmail.com"]
		```
	- error
		- Max email recipients
		```json
		message: "Max email recipients are 20"
		```
		- No email was sent
		```json
		message: "No email was sent"
		```
