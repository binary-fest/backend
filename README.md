##  API Documentation
- baseurl: https://api-binaryfest.herokuapp.com
- development url: https://binaryfest-1111.herokuapp.com
###  Auth Api
#### - Register
- url : /api/auth/register
- method : POST
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
#### - Team Members
- url : /api/team/members
- method : GET
- header :
	```json
	auth: recent_token
	```
- res :
	```json
	{
		"message": [{
			"id_team": 15,
			"name": "Djarum",
			"email": "djarum@gmail.com",
			"institute": "UTY",
			"title": "Djarum IoT",
			"competition_type": "iot",
			"teamMembers": [
				{
					"id_team_member": 27,
					"name": "Jaja",
					"student_id": "519031188",
					"gender": "man",
					"isLeader": true,
					"phone": "12345678"
				},
				{
					"id_team_member": 28,
					"name": "Maria",
					"student_id": "519041055",
					"gender": "woman",
					"isLeader": false,
					"phone": "87654321"
				}
			]
		}]
	}
	```
#### - Team Submissions
- url : /api/team/submissions
- method : GET
- header :
	```json
	auth: recent_token
	```
- res :
	```json
	{
		"message": [
			{
				"id_team": 15,
				"name": "Djarum",
				"email": "djarum@gmail.com",
				"institute": "UTY",
				"title": "Djarum IoT",
				"competition_type": "iot",
				"teamSubmission": [
					{
						"id_team_submission": 2,
						"submission_type": 1,
						"url_files": "https://binaryfest.or.id/files",
						"status": "pending"
					}
				]
			}
		]
	}
	```