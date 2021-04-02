##  API Documentation
- baseurl: https://api-binaryfest.herokuapp.com
- development url: https://binaryfest-1111.herokuapp.com [updated: 01/04/2021 11:32:00]
###  Auth Api
#### - Login
- url : /api/auth/login
- method : POST
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
		{
			"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluaW90IiwiaWF0IjoxNjE2NDkyMzMwLCJleHAiOjE2MTY1MDMxMzB9.94Twb8BQvb_YIo08u9GeCCMBNbWSxW4YDK-nVX67_LM",
			"details": {
				"username": "adminiot",
				"role": "iot"
			}
		}
		```
	- error
		- Passwird not valid
			```json
			message: "UnencryptedPasswordIsNotValid"
			```
		- another error
			```json
			message: "error message",
			error:
			```
###  Team Api
#### - Team Register
- description: pendaftaran peserta/tim lomba & submission ke-1
- url : /api/competition/register
- method : POST
- req :
	```json
	{
		"team": {
			"name": "BinaryFest",
			"title": "Binaryfest IoT",
			"institute": "UTY",
			"email": "binaryfest@gmail.com",
			"competition_type": "uiux"
		},
		"submission": {
			"submission_type": "1",
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
#### - Update Team Status
- description: merubah status tim dari pending ke approved / rejected & kirim email kepada tim
- url : /api/team/status
- method : PUT
- header : 
	```json
	auth: recent_token
	```
- req :
	```json
	{
		"email": "kuda@gmail.com",
		"status": "approved"
	}
	```
	status : 
	> - approved
	> - rejected
- res :
	- success
		```json
		"message": "Email sended; Set status success"
		```
	- error
		- email not registered
			```json
			"message": "Email is not registered"
			```
		- status not valid
			```json
			"message": "Status not available"
			```
		- role does not allow
			```json
			"message": "Role does not allow to change this team status"
			```
		- another error
			```json
			"message": "error message",
			"error": {error}
			```
#### - Show All Team
- description: menampilkan semua tim berdasarkan role admin & kompetisi yang diikuti tim
- url : /api/teams
- method : GET
- header :
	```json
	auth: recent_token
	```
- res :
	- success
		```json
		{
		"message": [
			{
				"id_team": 3,
				"name": "Team Angsa",
				"email": "angsa@gmail.com",
				"institute": "University of Harvard",
				"title": "Angsa Iot",
				"competition_type": "iot",
				"createdAt": "2021-03-22T07:18:24.990Z",
				"teamMembers": [
					{
						"id_team_member": 4,
						"name": "Dalmadi",
						"student_id": "519041055",
						"gender": "man",
						"isLeader": true,
						"phone": "87654321"
					},
					{
						"id_team_member": 3,
						"name": "Dilah",
						"student_id": "519031188",
						"gender": "women",
						"isLeader": false,
						"phone": "12345678"
					}
				],
				"teamSubmission": [
					{
						"id_team_submission": 2,
						"submission_type": 1,
						"url_files": "https://binaryfest.or.id/files",
						"status": "approved",
						"createdAt": "2021-03-22T07:18:25.008Z"
					}
				]
			},
			{
				...another IoT team
			}
		]
		}
		```
	- error
		- no team registered
			```json
			"message": "no team registered"
			```
#### - Show Team by id
- description : menampilkan tim berdasarkan role admin & id tim
- url : /api/team/:id_team
- method : GET
- header :
	```json
	auth: recent_token
	```
- res :
	- success
		```json
		{
			"message": {
				"id_team": 1,
				"name": "Team Kura",
				"email": "kura@gmail.com",
				"institute": "University of Nevada - Reno",
				"title": "Kura UIUX",
				"competition_type": "uiux",
				"createdAt": "2021-03-22T07:13:16.814Z",
				"teamMembers": [
					{
						"id_team_member": 1,
						"name": "Farah",
						"student_id": "519031188",
						"gender": "man",
						"isLeader": false,
						"phone": "12345678"
					},
					{
						"id_team_member": 2,
						"name": "Rere",
						"student_id": "519041055",
						"gender": "woman",
						"isLeader": true,
						"phone": "87654321"
					}
				],
				"teamSubmission": [
					{
						"id_team_submission": 1,
						"submission_type": 1,
						"url_files": "https://binaryfest.or.id/files",
						"status": "approved",
						"createdAt": "2021-03-22T07:13:16.829Z"
					}
				]
			}
		}
		```
	- error
		- team not registered
			```json
			"message": "Team not registered or role not allowed"
			```
###  Team Submission
#### - Check Submission Token
- description : cek token submission (token didapat dari email tim ketika status tim 'approved')
- url : /api/submission/check
- method : GET
- request query :
	```json
	?token=submission_token
	```
- res : 
	- success
		```json
		{
			"message": "Token found",
			"team": {
				"name": "Team Kura",
				"email": "kura@gmail.com",
				"institute": "University of Nevada - Reno"
			}
		}
		```
	- error
		- token unvalid
			```json
			message: "Token unvalid",
			reason: error message
			```
		- token expired
			```json
			message: "Token expired",
			```
		- another error
			```json
			message: error message,
			err
			```